import express from "express";
// import
import {
  createBooking,
  assignDriver,
  confirmBooking,
  cancelBooking,
  getMyBookings,
  adminCancelBooking,
  getCarUnavailableDates,
  getAllBookings,
  getCustomerStats,
  getPaymentHistory,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

//ROUTER SETUP
const bookingRouter = express.Router();

//ROUTE SETUP
//1.customer routes
bookingRouter.post("/", protect, createBooking);//create Booking
bookingRouter.put("/cancel/:id", protect, cancelBooking);//cancel Booking
bookingRouter.get("/my-bookings", protect, getMyBookings);//get My Bookings
bookingRouter.get("/unavailable/:carId", getCarUnavailableDates);//get Car Unavailable Dates
bookingRouter.get("/payment-history", protect, getPaymentHistory);//get Payment History 
bookingRouter.get("/customer/stats", protect, getCustomerStats);//dashboard details

// 2.Admin routes
bookingRouter.put("/assign/:id", protect, authorize("admin"), assignDriver);//assigning Driver
bookingRouter.put("/confirm/:id", protect, authorize("admin"), confirmBooking); //confirm Booking
bookingRouter.put("/admin-cancel/:id",protect,authorize("admin"),adminCancelBooking,); //Cancel Booking
bookingRouter.get("/all", protect, authorize("admin"), getAllBookings);//get All Bookings

export default bookingRouter;
