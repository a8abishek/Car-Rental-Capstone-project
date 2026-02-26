import express from "express";
import {
  getCarReviews,
  updateReview,
  addReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const reviewRouter = express.Router();

// Public route: Anyone can see car reviews
reviewRouter.get("/car/:carId", getCarReviews);

// Protected routes: Only logged in users can add/edit/delete
reviewRouter.post("/addreview", protect, addReview);
reviewRouter.put("/:id", protect, updateReview);
reviewRouter.delete("/:id", protect, deleteReview);

export default reviewRouter;
