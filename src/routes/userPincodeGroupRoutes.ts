import { Router } from "express";

import {
  getAllPincodeGroups,
  getPincodeGroupById,
} from "../controller/pincodeGroupController";

import { asyncHandler } from "../middleware/errorHandler";

import { validate } from "../middleware/validation";

import {
  pincodeGroupIdParamValidation,
  pincodePaginationQueryValidation,
} from "../validators/pincodeValidators";

const router = Router();

router.get(
  "/",
  validate(pincodePaginationQueryValidation),
  asyncHandler(getAllPincodeGroups)
);

router.get(
  "/:pincodeGroupId",
  validate([
    ...pincodeGroupIdParamValidation,
    ...pincodePaginationQueryValidation,
  ]),
  asyncHandler(getPincodeGroupById)
);

export default router;
