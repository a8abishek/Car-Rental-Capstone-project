import express from "express";
// import
import { createPaymentIntent } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

//ROUTER SETUP
const paymentRouter = express.Router();

//ROUTE SETUP
paymentRouter.post("/create-intent", protect, createPaymentIntent); //create PaymentIntent

export default paymentRouter;
