import express from "express";
//import
import {
  getCarReviews,
  updateReview,
  addReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

//ROUTER SETUP
const reviewRouter = express.Router();

// customer
// 1.Public route:
reviewRouter.get("/car/:carId", getCarReviews); //get Car Reviews

// 2.Protected routes
reviewRouter.post("/addreview", protect, addReview); //add Review
reviewRouter.put("/:id", protect, updateReview); //update Review
reviewRouter.delete("/:id", protect, deleteReview); //delete Review

export default reviewRouter;
