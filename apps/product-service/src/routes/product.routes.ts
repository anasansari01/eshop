import express, { Router } from 'express';
import { createDiscountCode, createProduct, deleteDiscountCodes, deleteProductImage, getCategories, getDiscountCodes, getShopProduct, uploadProductImage } from '../controller/product.controller';
import isAuthenticated from '@packages/middleware/isAuthenticated';

const router: Router = express.Router();

router.get("/get-categories", getCategories);
router.post("/create-discount-code", isAuthenticated, createDiscountCode);
router.get("/get-discount-codes", isAuthenticated, getDiscountCodes);
router.delete("/delete-discount-code/:id", isAuthenticated, deleteDiscountCodes);
router.post("/upload-product-image", isAuthenticated, uploadProductImage);
router.delete("/delete-product-image", isAuthenticated, deleteProductImage);
router.post("/create-product", isAuthenticated, createProduct);
router.get("/get-shop-products", isAuthenticated, getShopProduct);

export default router;