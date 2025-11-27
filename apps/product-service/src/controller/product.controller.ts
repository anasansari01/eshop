import { ValidationError } from "@packages/error-handler";
import prisma from "@packages/libs/prisma";
import { NextFunction, Response, Request } from "express";

//get product categories
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const config = await prisma.site_config.findFirst();

    if(!config){
      return res.status(404).json({message: "Categories not found"});
    }

    return res.status(200).json({
      categories: config.categories,
      subCategories: config.subCategories,
    })
  } catch (error) {
    return next(error);
  }
}

// create discount codes
export const createDiscountCode = async (req: any, res: Response, next: NextFunction) => {
  try {
    
    const {public_name, discountType, discountValue, discountCode} = req.body;

    const isDiscountCodeExist = await prisma.discount_codes.findUnique({where: {
      discountCode,
    }})

    if(isDiscountCodeExist){
      return next(new ValidationError("Discount code already available please use different code!"));
    }

    const discount_code = await prisma.discount_codes.create({
      data:{
        public_name,
        discountType,
        discountCode,
        discountValue: parseFloat(discountValue),
        sellerId: req.seller.id
      }
    });

    return res.status(201).json({success: true, discount_code});
  } catch (error) {
    return next(error);
  }
}

// get discount codes
export const getDiscountCodes = async (req: any, res: Response, next: NextFunction) => {
  try {
   
    const discount_codes = await prisma.discount_codes.findMany({
      where: {
        sellerId: req.seller.id,
      }
    });

    return res.status(201).json({
      success: true,
      discount_codes,
    });

  } catch (error) {
    return next(error);
  }
}