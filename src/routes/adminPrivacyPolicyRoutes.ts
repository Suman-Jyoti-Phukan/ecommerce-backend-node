import { Router } from "express";

import { authMiddleware } from "../middleware/auth";

import { adminAuthMiddleware } from "../middleware/authorization";

import {
  getAllPolicies,
  createPolicy,
  updatePolicy,
  deletePolicy,
  togglePolicyStatus,
} from "../controller/privacyPolicyController";

import {
  createPrivacyPolicyValidator,
  updatePrivacyPolicyValidator,
  toggleStatusValidator,
  deletePrivacyPolicyValidator,
} from "../validators/privacyPolicyValidator";

import { validate } from "../middleware/validation";

const router = Router();

router.get(
  "/",
  authMiddleware as any,
  adminAuthMiddleware as any,
  getAllPolicies,
);

router.post(
  "/",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(createPrivacyPolicyValidator),
  createPolicy,
);

router.put(
  "/:id",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(updatePrivacyPolicyValidator),
  updatePolicy,
);

router.delete(
  "/:id",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(deletePrivacyPolicyValidator),
  deletePolicy,
);

router.patch(
  "/:id/status",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(toggleStatusValidator),
  togglePolicyStatus,
);

export default router;
