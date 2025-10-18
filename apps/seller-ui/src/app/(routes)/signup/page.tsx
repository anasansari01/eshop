"use client"
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form'
import React, { useRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import axios, {AxiosError} from 'axios'
import { countries } from 'apps/seller-ui/src/utils/countries';

const Signup = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userData, setUserData] = useState<FormData | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
 
  const router = useRouter();

  const {register, handleSubmit, formState: {errors}} = useForm();

  const setResentTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if(prev <= 1){
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  const signUpMutation =  useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/user-registration`, data);
      return response.data;
    },
    onSuccess: (_, formData) => {
      setUserData(formData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      setResentTimer();
    }
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if(!userData) return;
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-user`,{
        ...userData,
        otp: otp.join(""),
      })
      return response.data;
    },
    onSuccess: () => {
      router.push('/login');
    }
  })
  
  const onSubmit = (data: any) => {
    signUpMutation.mutate(data);
    console.log(data);
  };

  const handleOtpChange = (index: number, value: string) => {
    if(!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if(value && index < inputRefs.current.length - 1){
      inputRefs.current[index+1]?.focus();
    }
  }
  
  const handleOtpKeyDown = (index: number, e:React.KeyboardEvent<HTMLInputElement>) =>{
    if(e.key  === "Backspace" && !otp[index] && index > 0){
      inputRefs.current[index-1]?.focus();
    }
  }

  const resendOtp = () =>{
    if(userData){
      signUpMutation.mutate(userData);
    }
  }
  

  return (
    <div className="w-full flex items-center flex-col pt-10 min-h-screen">
      {/* stepper */}
      <div className='relative flex items-center justify-between md:w-[50%] mb-8'>
        <div className='absolute top-[25%] left-0 w-[80%] md:w-[90%] h-1 bg-gray-300 -z-10'/>
        {[1, 2, 3].map((step) => (
          <div key={step}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${step <= activeStep ? "bg-blue-600" : "bg-gray-300"}`}>
              {step}
            </div>
            <span className='ml-[-15px]'>
              {
                step === 1 ? "Create Account" : step === 2 ? "Setup Shop" : "Connect Bank"
              }
            </span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className='md:w-[480px] p-8 bg-white shadow rounded-lg'>
        {activeStep === 1 && (
          <>
            {!showOtp ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <h3 className='text-center font-semibold text-2xl mb-4'>
                  Create Account
                </h3>
                <label className='block text-gray-700 mb-1'>Name</label>
                <input
                  type="text"
                  placeholder="Enter your name..."
                  className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
                )}
                <label className='block text-gray-700 mb-1'>Email</label>
                <input
                  type="email"
                  placeholder="support@eshop.com"
                  className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{String(errors.email.message)}</p>
                )}
                
                <label className='block text-gray-700 mb-1'>Phone Number</label>
                <input
                  type="tel"
                  placeholder="1234567***"
                  className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                  {...register("phone_number", {
                    required: "Phone Number is required",
                    pattern: {
                      value: /^\+?[1-9]\d{1,14}$/, // Follow E.164 format
                      message: "Invalid phone number format",
                    },
                    minLength: {
                      value: 10,
                      message: "Phone number must be atleast 10 digits",
                    },
                    maxLength: {
                      value: 15,
                      message: "Phone number cannot exceed 15 digits"
                    }
                  })}
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm">{String(errors.phone_number.message)}</p>
                )}

                <label className='block text-gray-700 mb-1'>Country</label>
                <select
                className="w-full p-2 border border-gray-300 outline-0 !rounded-[4px] mb-1"
                {...register("country", {required: "Country is required"})}
                > 
                  <option value="">Select your country</option>
                  {countries.map((country)=>(
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>

                <label className='block text-gray-700 mb-1'>Password</label>
                <div className='relative'>
                    <input
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be atleast 6 characters",
                        },
                      })}
                    />
                    <button type='button' onClick={()=>setPasswordVisible(!passwordVisible)} 
                    className='absolute inset-y-0 right-3 flex items-center text-gray-400'  
                    >
                      {passwordVisible ? <Eye/> : <EyeOff/>}
                    </button>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{String(errors.password.message)}</p>
                  )}
                </div>
                <button
                  type='submit'
                  disabled={signUpMutation.isPending}
                  className='w-full text-lg cursor-pointer mt-4 bg-black text-white py-2 rounded-lg'
                >
                  {signUpMutation.isPending ? "Signing up..." : "Signup"}
                </button>
                {signUpMutation.isError && signUpMutation.error instanceof AxiosError && (
                  <p className='text-red-500 text-sm mt-2'>
                    {signUpMutation.error.response?.data?.message ||
                    signUpMutation.error.message}
                  </p>
                )}
                <p className='text-center pt-3'>
                  Already have an account? {" "}
                  <Link href={"/login"} className='text-blue-500'>
                    Login
                  </Link>
                </p>
              </form>
            ):(
              <div>
                <h3 className='text-xl font-semibold text-center mb-4'>Enter OTP</h3>
                <div className='flex justify-center gap-6'>
                  {otp?.map((digit, index) => (
                    <input 
                      key={index} 
                      type='text'
                      ref={(el)=>{
                        if (el) inputRefs.current[index] = el
                      }}
                      maxLength={1}
                      className='w-12 h-12 text-center border border-gray-300 ouline-none !rounded'
                      value={digit}
                      onChange={(e)=> handleOtpChange(index, e.target.value)}
                      onKeyDown={(e)=>handleOtpKeyDown(index, e)}
                    />
                  ))}
                </div>
                <button 
                  className='w-full mt-4 text-lg cursor-pointer bg-blue-500 text-white py-2 rounded-lg'
                  disabled={verifyOtpMutation.isPending}
                  onClick={() => verifyOtpMutation.mutate()}
                >
                  {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
                </button>
                <p className='text-center text-sm mt-4'> 
                  {canResend ? (
                    <button 
                      className='text-blue-500 cursor-pointer'
                      onClick={resendOtp}
                    >
                      Resend OTP
                    </button>
                  ) : (
                    `Resend OTP in ${timer}s`
                  )}
                </p>
                {verifyOtpMutation?.isError && verifyOtpMutation.error instanceof AxiosError && (
                  <p className='text-red-500 text-sm mt-2'>
                    {verifyOtpMutation.error.response?.data?.message || verifyOtpMutation.error.message}
                  </p>
                )

                }
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Signup
