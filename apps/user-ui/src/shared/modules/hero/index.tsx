"use client"
import { MoveRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Hero = () => {
  const router = useRouter();

  return (
    <div className='bg-[#115061] h-[85vh] flex flex-col justify-center w-full'>
      <div className='md:w-[80%] w-[90%] m-auto md:flex h-full items-center'>
        <div className='md:w-1/2'>
          <p className='font-Roboto font-normal text-white pb-2 text-xl'>
            Starting from 40$
          </p>
          <h1 className='text-white text-6xl font-extrabold font-Roboto '>
            The best watch <br/>
            collection 2025
          </h1>
          <p className='font-Oregano text-3xl pt-4 text-white'>
            Exclusive offer <span className='text-yellow-400'>10% </span>
             this week
          </p>
          <br />
          <button onClick={ ()=>router.push('/product')}
            className='w-[140px] gap-2 font-semibold h-[40px] bg-white hover:bg-blue-500 flex items-center justify-center border-b rounded-md'
          >
            Shop Now <MoveRight/>
          </button>
        </div>
        <div className='md:w-1/2 flex justify-center'>
        <Image
        alt=''
        src={"https://ik.imagekit.io/anasF60/books/covers/Atomic_Habits_3brmfdjwNk.jpg"}
        width={450}
        height={450}
        />
        </div>
      </div>
    </div>
  )
}

export default Hero
