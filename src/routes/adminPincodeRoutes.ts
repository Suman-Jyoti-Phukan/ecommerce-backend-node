import { Router } from "express";

import {
  createPincode,
  getAllPincodes,
  getPincodeById,
  getPincodeByValue,
  updatePincode,
  softDeletePincode,
  restorePincode,
  deletePincode,
} from "../controller/pincodeController";

import { authMiddleware } from "../middleware/auth";

import { asyncHandler } from "../middleware/errorHandler";

import { adminAuthMiddleware } from "../middleware/authorization";

import { validate } from "../middleware/validation";

import {
  createPincodeValidation,
  updatePincodeValidation,
  pincodeIdParamValidation,
  pincodeValueParamValidation,
  pincodePaginationQueryValidation,
} from "../validators/pincodeValidators";

const router = Router();

router.use(authMiddleware as any);

router.use(adminAuthMiddleware as any);

router.post(
  "/",
  validate(createPincodeValidation),
  asyncHandler(createPincode)
);

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
  validate([...pincodeValueParamValidation, ...pincodePaginationQueryValidation]),
  asyncHandler(getPincodeByValue)
);

router.put(
  "/:pincodeId",
  validate(updatePincodeValidation),
  asyncHandler(updatePincode)
);

router.patch(
  "/:pincodeId/soft-delete",
  validate(pincodeIdParamValidation),
  asyncHandler(softDeletePincode)
);

router.patch(
  "/:pincodeId/restore",
  validate(pincodeIdParamValidation),
  asyncHandler(restorePincode)
);

router.delete(
  "/:pincodeId",
  validate(pincodeIdParamValidation),
  asyncHandler(deletePincode)
);

export default router;
