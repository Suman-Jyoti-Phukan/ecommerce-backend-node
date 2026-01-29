import { body, param } from "express-validator";

export const createCategoryWithImageValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Category name must be between 1 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),

  body("slug")
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),

  body("parentId")
    .optional()
    .isUUID()
    .withMessage("Parent ID must be a valid UUID"),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean value"),
];

export const updateCategoryWithImageValidator = [
  param("categoryId").isUUID().withMessage("Category ID must be a valid UUID"),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category name cannot be empty")
    .isLength({ min: 1, max: 100 })
    .withMessage("Category name must be between 1 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),

  body("slug")
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),

  body("parentId")
    .optional()
    .isUUID()
    .withMessage("Parent ID must be a valid UUID"),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean value"),
];

export const deleteCategoryImageValidator = [
  param("categoryId").isUUID().withMessage("Category ID must be a valid UUID"),
];
