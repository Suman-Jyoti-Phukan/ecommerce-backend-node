import { Router } from "express";

import {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  getRootCategories,
  getCategoryChildren,
} from "../controller/categoryController";

import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

router.get("/", asyncHandler(getAllCategories));

router.get("/roots", asyncHandler(getRootCategories));

router.get("/:categoryId", asyncHandler(getCategoryById));

router.get("/slug/:slug", asyncHandler(getCategoryBySlug));

router.get("/:categoryId/children", asyncHandler(getCategoryChildren));

export default router;
