import express from "express";
import { createPaymentIntent } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-intent", protect, createPaymentIntent);

export default paymentRouter;