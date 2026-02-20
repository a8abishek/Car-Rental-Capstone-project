//import
import driverModel from "../models/driverModel.js";

//ADD DRIVER
export const addDriver = async (req, res) => {
  try {
    const driver = await driverModel.create(req.body);
    res.status(201).json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//GET ALL DRIVERS (ADMIN)
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await driverModel.find();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//GET ACTIVE DRIVERS
export const getActiveDrivers = async (req, res) => {
  try {
    const drivers = await driverModel.find({
      isActive: true,
      isAvailable: true,
    });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//TOGGLE DRIVER STATUS
export const toggleDriverStatus = async (req, res) => {
  try {
    const driver = await driverModel.findById(req.params.id);

    if (!driver) return res.status(404).json({ message: "Driver not found" });

    driver.isActive = !driver.isActive;
    await driver.save();

    res.json({ message: "Driver status updated", driver });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
