import { body, param } from "express-validator";

export const createServiceValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1-100 characters"),

  body("summary")
    .trim()
    .notEmpty()
    .withMessage("Summary is required")
    .isLength({ min: 1, max: 500 })
    .withMessage("Summary must be between 1-500 characters"),

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

export const updateServiceValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Service ID is required")
    .isUUID()
    .withMessage("Service ID must be a valid UUID"),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1-100 characters"),

  body("summary")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Summary cannot be empty")
    .isLength({ min: 1, max: 500 })
    .withMessage("Summary must be between 1-500 characters"),

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
    .withMessage("Service ID is required")
    .isUUID()
    .withMessage("Service ID must be a valid UUID"),
];

export const getServiceByIdValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Service ID is required")
    .isUUID()
    .withMessage("Service ID must be a valid UUID"),
];

export const deleteServiceValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Service ID is required")
    .isUUID()
    .withMessage("Service ID must be a valid UUID"),
];
