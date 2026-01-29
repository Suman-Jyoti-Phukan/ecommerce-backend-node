import { body, param } from "express-validator";

export const createPrivacyPolicyValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1-200 characters"),

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

export const updatePrivacyPolicyValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Policy ID is required")
    .isUUID()
    .withMessage("Policy ID must be a valid UUID"),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1-200 characters"),

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
    .withMessage("Policy ID is required")
    .isUUID()
    .withMessage("Policy ID must be a valid UUID"),
];

export const getPrivacyPolicyByIdValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Policy ID is required")
    .isUUID()
    .withMessage("Policy ID must be a valid UUID"),
];

export const deletePrivacyPolicyValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Policy ID is required")
    .isUUID()
    .withMessage("Policy ID must be a valid UUID"),
];
