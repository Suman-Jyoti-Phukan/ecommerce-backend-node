import { body, param } from "express-validator";

export const createStoreBrandingValidator = [
  body("displayName")
    .trim()
    .notEmpty()
    .withMessage("Display name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Display name must be between 1-100 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

export const updateStoreBrandingValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Branding ID is required")
    .isUUID()
    .withMessage("Branding ID must be a valid UUID"),

  body("displayName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Display name cannot be empty")
    .isLength({ min: 1, max: 100 })
    .withMessage("Display name must be between 1-100 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

export const uploadLogoValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Branding ID is required")
    .isUUID()
    .withMessage("Branding ID must be a valid UUID"),
];

export const uploadBannersValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Branding ID is required")
    .isUUID()
    .withMessage("Branding ID must be a valid UUID"),
];

export const deleteBannerValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Branding ID is required")
    .isUUID()
    .withMessage("Branding ID must be a valid UUID"),

  param("index")
    .trim()
    .notEmpty()
    .withMessage("Banner index is required")
    .isInt({ min: 0 })
    .withMessage("Banner index must be a valid number"),
];

export const toggleStatusValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Branding ID is required")
    .isUUID()
    .withMessage("Branding ID must be a valid UUID"),
];

export const getStoreBrandingByIdValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Branding ID is required")
    .isUUID()
    .withMessage("Branding ID must be a valid UUID"),
];

export const deleteStoreBrandingValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Branding ID is required")
    .isUUID()
    .withMessage("Branding ID must be a valid UUID"),
];
