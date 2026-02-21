import express from "express";
// IMPORT
import { protect } from "../middleware/authMiddleware.js";
import {
  getProfile,
  changePassword,
  updateProfile,
} from "../controllers/userController.js";

//ROUTER SETUP
const userRouter = express.Router();

//ROUTE SETUP
userRouter.get("/me", protect, getProfile);

// Update name
userRouter.put("/update-profile", protect, updateProfile);

// Change password
userRouter.put("/change-password", protect, changePassword);

export default userRouter;
