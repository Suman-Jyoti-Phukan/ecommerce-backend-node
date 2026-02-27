import { Router } from "express";

import { authMiddleware } from "../middleware/auth";

import { adminAuthMiddleware } from "../middleware/authorization";

import {
    getAllPolicies,
    createPolicy,
    updatePolicy,
    deletePolicy,
    togglePolicyStatus,
} from "../controller/refundPolicyController";

import {
    createRefundPolicyValidator,
    updateRefundPolicyValidator,
    toggleStatusValidator,
    deleteRefundPolicyValidator,
} from "../validators/refundPolicyValidator";

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
    validate(createRefundPolicyValidator),
    createPolicy,
);

router.put(
    "/:id",
    authMiddleware as any,
    adminAuthMiddleware as any,
    validate(updateRefundPolicyValidator),
    updatePolicy,
);

router.delete(
    "/:id",
    authMiddleware as any,
    adminAuthMiddleware as any,
    validate(deleteRefundPolicyValidator),
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
