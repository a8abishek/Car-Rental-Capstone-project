import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getProfile } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/me", protect, getProfile);

export default userRouter;
