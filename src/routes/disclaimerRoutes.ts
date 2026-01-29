import { Router } from "express";

import {
  getActiveDisclaimers,
  getDisclaimerById,
} from "../controller/disclaimerController";

import {
  getDisclaimerByIdValidator,
  getDisclaimersByCategory,
} from "../validators/disclaimerValidator";

import { validate } from "../middleware/validation";

const router = Router();

router.get("/", validate(getDisclaimersByCategory), getActiveDisclaimers);

router.get("/:id", validate(getDisclaimerByIdValidator), getDisclaimerById);

export default router;
