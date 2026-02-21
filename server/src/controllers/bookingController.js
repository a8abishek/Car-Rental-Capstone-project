// import
import bookingModel from "../models/bookingModel.js";
import carModel from "../models/carModel.js";
import driverModel from "../models/driverModel.js";

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
    } = req.body;

    const car = await carModel.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    //CHECK DATE CONFLICT
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
      return res.status(400).json({
        message: "Car already booked for selected dates",
      });
    }

    const days =
      (new Date(dropDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24);

    if (days <= 0)
      return res.status(400).json({ message: "Invalid date selection" });

    const totalAmount = days * car.pricePerDay;
    const advancePaid = totalAmount * 0.5;

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
      advancePaid,
      paymentStatus: "partial",
      status: "pending",
    });

    res.status(201).json({
      message: "Booking created. Waiting for admin confirmation.",
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

    const now = new Date();
    const pickup = new Date(booking.pickupDate);
    const hoursDiff = (pickup - now) / (1000 * 60 * 60);

    // REFUND LOGIC: If less than 24h, deduct 3%
    let refundAmount = booking.advancePaid;
    let penaltyApplied = false;

    if (hoursDiff < 24 && booking.advancePaid > 0) {
      refundAmount = booking.advancePaid * 0.97; // 3% deduction
      penaltyApplied = true;
    }

    // Release Driver if assigned
    if (booking.driverAssigned) {
      const driver = await driverModel.findById(booking.driverAssigned);
      if (driver) {
        driver.isAvailable = true;
        await driver.save();
      }
    }

    booking.status = "cancelled";
    booking.paymentStatus = "refunded";
    await booking.save();

    res.json({
      message: penaltyApplied
        ? "Cancelled with 3% penalty."
        : "Cancelled with full refund.",
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

    // ADMIN CANCELLATION IS ALWAYS 100% REFUND
    let refundAmount = booking.advancePaid;

    if (booking.driverAssigned) {
      const driver = await driverModel.findById(booking.driverAssigned);
      if (driver) {
        driver.isAvailable = true;
        await driver.save();
      }
    }

    booking.status = "cancelled";
    booking.paymentStatus = "refunded";
    await booking.save();

    res.json({
      message: "Booking cancelled by admin. Full refund processed.",
      refundAmount: refundAmount.toFixed(2),
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
