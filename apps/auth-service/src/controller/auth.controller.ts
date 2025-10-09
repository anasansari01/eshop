import { NextFunction, Request, Response } from "express";
import prisma from "@packages/libs/prisma";
import { ValidationError } from "@packages/error-handler";
import { checkOtpRestriction, trackOtpRequest, validateRegistrationData } from "../utils/auth.helper";
import { sendOtp } from '../utils/auth.helper';

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

