import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "@packages/libs/prisma";
import jwt from 'jsonwebtoken'
import { AuthError, ValidationError } from "@packages/error-handler";
import { checkOtpRestriction, trackOtpRequest, validateRegistrationData, sendOtp, verifyOtp } from "../utils/auth.helper";
import { setCookie } from "../utils/cookies/setCookie";
import { name } from "ejs";

// Register a new User.
export const userRegistration = async (req: Request, res: Response, next: NextFunction) =>{
  try {
    validateRegistrationData(req.body, "user");
    const {name, email} = req.body;

    const existingUser = await prisma.users.findUnique({where: {email}});

    if(existingUser){
      return next(new ValidationError("User already exist with this email"));
    }

    await checkOtpRestriction(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(name, email, "user-activation-mail");

    res.status(200).json({
      message: "OTP sent to email. Please verify your account.",
    });
  } catch (error) {
    return next(error);
  }
}

// Verify user with Otp
export const verifyUser = async (req: Request, res:Response, next: NextFunction) =>{
  try {
    const {name, email, otp, password} = req.body;
    if(!name || !email || !otp || !password){
      return next(new ValidationError("All fields are required!"))
    }

    const existingUser = await prisma.users.findUnique({where: {email}});

    if(existingUser){ return next(new ValidationError("User already exists with this email!"));}

    await verifyOtp(email, otp, next);

    const hashPassword = await bcrypt.hash(password, 10);

    await prisma.users.create({
      data: {name, email, password: hashPassword},
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    })
  } catch (error) {
    return next(error);
  } 
}

// login user
export const loginUser = async (req: Request, res:Response, next: NextFunction) => {
  try {
    const {email, password} = req.body;

    if(!email || ! password){
      return next(new ValidationError("Email and password are required!"));
    }

    const user = await prisma.users.findUnique({where: {email}});
    if(!user){
      return next(new AuthError("User doesnt exist!"));
    }
    // verify password
    const isMatch = await bcrypt.compare(password, user.password!);
    if(!isMatch){
      return next(new AuthError("Invalid email or password!"));
    }

    // Generate refresh access token
    const accessToken = jwt.sign(
      {id: user.id, role: "user"},
      process.env.ACCESS_TOKEN_SECRET as string,
      {
      expiresIn: "15m"
      }
    );

    const refreshToken = jwt.sign(
      {id: user.id, role: "user"},
      process.env.REFRESH_TOKEN_SECRET as string,
      {
      expiresIn: "7d"
      }
    );

    // Store the refresh and access token in a httpOnly secure cookie.
    setCookie(res, "refresh_token", refreshToken);
    setCookie(res, "access_token", accessToken);

    res.status(200).json({
      message: "Login successfully!",
      user: {id: user.id, name: user.name, email: user.email}
    })
  } catch (error) {
    return next(error);
  }
}