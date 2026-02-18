import express from "express";
import {
  createBooking,
  assignDriver,
  confirmBooking,
  cancelBooking,
  getMyBookings,
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

bookingRouter.get("/my-bookings",
  protect,
  getMyBookings
);

export default bookingRouter;
