import { Router } from "express";

import {
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategoryImage,
} from "../controller/categoryController";

import { authMiddleware } from "../middleware/auth";

import { asyncHandler } from "../middleware/errorHandler";

import { adminAuthMiddleware } from "../middleware/authorization";

import { categoryImageUpload } from "../config/multer";

import { validate } from "../middleware/validation";

import {
  createCategoryWithImageValidator,
  updateCategoryWithImageValidator,
  deleteCategoryImageValidator,
} from "../validators/categoryImageValidator";

const router = Router();

router.use(authMiddleware as any);

router.use(adminAuthMiddleware as any);

router.post(
  "/",
  categoryImageUpload,
  validate(createCategoryWithImageValidator),
  asyncHandler(createCategory),
);

router.put(
  "/:categoryId",
  categoryImageUpload,
  validate(updateCategoryWithImageValidator),
  asyncHandler(updateCategory),
);

router.delete(
  "/:categoryId/image",
  validate(deleteCategoryImageValidator),
  asyncHandler(deleteCategoryImage),
);

router.delete("/:categoryId", asyncHandler(deleteCategory));

export default router;
