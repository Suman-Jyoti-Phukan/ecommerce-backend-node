import { Router } from "express";

import { authMiddleware } from "../middleware/auth";

import { adminAuthMiddleware } from "../middleware/authorization";

import {
  getAllStoreBranding,
  createStoreBranding,
  updateStoreBranding,
  uploadStoreLogo,
  uploadStoreBanners,
  deleteStoreBanner,
  deleteStoreBranding,
  toggleStoreBrandingStatus,
} from "../controller/storeBrandingController";

import {
  createStoreBrandingValidator,
  updateStoreBrandingValidator,
  uploadLogoValidator,
  uploadBannersValidator,
  deleteBannerValidator,
  toggleStatusValidator,
  deleteStoreBrandingValidator,
} from "../validators/storeBrandingValidator";

import { validate } from "../middleware/validation";

import { logoUpload, bannerUpload } from "../config/multer";

const router = Router();

router.get(
  "/",
  authMiddleware as any,
  adminAuthMiddleware as any,
  getAllStoreBranding,
);

router.post(
  "/",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(createStoreBrandingValidator),
  createStoreBranding,
);

router.put(
  "/:id",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(updateStoreBrandingValidator),
  updateStoreBranding,
);

router.patch(
  "/:id/logo",
  authMiddleware as any,
  adminAuthMiddleware as any,
  logoUpload,
  validate(uploadLogoValidator),
  uploadStoreLogo,
);

router.patch(
  "/:id/banners",
  authMiddleware as any,
  adminAuthMiddleware as any,
  bannerUpload,
  validate(uploadBannersValidator),
  uploadStoreBanners,
);

router.delete(
  "/:id/banners/:index",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(deleteBannerValidator),
  deleteStoreBanner,
);

router.delete(
  "/:id",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(deleteStoreBrandingValidator),
  deleteStoreBranding,
);

router.patch(
  "/:id/status",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(toggleStatusValidator),
  toggleStoreBrandingStatus,
);

export default router;
