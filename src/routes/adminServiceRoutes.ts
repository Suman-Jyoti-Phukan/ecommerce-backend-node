import { Router } from "express";

import { authMiddleware } from "../middleware/auth";

import { adminAuthMiddleware } from "../middleware/authorization";

import {
  getAllServices,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
} from "../controller/serviceController";

import {
  createServiceValidator,
  updateServiceValidator,
  toggleStatusValidator,
  deleteServiceValidator,
} from "../validators/serviceValidator";

import { validate } from "../middleware/validation";

const router = Router();

router.get(
  "/",
  authMiddleware as any,
  adminAuthMiddleware as any,
  getAllServices,
);

router.post(
  "/",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(createServiceValidator),
  createService,
);

router.put(
  "/:id",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(updateServiceValidator),
  updateService,
);

router.delete(
  "/:id",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(deleteServiceValidator),
  deleteService,
);

router.patch(
  "/:id/status",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(toggleStatusValidator),
  toggleServiceStatus,
);

export default router;
