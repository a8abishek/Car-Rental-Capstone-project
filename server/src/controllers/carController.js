import carModel from "../models/carModel.js";
import { validationResult } from "express-validator";

/* ================= ADD CAR ================= */
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

    const status =
      req.user.role === "admin" ? "approved" : "pending";

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
        req.user.role === "admin"
          ? "Car added and approved"
          : "Car added. Waiting for admin approval",
      car,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= GET SINGLE CAR ================= */
export const getSingleCar = async (req, res) => {
  try {
    const car = await carModel.findById(req.params.id);

    if (!car)
      return res.status(404).json({ message: "Car not found" });

    res.json(car);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= UPDATE CAR ================= */
export const updateCar = async (req, res) => {
  try {
    const car = await carModel.findById(req.params.id);

    if (!car)
      return res.status(404).json({ message: "Car not found" });

    if (
      req.user.role === "dealer" &&
      car.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    delete req.body.createdBy;
    delete req.body.createdRole;
    delete req.body.status;

    if (req.body.carNumber) {
      req.body.carNumber = req.body.carNumber.toUpperCase();
    }

    Object.assign(car, req.body);

    await car.save();

    res.json({ message: "Car updated successfully", car });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= DELETE CAR ================= */
export const deleteCar = async (req, res) => {
  try {
    const car = await carModel.findById(req.params.id);

    if (!car)
      return res.status(404).json({ message: "Car not found" });

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


/* ================= DEALER VIEW OWN CARS ================= */
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


/* ================= GET APPROVED CARS ================= */
export const getApprovedCars = async (req, res) => {
  try {
    const cars = await carModel.find({ status: "approved" });
    res.json(cars);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= GET PENDING CARS ================= */
export const getPendingCars = async (req, res) => {
  try {
    const cars = await carModel.find({ status: "pending" });
    res.json(cars);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= APPROVE CAR ================= */
export const approveCar = async (req, res) => {
  try {
    const car = await carModel.findById(req.params.id);

    if (!car)
      return res.status(404).json({ message: "Car not found" });

    car.status = "approved";
    await car.save();

    res.json({ message: "Car approved successfully", car });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= GET ALL CARS (ADMIN) ================= */
export const getAllCars = async (req, res) => {
  try {
    const cars = await carModel
      .find()
      .populate("createdBy", "name email role");

    res.json(cars);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
