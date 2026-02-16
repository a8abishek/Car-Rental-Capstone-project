import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
// import
import userModel from "./src/models/userModel.js";

//config
dotenv.config();

//create Admin
const createAdmin = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);

  //validation
  const existing = await userModel.findOne({
    email: process.env.ADMIN_EMAIL,
  });

  if (existing) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashed = await bcrypt.hash(
    process.env.ADMIN_PASSWORD,
    Number(process.env.BCRYPT_SALT)
  );

  await userModel.create({
    name: "Admin",
    email: process.env.ADMIN_EMAIL,
    password: hashed,
    role: "admin",
    status: "approved",
  });

  console.log("Admin created");
  process.exit();
};

createAdmin();
