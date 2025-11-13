import express, { Router } from 'express';
import { getCategories } from '../controller/product.controller';

const router: Router = express.Router();

router.get("/get-categories", getCategories);

export default router;
