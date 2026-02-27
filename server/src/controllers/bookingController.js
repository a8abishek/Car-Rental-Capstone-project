import dotenv from "dotenv";
import Stripe from "stripe";
// import
import bookingModel from "../models/bookingModel.js";
import carModel from "../models/carModel.js";
import driverModel from "../models/driverModel.js";

//config
dotenv.config();

// create stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const {
      carId,
      bookingType,
      drivingLicense,
      pickupLocation,
      dropLocation,
      pickupDate,
      dropDate,
      paymentId,
    } = req.body;

    // Validation
    if (!paymentId)
      return res.status(400).json({ message: "Payment ID is required" });

    const car = await carModel.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    // CHECK DATE CONFLICT
    const existingBooking = await bookingModel.findOne({
      car: carId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          pickupDate: { $lte: new Date(dropDate) },
          dropDate: { $gte: new Date(pickupDate) },
        },
      ],
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "Car already booked for selected dates" });
    }

    const days = Math.ceil(
      (new Date(dropDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24),
    );
    if (days <= 0)
      return res.status(400).json({ message: "Invalid date selection" });

    const totalAmount = days * car.pricePerDay;

    const booking = await bookingModel.create({
      car: carId,
      customer: req.user._id,
      bookingType,
      drivingLicense,
      pickupLocation,
      dropLocation,
      pickupDate,
      dropDate,
      totalAmount,
      advancePaid: totalAmount,
      paymentId,
      paymentStatus: "paid",
      status: "pending",
    });

    res.status(201).json({
      message: "Booking created with Full Payment. Waiting for confirmation.",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN ASSIGN DRIVER
export const assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;

    const booking = await bookingModel.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const driver = await driverModel.findById(driverId);

    if (!driver || !driver.isActive || !driver.isAvailable)
      return res.status(400).json({ message: "Driver not available" });

    booking.driverAssigned = driver._id;
    booking.status = "confirmed";

    driver.isAvailable = false;

    await booking.save();
    await driver.save();

    res.json({
      message: "Driver assigned & booking confirmed",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//ADMIN CONFIRM SELF BOOKING
export const confirmBooking = async (req, res) => {
  try {
    const booking = await bookingModel.findById(req.params.id).populate("car");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "confirmed";
    await booking.save();

    res.json({ message: "Booking confirmed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//CANCEL BOOKING (CUSTOMER)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await bookingModel.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status === "cancelled")
      return res.status(400).json({ message: "Already cancelled" });

    const now = new Date();
    const pickup = new Date(booking.pickupDate);
    const hoursDiff = (pickup - now) / (1000 * 60 * 60);

    let refundAmount = booking.advancePaid;
    let penaltyApplied = false;

    // REFUND LOGIC: If less than 24h, deduct 3% penalty
    if (hoursDiff < 24 && booking.advancePaid > 0) {
      refundAmount = booking.advancePaid * 0.97;
      penaltyApplied = true;
    }

    //STRIPE REFUND
    if (booking.paymentId) {
      await stripe.refunds.create({
        payment_intent: booking.paymentId,
        amount: Math.round(refundAmount * 100),
      });
    }

    // Release Driver
    if (booking.driverAssigned) {
      await driverModel.findByIdAndUpdate(booking.driverAssigned, {
        isAvailable: true,
      });
    }

    booking.status = "cancelled";
    booking.paymentStatus = "refunded";
    await booking.save();

    res.json({
      message: penaltyApplied
        ? "Cancelled with 3% penalty deducted from refund."
        : "Cancelled with 100% full refund.",
      refundAmount: refundAmount.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//CUSTOMER BOOKINGS
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingModel
      .find({ customer: req.user._id })
      .populate("car")
      .populate("driverAssigned");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//ADMIN CANCEL BOOKING
export const adminCancelBooking = async (req, res) => {
  try {
    const booking = await bookingModel.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // ADMIN ALWAYS GIVES 100% REFUND
    if (booking.paymentId && booking.paymentStatus === "paid") {
      await stripe.refunds.create({
        payment_intent: booking.paymentId,
        amount: Math.round(booking.advancePaid * 100),
      });
    }

    if (booking.driverAssigned) {
      await driverModel.findByIdAndUpdate(booking.driverAssigned, {
        isAvailable: true,
      });
    }

    booking.status = "cancelled";
    booking.paymentStatus = "refunded";
    await booking.save();

    res.json({
      message: "Booking cancelled by admin. Full refund processed via Stripe.",
      refundAmount: booking.advancePaid.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCarUnavailableDates = async (req, res) => {
  try {
    const bookings = await bookingModel
      .find({
        car: req.params.carId,
        status: { $in: ["pending", "confirmed"] },
      })
      .select("pickupDate dropDate");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL BOOKINGS (ADMIN)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel
      .find()
      .populate("car")
      .populate("customer", "name email phone")
      .populate("driverAssigned")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to bookingController.js
export const getCustomerStats = async (req, res) => {
  try {
    const customerId = req.user._id;

    // 1. Get Summary Counts
    const totalBookings = await bookingModel.countDocuments({
      customer: customerId,
    });
    const upcomingTrips = await bookingModel.countDocuments({
      customer: customerId,
      status: "confirmed",
      pickupDate: { $gt: new Date() },
    });

    // 2. Calculate Total Spent (Excluding Cancelled Bookings)
    const spentData = await bookingModel.aggregate([
      {
        $match: {
          customer: customerId,
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalSpent = spentData.length > 0 ? spentData[0].totalSpent : 0;

    // 3. Get the SINGLE latest active/confirmed rental
    const activeRental = await bookingModel
      .findOne({
        customer: customerId,
        status: "confirmed",
      })
      .populate("car")
      .sort({ pickupDate: -1 });

    // 4. Get ONLY the latest 3 bookings for History
    const bookingHistory = await bookingModel
      .find({ customer: customerId })
      .populate("car", "carName carImage brand")
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      totalBookings,
      upcomingTrips,
      totalSpent,
      activeRental,
      bookingHistory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CUSTOMER PAYMENT HISTORY
export const getPaymentHistory = async (req, res) => {
  try {
    const customerId = req.user._id;

    // Fetch bookings that have a payment record
    const payments = await bookingModel
      .find({ customer: customerId })
      .populate("car", "carName brand carImage")
      .select(
        "totalAmount advancePaid paymentStatus status createdAt pickupDate",
      )
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
