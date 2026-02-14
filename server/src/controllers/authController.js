import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
// import
import userModel from "../models/userModel.js";

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, password, role } = req.body;

    const existing = await userModel.findOne({ email, role });
    if (existing)
      return res
        .status(400)
        .json({ message: "User already exists with this role" });

    const hashed = await bcrypt.hash(password, 10);

    const status = role === "dealer" ? "pending" : "approved";

    await userModel.create({
      name,
      email,
      password: hashed,
      role,
      status,
    });

    res.status(201).json({
      message:
        role === "dealer"
          ? "Dealer registered. Waiting for admin approval."
          : "Customer registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password, role } = req.body;

    const user = await userModel.findOne({ email, role });
    if (!user)
      return res.status(400).json({ message: "Invalid email or role" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    if (role === "dealer" && user.status !== "approved")
      return res.status(403).json({ message: "Dealer not approved by admin" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
