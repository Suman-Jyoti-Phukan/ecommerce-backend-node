import { Router } from "express";

import { authMiddleware } from "../middleware/auth";

import { adminAuthMiddleware } from "../middleware/authorization";

import {
  getAllShippingPolicies,
  createShippingPolicy,
  updateShippingPolicy,
  deleteShippingPolicy,
  toggleShippingPolicyStatus,
} from "../controller/shippingPolicyController";

import {
  createShippingPolicyValidator,
  updateShippingPolicyValidator,
  toggleStatusValidator,
  deleteShippingPolicyValidator,
} from "../validators/shippingPolicyValidator";

import { validate } from "../middleware/validation";

const router = Router();

router.get(
  "/",
  authMiddleware as any,
  adminAuthMiddleware as any,
  getAllShippingPolicies,
);

router.post(
  "/",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(createShippingPolicyValidator),
  createShippingPolicy,
);

router.put(
  "/:id",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(updateShippingPolicyValidator),
  updateShippingPolicy,
);

router.delete(
  "/:id",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(deleteShippingPolicyValidator),
  deleteShippingPolicy,
);

router.patch(
  "/:id/status",
  authMiddleware as any,
  adminAuthMiddleware as any,
  validate(toggleStatusValidator),
  toggleShippingPolicyStatus,
);

export default router;
