import { body, param, query } from "express-validator";

export const createDisclaimerValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 150 })
    .withMessage("Title must be between 1-150 characters"),

  body("categoryType")
    .trim()
    .notEmpty()
    .withMessage("Category type is required")
    .isIn(["HEALTH", "WARRANTY", "LIABILITY", "GENERAL"])
    .withMessage(
      "Category type must be one of: HEALTH, WARRANTY, LIABILITY, GENERAL",
    ),

  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isObject()
    .withMessage("Content must be a JSON object"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

export const updateDisclaimerValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Disclaimer ID is required")
    .isUUID()
    .withMessage("Disclaimer ID must be a valid UUID"),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 1, max: 150 })
    .withMessage("Title must be between 1-150 characters"),

  body("categoryType")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category type cannot be empty")
    .isIn(["HEALTH", "WARRANTY", "LIABILITY", "GENERAL"])
    .withMessage(
      "Category type must be one of: HEALTH, WARRANTY, LIABILITY, GENERAL",
    ),

  body("content")
    .optional()
    .isObject()
    .withMessage("Content must be a JSON object"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

export const toggleStatusValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Disclaimer ID is required")
    .isUUID()
    .withMessage("Disclaimer ID must be a valid UUID"),
];

export const getDisclaimerByIdValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Disclaimer ID is required")
    .isUUID()
    .withMessage("Disclaimer ID must be a valid UUID"),
];

export const deleteDisclaimerValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Disclaimer ID is required")
    .isUUID()
    .withMessage("Disclaimer ID must be a valid UUID"),
];

export const getDisclaimersByCategory = [
  query("categoryType")
    .optional()
    .trim()
    .isIn(["HEALTH", "WARRANTY", "LIABILITY", "GENERAL"])
    .withMessage(
      "Category type must be one of: HEALTH, WARRANTY, LIABILITY, GENERAL",
    ),
];
