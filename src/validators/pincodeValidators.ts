import { body, param, query } from "express-validator";

export const createPincodeValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Name must be between 1 and 255 characters"),

  body("value")
    .trim()
    .notEmpty()
    .withMessage("Pincode value is required")
    .isLength({ min: 1, max: 20 })
    .withMessage("Pincode value must be between 1 and 20 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value")
    .toBoolean(),
];

export const updatePincodeValidation = [
  param("pincodeId")
    .trim()
    .notEmpty()
    .withMessage("Pincode ID is required")
    .isUUID()
    .withMessage("Pincode ID must be a valid UUID"),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 1, max: 255 })
    .withMessage("Name must be between 1 and 255 characters"),

  body("value")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Pincode value cannot be empty")
    .isLength({ min: 1, max: 20 })
    .withMessage("Pincode value must be between 1 and 20 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value")
    .toBoolean(),
];

export const pincodeIdParamValidation = [
  param("pincodeId")
    .trim()
    .notEmpty()
    .withMessage("Pincode ID is required")
    .isUUID()
    .withMessage("Pincode ID must be a valid UUID"),
];

export const pincodeValueParamValidation = [
  param("value")
    .trim()
    .notEmpty()
    .withMessage("Pincode value is required")
    .isLength({ min: 1, max: 20 })
    .withMessage("Pincode value must be between 1 and 20 characters"),
];

export const pincodePaginationQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be a positive integer between 1 and 100")
    .toInt(),

  query("includeInactive")
    .optional()
    .isBoolean()
    .withMessage("includeInactive must be a boolean value")
    .toBoolean(),
];

export const createPincodeGroupValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Name must be between 1 and 255 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value")
    .toBoolean(),

  body("pincodeIds")
    .optional()
    .isArray()
    .withMessage("pincodeIds must be an array")
    .custom((value) => {
      if (value.length === 0) {
        throw new Error("pincodeIds array cannot be empty");
      }
      return true;
    }),

  body("pincodeIds.*")
    .optional()
    .isUUID()
    .withMessage("Each pincode ID must be a valid UUID"),
];

export const updatePincodeGroupValidation = [
  param("pincodeGroupId")
    .trim()
    .notEmpty()
    .withMessage("Pincode group ID is required")
    .isUUID()
    .withMessage("Pincode group ID must be a valid UUID"),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 1, max: 255 })
    .withMessage("Name must be between 1 and 255 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value")
    .toBoolean(),
];

export const pincodeGroupIdParamValidation = [
  param("pincodeGroupId")
    .trim()
    .notEmpty()
    .withMessage("Pincode group ID is required")
    .isUUID()
    .withMessage("Pincode group ID must be a valid UUID"),
];

export const addPincodesToGroupValidation = [
  param("pincodeGroupId")
    .trim()
    .notEmpty()
    .withMessage("Pincode group ID is required")
    .isUUID()
    .withMessage("Pincode group ID must be a valid UUID"),

  body("pincodeIds")
    .notEmpty()
    .withMessage("pincodeIds is required")
    .isArray()
    .withMessage("pincodeIds must be an array")
    .custom((value) => {
      if (value.length === 0) {
        throw new Error("pincodeIds array cannot be empty");
      }
      return true;
    }),

  body("pincodeIds.*")
    .isUUID()
    .withMessage("Each pincode ID must be a valid UUID"),
];

export const removePincodesFromGroupValidation = [
  param("pincodeGroupId")
    .trim()
    .notEmpty()
    .withMessage("Pincode group ID is required")
    .isUUID()
    .withMessage("Pincode group ID must be a valid UUID"),

  body("pincodeIds")
    .notEmpty()
    .withMessage("pincodeIds is required")
    .isArray()
    .withMessage("pincodeIds must be an array")
    .custom((value) => {
      if (value.length === 0) {
        throw new Error("pincodeIds array cannot be empty");
      }
      return true;
    }),

  body("pincodeIds.*")
    .isUUID()
    .withMessage("Each pincode ID must be a valid UUID"),
];
