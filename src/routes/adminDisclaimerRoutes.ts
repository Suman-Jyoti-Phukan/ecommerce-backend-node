import { Router } from "express";

import { authMiddleware } from "../middleware/auth";

import { adminAuthMiddleware } from "../middleware/authorization";

import {
  getAllDisclaimers,
  createDisclaimer,
  updateDisclaimer,
  deleteDisclaimer,
  toggleDisclaimerStatus,
} from "../controller/disclaimerController";

import {
  createDisclaimerValidator,
  updateDisclaimerValidator,
  toggleStatusValidator,
  deleteDisclaimerValidator,
} from "../validators/disclaimerValidator";

import { validate } from "../middleware/validation";

const router = Router();

router.get(
  "/",
  authMiddleware as any,
  adminAuthMiddleware as any,
  getAllDisclaimers,
);

router.post(
  "/",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(createDisclaimerValidator),
  createDisclaimer,
);

router.put(
  "/:id",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(updateDisclaimerValidator),
  updateDisclaimer,
);

router.delete(
  "/:id",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(deleteDisclaimerValidator),
  deleteDisclaimer,
);

router.patch(
  "/:id/status",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(toggleStatusValidator),
  toggleDisclaimerStatus,
);

export default router;
