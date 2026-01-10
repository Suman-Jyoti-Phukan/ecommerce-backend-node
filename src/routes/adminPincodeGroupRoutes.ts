import { Router } from "express";

import {
  createPincodeGroup,
  getAllPincodeGroups,
  getPincodeGroupById,
  updatePincodeGroup,
  softDeletePincodeGroup,
  restorePincodeGroup,
  deletePincodeGroup,
  addPincodesToGroup,
  removePincodesFromGroup,
} from "../controller/pincodeGroupController";

import { authMiddleware } from "../middleware/auth";

import { asyncHandler } from "../middleware/errorHandler";

import { adminAuthMiddleware } from "../middleware/authorization";

import { validate } from "../middleware/validation";

import {
  createPincodeGroupValidation,
  updatePincodeGroupValidation,
  pincodeGroupIdParamValidation,
  pincodePaginationQueryValidation,
  addPincodesToGroupValidation,
  removePincodesFromGroupValidation,
} from "../validators/pincodeValidators";

const router = Router();

router.use(authMiddleware as any);

router.use(adminAuthMiddleware as any);

router.post(
  "/",
  validate(createPincodeGroupValidation),
  asyncHandler(createPincodeGroup)
);

router.get(
  "/",
  validate(pincodePaginationQueryValidation),
  asyncHandler(getAllPincodeGroups)
);

router.get(
  "/:pincodeGroupId",
  validate([...pincodeGroupIdParamValidation, ...pincodePaginationQueryValidation]),
  asyncHandler(getPincodeGroupById)
);

router.put(
  "/:pincodeGroupId",
  validate(updatePincodeGroupValidation),
  asyncHandler(updatePincodeGroup)
);

router.patch(
  "/:pincodeGroupId/soft-delete",
  validate(pincodeGroupIdParamValidation),
  asyncHandler(softDeletePincodeGroup)
);

router.patch(
  "/:pincodeGroupId/restore",
  validate(pincodeGroupIdParamValidation),
  asyncHandler(restorePincodeGroup)
);

router.delete(
  "/:pincodeGroupId",
  validate(pincodeGroupIdParamValidation),
  asyncHandler(deletePincodeGroup)
);

router.post(
  "/:pincodeGroupId/pincodes",
  validate(addPincodesToGroupValidation),
  asyncHandler(addPincodesToGroup)
);

router.delete(
  "/:pincodeGroupId/pincodes",
  validate(removePincodesFromGroupValidation),
  asyncHandler(removePincodesFromGroup)
);

export default router;
