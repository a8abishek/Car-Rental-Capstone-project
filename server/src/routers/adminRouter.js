import express from "express";
import {
  getAdminStats,
  approveDealer,
  revokeDealer,
  getPendingDealers,
} from "../controllers/adminController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const adminRouter = express.Router();

/* ================= DASHBOARD ================= */
adminRouter.get("/stats", protect, adminOnly, getAdminStats);

/* ================= DEALER MANAGEMENT ================= */
adminRouter.get("/pending-dealers", protect, adminOnly, getPendingDealers);

adminRouter.put("/approve/:id", protect, adminOnly, approveDealer);

adminRouter.put("/revoke/:id", protect, adminOnly, revokeDealer);

export default adminRouter;
