import express from "express";

import {
  createProduct,
  updateProduct,
  deleteProduct,
  updateInventory,
  getProducts,
  getProductById
} from "../controller/productController";

import { authMiddleware } from "../middleware/auth";

import { adminAuthMiddleware } from "../middleware/authorization";

import { asyncHandler } from "../middleware/errorHandler";

const router = express.Router();

router.route("/")
  .post(authMiddleware as any, adminAuthMiddleware as any, asyncHandler(createProduct))
  .get(authMiddleware as any, adminAuthMiddleware as any, asyncHandler(getProducts));

router.get("/:id", authMiddleware as any, adminAuthMiddleware as any, asyncHandler(getProductById));

router.put("/:id", authMiddleware as any, adminAuthMiddleware as any, asyncHandler(updateProduct));

router.delete("/:id", authMiddleware as any, adminAuthMiddleware as any, asyncHandler(deleteProduct));

router.patch("/inventory/update", authMiddleware as any, adminAuthMiddleware as any, asyncHandler(updateInventory));

export default router;
