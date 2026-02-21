import express from "express";
// IMPORT
import {
  addCar,
  updateCar,
  deleteCar,
  getDealerCars,
  getApprovedCars,
  getPendingCars,
  getAllCars,
  getSingleCar,
  toggleCarStatus,
  getDealerStats,
} from "../controllers/carController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  carValidator,
  updateCarValidator,
} from "../validators/carValidator.js";

//ROUTER SETUP
const carRouter = express.Router();

//ROUTE SETUP
/*ADMIN ROUTES */

// View all cars
carRouter.get("/all", protect, adminOnly, getAllCars);

// View pending cars
carRouter.get("/pending", protect, adminOnly, getPendingCars);

// Toggle status (approved ⇄ pending)
carRouter.put("/toggle-status/:id", protect, adminOnly, toggleCarStatus);

/*DEALER + ADMIN  */

// Add Car (Admin → approved, Dealer → pending)
carRouter.post("/", protect, carValidator, addCar);

// Update Car (Dealer own only, Admin any)
carRouter.put("/:id", protect, updateCarValidator, updateCar);

// Delete Car (Dealer own only, Admin any)
carRouter.delete("/:id", protect, deleteCar);

// Dealer view own cars
carRouter.get("/my-cars", protect, getDealerCars);

/*PUBLIC ROUTES  */

// Approved cars only
carRouter.get("/approved", getApprovedCars);

// Single car (keep LAST to avoid conflict)
carRouter.get("/:id", getSingleCar);

/* DEALER SPECIFIC ROUTES  */

// Add this route - GET /api/cars/dealer/stats
carRouter.get("/dealer/stats", protect, getDealerStats);

export default carRouter;
