import { body, param } from "express-validator";

export const createShippingPolicyValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1-100 characters"),

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

export const updateShippingPolicyValidator = [
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
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1-100 characters"),

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

export const getShippingPolicyByIdValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Policy ID is required")
    .isUUID()
    .withMessage("Policy ID must be a valid UUID"),
];

export const deleteShippingPolicyValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Policy ID is required")
    .isUUID()
    .withMessage("Policy ID must be a valid UUID"),
];
