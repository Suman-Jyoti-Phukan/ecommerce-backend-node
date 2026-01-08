import express from "express";

import { getProducts, getProductById } from "../controller/productController";

import { asyncHandler } from "../middleware/errorHandler";

const router = express.Router();

router.get("/", asyncHandler(getProducts));

router.get("/:id", asyncHandler(getProductById));

export default router;
