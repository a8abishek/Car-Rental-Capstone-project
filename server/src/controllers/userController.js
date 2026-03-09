import bcrypt from "bcryptjs";
// import
import userModel from "../models/userModel.js";

//get Profile
export const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROFILE NAME
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await userModel.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    await user.save();

    res.json({ message: "Profile updated successfully", name: user.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Saved Cars
export const toggleSavedCar = async (req, res) => {
  try {
    const { carId } = req.body;
    const user = await userModel.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure array exists
    if (!user.savedCars) user.savedCars = [];

    const isSaved = user.savedCars.some((id) => id.toString() === carId);

    if (isSaved) {
      // Remove: compare strings to strings
      user.savedCars = user.savedCars.filter((id) => id.toString() !== carId);
    } else {
      // Add
      user.savedCars.push(carId);
    }

    await user.save();

    // Return the updated array so frontend can sync if needed
    res.json({
      message: isSaved ? "Removed from favorites" : "Added to favorites",
      savedCars: user.savedCars,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get the list of saved cars with full details
export const getSavedCars = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate("savedCars");

    // Filter out nulls in case a car was deleted from the database
    const validCars = user.savedCars.filter((car) => car !== null);

    res.json(validCars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
