import express from "express";
import {
  addCar,
  updateCar,
  deleteCar,
  getDealerCars,
  getApprovedCars,
  getPendingCars,
  approveCar,
  getAllCars
} from "../controllers/carController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  carValidator,
  updateCarValidator,
} from "../validators/carValidator.js";

const carRouter = express.Router();


/* Admin View All Cars */
carRouter.get("/all", protect, adminOnly, getAllCars);
/* Add Car */
carRouter.post("/", protect, carValidator, addCar);

/* Update Car */
carRouter.put("/:id", protect, updateCarValidator, updateCar);

/* Delete Car */
carRouter.delete("/:id", protect, deleteCar);

/* Dealer Cars */
carRouter.get("/my-cars", protect, getDealerCars);

/* Approved Cars (Public) */
carRouter.get("/approved", getApprovedCars);

/* Pending Cars (Admin) */
carRouter.get("/pending", protect, adminOnly, getPendingCars);

/* Approve Car */
carRouter.put("/approve/:id", protect, adminOnly, approveCar);

export default carRouter;
