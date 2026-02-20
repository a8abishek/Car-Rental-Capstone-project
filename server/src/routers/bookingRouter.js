import express from "express";
import {
  createBooking,
  assignDriver,
  confirmBooking,
  cancelBooking,
  getMyBookings,
  adminCancelBooking,
  getCarUnavailableDates
} from "../controllers/bookingController.js";

import {protect} from '../middleware/authMiddleware.js'
import {authorize} from '../middleware/roleMiddleware.js'

const bookingRouter = express.Router();

bookingRouter.post("/", protect, createBooking);

bookingRouter.put("/assign/:id",
  protect,
  authorize("admin"),
  assignDriver
);

bookingRouter.put("/confirm/:id",
  protect,
  authorize("admin"),
  confirmBooking
);

bookingRouter.put("/cancel/:id",
  protect,
  cancelBooking
);

bookingRouter.put(
  "/admin-cancel/:id",
  protect,
  authorize("admin"),
  adminCancelBooking
);

bookingRouter.get("/my-bookings",
  protect,
  getMyBookings
);

bookingRouter.get("/unavailable/:carId", getCarUnavailableDates);

export default bookingRouter;
