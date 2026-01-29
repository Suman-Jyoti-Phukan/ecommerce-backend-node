import { Router } from "express";

import {
  getActiveShippingPolicies,
  getShippingPolicyById,
} from "../controller/shippingPolicyController";

import { getShippingPolicyByIdValidator } from "../validators/shippingPolicyValidator";

import { validate } from "../middleware/validation";

const router = Router();

router.get("/", getActiveShippingPolicies);

router.get(
  "/:id",
  validate(getShippingPolicyByIdValidator),
  getShippingPolicyById,
);

export default router;
