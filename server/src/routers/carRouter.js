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

// 1.ADMIN ROUTES
carRouter.get("/all", protect, adminOnly, getAllCars); //View all cars
carRouter.get("/pending", protect, adminOnly, getPendingCars); // View pending cars
carRouter.put("/toggle-status/:id", protect, adminOnly, toggleCarStatus); // Toggle status (approved ⇄ pending)

//2.DEALER + ADMIN
carRouter.post("/", protect, carValidator, addCar); // Add Car (Admin → approved, Dealer → pending)
carRouter.put("/:id", protect, updateCarValidator, updateCar); // Update Car (Dealer own only, Admin any)
carRouter.delete("/:id", protect, deleteCar); // Delete Car (Dealer own only, Admin any)
carRouter.get("/my-cars", protect, getDealerCars); // Dealer view own cars

//3.PUBLIC ROUTES
carRouter.get("/approved", getApprovedCars); // Approved cars only
carRouter.get("/:id", getSingleCar); // Single car (keep LAST to avoid conflict)

//4. DEALER ROUTES
carRouter.get("/dealer/stats", protect, getDealerStats); // Dashboard details

export default carRouter;
