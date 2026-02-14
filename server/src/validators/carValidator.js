import { body } from "express-validator";

/* ================= ADD CAR VALIDATOR ================= */
export const carValidator = [

  body("carName")
    .notEmpty().withMessage("Car name is required"),

  body("brand")
    .notEmpty().withMessage("Brand is required"),

  body("carCompany")
    .notEmpty().withMessage("Car company is required"),

  body("carNumber")
    .notEmpty().withMessage("Car number is required")
    .matches(/^[A-Z0-9-]+$/i)
    .withMessage("Invalid car number format"),

  body("transmission")
    .isIn(["manual", "automatic"])
    .withMessage("Transmission must be manual or automatic"),

  body("carType")
    .isIn(["mid-size", "standard", "premium", "luxury"])
    .withMessage("Invalid car type"),

  body("seatingCapacity")
    .isInt({ min: 1 })
    .withMessage("Seating capacity must be at least 1"),

  body("pricePerDay")
    .isFloat({ min: 0 })
    .withMessage("Price must be positive"),

  body("carImage")
    .isURL()
    .withMessage("Valid image URL required"),
];

/* ================= UPDATE CAR VALIDATOR ================= */
export const updateCarValidator = [

  body("carName").optional().notEmpty(),
  body("brand").optional().notEmpty(),
  body("carCompany").optional().notEmpty(),
  body("transmission").optional().isIn(["manual", "automatic"]),
  body("carType").optional().isIn(["mid-size", "standard", "premium", "luxury"]),
  body("seatingCapacity").optional().isInt({ min: 1 }),
  body("pricePerDay").optional().isFloat({ min: 0 }),
  body("carImage").optional().isURL(),
];
