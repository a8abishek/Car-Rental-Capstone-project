import express from "express";
// IMPORT
import {
  addDriver,
  getAllDrivers,
  getActiveDrivers,
  toggleDriverStatus,
} from "../controllers/driverController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

//ROUTER SETUP
const driverRouter = express.Router();

//ROUTE SETUP
driverRouter.post("/", protect, authorize("admin"), addDriver);

driverRouter.get("/", protect, authorize("admin"), getAllDrivers);

driverRouter.get("/active", protect, authorize("admin"), getActiveDrivers);

driverRouter.put(
  "/toggle/:id",
  protect,
  authorize("admin"),
  toggleDriverStatus,
);

export default driverRouter;
