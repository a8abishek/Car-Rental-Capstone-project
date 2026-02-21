import express from "express";
// import
import {
  getAdminStats,
  approveDealer,
  revokeDealer,
  getPendingDealers,
  getAllUsers,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

//ROUTER SETUP
const adminRouter = express.Router();

//ROUTE SETUP

/* DASHBOARD */
adminRouter.get("/stats", protect, adminOnly, getAdminStats);

/*DEALER MANAGEMENT  */
adminRouter.get("/pending-dealers", protect, adminOnly, getPendingDealers);

adminRouter.put("/approve/:id", protect, adminOnly, approveDealer);

adminRouter.put("/revoke/:id", protect, adminOnly, revokeDealer);

adminRouter.get("/users", protect, adminOnly, getAllUsers);

export default adminRouter;
