import { validationResult } from "express-validator";
import carModel from "../models/carModel.js";
import bookingModel from "../models/bookingModel.js";

/* ADD CAR- Admin → auto approved - Dealer → auto pending */

export const addCar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const {
      carName,
      brand,
      carCompany,
      carNumber,
      transmission,
      carRunning,
      carType,
      seatingCapacity,
      pricePerDay,
      carFeatures,
      carImage,
    } = req.body;

    const upperCarNumber = carNumber.toUpperCase();

    const existingCar = await carModel.findOne({
      carNumber: upperCarNumber,
    });

    if (existingCar) {
      return res.status(400).json({
        message: "Car with this number plate already exists",
      });
    }

    // ROLE BASED AUTO STATUS
    const status = req.user.role === "admin" ? "approved" : "pending";

    const car = await carModel.create({
      carName,
      brand,
      carCompany,
      carNumber: upperCarNumber,
      transmission,
      carRunning,
      carType,
      seatingCapacity,
      pricePerDay,
      carFeatures: carFeatures || [],
      carImage,
      createdBy: req.user._id,
      createdRole: req.user.role,
      status,
    });

    res.status(201).json({
      message:
        status === "approved"
          ? "Car added and approved"
          : "Car added. Waiting for admin approval",
      car,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET SINGLE CAR */
export const getSingleCar = async (req, res) => {
  try {
    const car = await carModel.findById(req.params.id);

    if (!car) return res.status(404).json({ message: "Car not found" });

    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE CAR-  Dealer can edit only own car  - Only admin can change status */
export const updateCar = async (req, res) => {
  try {
    const car = await carModel.findById(req.params.id);

    if (!car) return res.status(404).json({ message: "Car not found" });

    // Dealer can only edit own car
    if (
      req.user.role === "dealer" &&
      car.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Only admin can modify status
    if (req.user.role !== "admin") {
      delete req.body.status;
    }

    // Prevent modifying protected fields
    delete req.body.createdBy;
    delete req.body.createdRole;

    if (req.body.carNumber) {
      req.body.carNumber = req.body.carNumber.toUpperCase();
    }

    Object.assign(car, req.body);

    await car.save();

    res.json({
      message: "Car updated successfully",
      car,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*  DELETE CAR - Dealer can delete only own car - Admin can delete any*/
export const deleteCar = async (req, res) => {
  try {
    const car = await carModel.findById(req.params.id);

    if (!car) return res.status(404).json({ message: "Car not found" });

    if (
      req.user.role === "dealer" &&
      car.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await car.deleteOne();

    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*DEALER VIEW OWN CARS */
export const getDealerCars = async (req, res) => {
  try {
    const cars = await carModel.find({
      createdBy: req.user._id,
    });

    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET APPROVED CARS (Public) */
export const getApprovedCars = async (req, res) => {
  try {
    const cars = await carModel.find({
      status: "approved",
    });

    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET PENDING CARS (Admin)*/
export const getPendingCars = async (req, res) => {
  try {
    const cars = await carModel.find({
      status: "pending",
    });

    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ADMIN TOGGLE STATUS - approved ⇄ pending */
export const toggleCarStatus = async (req, res) => {
  try {
    const car = await carModel.findById(req.params.id);

    if (!car) return res.status(404).json({ message: "Car not found" });

    car.status = car.status === "approved" ? "pending" : "approved";

    await car.save();

    res.json({
      message: "Car status updated successfully",
      status: car.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*ADMIN VIEW ALL CARS*/
export const getAllCars = async (req, res) => {
  try {
    const cars = await carModel.find().populate("createdBy", "name email role");

    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add this to your controllers
export const getDealerStats = async (req, res) => {
  try {
    const dealerId = req.user._id;

    // 1. Get all cars owned by this dealer
    const cars = await carModel.find({ createdBy: dealerId });
    const carIds = cars.map((car) => car._id);

    // 2. Get Weekly Revenue (Last 7 Days) for the Chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyRevenue = await bookingModel.aggregate([
      {
        $match: {
          car: { $in: carIds },
          status: "confirmed", // or "completed"
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 3. Get Recent Bookings with details
    const recentBookings = await bookingModel.find({ 
      car: { $in: carIds }, 
      status: { $in: ["confirmed", "completed"] } 
    })
      .populate("car", "carName carImage")
      .populate("customer", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    // 4. Calculate Revenue Totals
    const allBookings = await bookingModel.find({ car: { $in: carIds }, status: "confirmed" });
    const totalGrossRevenue = allBookings.reduce((sum, b) => sum + b.totalAmount, 0);

    res.json({
      totalCars: cars.length,
      activeCars: cars.filter((c) => c.status === "approved").length,
      bookingCount: allBookings.length,
      weeklyRevenue,
      revenue: {
        gross: totalGrossRevenue,
        commission: totalGrossRevenue * 0.3, // 30% Platform fee
        net: totalGrossRevenue * 0.7,        // 70% Dealer take-home
      },
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};