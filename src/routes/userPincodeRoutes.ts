import { Router } from "express";

import {
  getAllPincodes,
  getPincodeById,
  getPincodeByValue,
} from "../controller/pincodeController";

import { asyncHandler } from "../middleware/errorHandler";

import { validate } from "../middleware/validation";

import {
  pincodeIdParamValidation,
  pincodeValueParamValidation,
  pincodePaginationQueryValidation,
} from "../validators/pincodeValidators";

const router = Router();

router.get(
  "/",
  validate(pincodePaginationQueryValidation),
  asyncHandler(getAllPincodes)
);

router.get(
  "/:pincodeId",
  validate([...pincodeIdParamValidation, ...pincodePaginationQueryValidation]),
  asyncHandler(getPincodeById)
);

router.get(
  "/value/:value",
  validate([
    ...pincodeValueParamValidation,
    ...pincodePaginationQueryValidation,
  ]),
  asyncHandler(getPincodeByValue)
);

export default router;
