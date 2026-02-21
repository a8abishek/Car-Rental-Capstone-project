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
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

//ROUTER SETUP
const bookingRouter = express.Router();

//ROUTE SETUP
bookingRouter.post("/", protect, createBooking);

bookingRouter.put("/assign/:id", protect, authorize("admin"), assignDriver);

bookingRouter.put("/confirm/:id", protect, authorize("admin"), confirmBooking);

bookingRouter.put("/cancel/:id", protect, cancelBooking);

bookingRouter.put(
  "/admin-cancel/:id",
  protect,
  authorize("admin"),
  adminCancelBooking,
);

bookingRouter.get("/my-bookings", protect, getMyBookings);

bookingRouter.get("/unavailable/:carId", getCarUnavailableDates);

bookingRouter.get("/all", protect, authorize("admin"), getAllBookings);

export default bookingRouter;
