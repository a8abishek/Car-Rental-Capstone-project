import { Schema, model } from "mongoose";

const carSchema = new Schema(
  {
    carName: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
    },

    carCompany: {
      type: String,
      required: true,
    },

    carNumber: {
      type: String,
      required: true,
      unique: true,   // 🔥 UNIQUE NUMBER PLATE
      uppercase: true,
      trim: true,
    },

    transmission: {
      type: String,
      enum: ["manual", "automatic"],
      required: true,
    },

    carType: {
      type: String,
      enum: ["mid-size", "standard", "premium", "luxury"],
      required: true,
    },

    seatingCapacity: {
      type: Number,
      required: true,
    },

    pricePerDay: {
      type: Number,
      required: true,
    },

    carImage: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdRole: {
      type: String,
      enum: ["admin", "dealer"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const carModel = model("Car", carSchema);

export default carModel
