import { Router } from "express";

import {
  getActiveServices,
  getServiceById,
} from "../controller/serviceController";

import { getServiceByIdValidator } from "../validators/serviceValidator";

import { validate } from "../middleware/validation";

const router = Router();

router.get("/", getActiveServices);

router.get("/:id", validate(getServiceByIdValidator), getServiceById);

export default router;
