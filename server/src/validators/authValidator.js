import { body } from "express-validator";

//register validation
export const registerValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(["customer", "dealer"])
    .withMessage("Role must be customer or dealer"),
];

//login validation
export const loginValidator = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required"),
  body("role")
    .isIn(["customer", "dealer", "admin"])
    .withMessage("Invalid role"),
];
