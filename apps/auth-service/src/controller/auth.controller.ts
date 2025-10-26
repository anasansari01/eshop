import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "@packages/libs/prisma";
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { AuthError, ValidationError } from "@packages/error-handler";
import { checkOtpRestriction, trackOtpRequest, validateRegistrationData, sendOtp, verifyOtp, handleForgotPassword, verifyForgotPasswordOtp } from "../utils/auth.helper";
import { setCookie } from "../utils/cookies/setCookie";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! ,{
  apiVersion: "2024-06-20" as any,
})

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

// Refresh token
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies["refresh_token"] ||
    req.cookies["seller_refresh_token"] || 
    req.headers.authorization?.split(" ")[1];

    if(!refreshToken) return new ValidationError("Unauthorized!, No refresh token.");

    const decoded = jwt.verify(
      refreshToken, 
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as {id: string, role: string}

    if(!decoded || !decoded.id || !decoded.role){
      return new JsonWebTokenError("Forbidden!, Invalid refresh token");
    }

    let account;

    if(decoded.role === "user"){
      account = await prisma.users.findUnique({where: {id: decoded.id}});
    } else if(decoded.role === "seller"){
      account = await prisma.sellers.findUnique({where: {id: decoded.id}, include: {shop: true}});
    }

    if(!account) return new AuthError("Forbidden!, User/Seller not found");

    const newAccessToken = jwt.sign(
      {id: decoded.id, role: decoded.role},
      process.env.ACCESS_TOKEN_SECRET as string,
      {expiresIn: "15m"}
    );
    
    if(decoded.role === "user"){
      setCookie(res, "access_token", newAccessToken);
    }else if(decoded.role === "seller"){
      setCookie(res, "seller_access_token", newAccessToken);
    }

    return res.status(201).json({success: true});
  } catch (error) {
    return next(error);
  }
}

// get logged in user 
export const getUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    res.status(201).json({
      success: true,
      user
    })
  } catch (error) {
    next(error);
  }
}

// user forgot password
export const userForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  await handleForgotPassword(req, res, next, "user");
}

// Verify forgot password OTP
export const verifyUserForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  await verifyForgotPasswordOtp(req, res, next);
}

// Reset user password
export const resetUserPassword = async (req: Request, res: Response, next: NextFunction) =>{
  try {
    const {email, newPassword} = req.body;
    if(!email || !newPassword) return next(new ValidationError("Email and new password are required!"));

    const user = await prisma.users.findUnique({where: {email}});
    if(!user) return next(new ValidationError("User not found!"));

    // Compare new password with the existing one.
    const isSamePassword = await bcrypt.compare(newPassword, user.password!);

    if(isSamePassword) return next(new ValidationError("New password cannot be the same as old password!"));
   
    const hashPassword = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({where:{email}, data: {password: hashPassword}});

    res.status(200).json({
      message: "Password reset successfully!"
    });
  } catch (error) {
    next(error);
  }
}

// Register a new seller
export const registerSeller = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateRegistrationData(req.body, "seller");
    const {name, email} = req.body;

    const existingSeller = await prisma.sellers.findUnique({where: {email}});
    if(existingSeller){
      throw new ValidationError("Seller already exists with this Email!");
    }

    await checkOtpRestriction(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(name, email, "seller-activation-mail");

    res.status(200).json({
      message: "OTP sent to email. Please verify your account."
    });
  } catch (error) {
    next(error);
  }
}

// Verify seller with Otp
export const verifySeller = async (req: Request, res:Response, next: NextFunction) =>{
  try {
    const {name, email, otp, password, phone_number, country} = req.body;
    if(!name || !email || !otp || !password || !phone_number || !country){
      return next(new ValidationError("All fields are required!"))
    }

    const existingUser = await prisma.sellers.findUnique({where: {email}});

    if(existingUser){ return next(new ValidationError("Seller already exists with this email!"));}

    await verifyOtp(email, otp, next);

    const hashPassword = await bcrypt.hash(password, 10);

    const seller = await prisma.sellers.create({
      data: {name, email, password: hashPassword, phone_number, country},
    });

    return res.status(201).json({
      seller,
      message: "Seller registered successfully",
    })
  } catch (error) {
    return next(error);
  }
}

// Create a shop
export const createShop = async (req: Request, res:Response, next: NextFunction) =>{
  try {
    const {name, bio, address, opening_hours, website, category, sellerId} = req.body;
    if(!name  || !bio || !address ||  !opening_hours || !category || !sellerId){
      throw next(new ValidationError("All fields are required!"));
    }

    const shopData : any= {
      name,
      bio,
      address,
      opening_hours, 
      category,
      sellerId,
    };

    if(website && website.trim() !== ""){
      shopData.website = website;
    }

    const shop = await prisma.shops.create({
      data: shopData,
    });

    res.status(201).json({success: true, shop});
  } catch (error) {
    next(error);
  }
}

// Create stripe connect account link
export const createStripeConnectLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sellerId } = req.body;

    if (!sellerId) return next(new ValidationError("Seller ID is required!"));

    const seller = await prisma.sellers.findUnique({ where: { id: sellerId } });

    if (!seller) return next(new ValidationError("Seller is not available with this id!"));

    let accountId = seller.stripeId;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: seller.email,
        country: "AE",
        capabilities: {
          // card_payments: { requested: true },
          transfers: { requested: true },
        },
      });

      await prisma.sellers.update({
        where: { id: sellerId },
        data: { stripeId: account.id },
      });

      accountId = account.id;
    }

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `http://localhost:3000/success`,
      return_url: `http://localhost:3000/success`,
      type: "account_onboarding",
    });

    res.json({ url: accountLink.url });
  } catch (error) {
    return next(error);
  }
};

// Login seller
export const loginSeller = async (req: Request, res:Response, next: NextFunction) => {
  try {
    const {email, password} = req.body;

    if(!email || ! password){
      return next(new ValidationError("Email and password are required!"));
    }

    const seller = await prisma.sellers.findUnique({where: {email}});
    if(!seller){
      return next(new AuthError("Seller doesnt exist!"));
    }
    // verify password
    const isMatch = await bcrypt.compare(password, seller.password!);
    if(!isMatch){
      return next(new AuthError("Invalid email or password!"));
    }

    // Generate refresh and access token
    const accessToken = jwt.sign(
      {id: seller.id, role: "seller"},
      process.env.ACCESS_TOKEN_SECRET as string,
      {
      expiresIn: "15m"
      }
    );

    const refreshToken = jwt.sign(
      {id: seller.id, role: "seller"},
      process.env.REFRESH_TOKEN_SECRET as string,
      {
      expiresIn: "7d"
      }
    );

    // Store the refresh and access token in a httpOnly secure cookie.
    setCookie(res, "seller_refresh_token", refreshToken);
    setCookie(res, "seller_access_token", accessToken);

    res.status(200).json({
      message: "Login successfully!",
      seller: {id: seller.id, name: seller.name, email: seller.email}
    })
  } catch (error) {
    return next(error);
  }
}

// Get logged in seller 
export const getSeller = (req: Request, res: Response, next: NextFunction) => {
  try {
    const seller = req.seller;
    res.status(201).json({
      success: true,
      seller
    })
  } catch (error) {
    next(error);
  }
}