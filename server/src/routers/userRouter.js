import express from "express";
// IMPORT
import { protect } from "../middleware/authMiddleware.js";
import {
  getProfile,
  changePassword,
  updateProfile,
  toggleSavedCar,
  getSavedCars,
} from "../controllers/userController.js";

//ROUTER SETUP
const userRouter = express.Router();

//routes setup
// 1.commom routes(customer + dealer + admin)
userRouter.get("/me", protect, getProfile); //get Profile
userRouter.put("/change-password", protect, changePassword); // Change password
userRouter.put("/update-profile", protect, updateProfile); // Update name

// 2.customer routes
userRouter.post("/toggle-favorite", protect, toggleSavedCar); // saved car
userRouter.get("/saved-cars", protect, getSavedCars); //get Saved Cars

export default userRouter;
