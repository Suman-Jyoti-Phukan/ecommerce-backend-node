import { body, param } from "express-validator";

export const createRefundPolicyValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 1, max: 200 })
        .withMessage("Name must be between 1-200 characters"),

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

export const updateRefundPolicyValidator = [
    param("id")
        .trim()
        .notEmpty()
        .withMessage("Policy ID is required")
        .isUUID()
        .withMessage("Policy ID must be a valid UUID"),

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .isLength({ min: 1, max: 200 })
        .withMessage("Name must be between 1-200 characters"),

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

export const getRefundPolicyByIdValidator = [
    param("id")
        .trim()
        .notEmpty()
        .withMessage("Policy ID is required")
        .isUUID()
        .withMessage("Policy ID must be a valid UUID"),
];

export const deleteRefundPolicyValidator = [
    param("id")
        .trim()
        .notEmpty()
        .withMessage("Policy ID is required")
        .isUUID()
        .withMessage("Policy ID must be a valid UUID"),
];
