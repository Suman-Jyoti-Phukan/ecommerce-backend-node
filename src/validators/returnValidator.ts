import { body, param } from "express-validator";

export const createReturnValidation = [
  body("orderItemId")
    .trim()
    .notEmpty()
    .withMessage("Order Item ID is required")
    .isUUID()
    .withMessage("Invalid Order Item ID format"),

  body("reason")
    .trim()
    .notEmpty()
    .withMessage("Reason is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Reason must be between 10 and 500 characters"),
];

export const adminReturnActionValidation = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["APPROVED", "REJECTED"])
    .withMessage("Status must be either APPROVED or REJECTED"),

  body("adminComment").custom((value, { req }) => {
    if (req.body.status === "REJECTED") {
      if (!value || value.trim().length === 0) {
        throw new Error("Comment is required when rejecting a return");
      }
    }
    return true;
  }),
];

export const setDeliveryDateValidation = [
  body("deliveredAt")
    .trim()
    .notEmpty()
    .withMessage("Delivery date is required")
    .isISO8601()
    .withMessage(
      "Invalid date format. Please use ISO 8601 format (e.g., 2025-01-29T10:00:00Z)",
    )
    .toDate(),
];

export const updateReturnStatusValidation = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["PROCESSING", "COMPLETED", "CANCELLED"])
    .withMessage("Status must be one of: PROCESSING, COMPLETED, CANCELLED"),

  body("comment").optional().trim(),
];

export const getReturnByIdValidation = [
  param("returnId")
    .trim()
    .notEmpty()
    .withMessage("Return ID is required")
    .isUUID()
    .withMessage("Invalid Return ID format"),
];

export const setDeliveryDateParamValidation = [
  param("orderItemId")
    .trim()
    .notEmpty()
    .withMessage("Order Item ID is required")
    .isUUID()
    .withMessage("Invalid Order Item ID format"),
];
