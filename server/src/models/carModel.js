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
      trim: true,
    },

    carCompany: {
      type: String,
      required: true,
      trim: true,
    },

    carNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    transmission: {
      type: String,
      enum: ["manual", "automatic"],
      required: true,
    },

    /* 🔥 NEW FIELD: Fuel Type */
    carRunning: {
      type: String,
      enum: ["petrol", "diesel", "electric", "hybrid"],
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
      min: 4,
    },

    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },

    /* 🔥 NEW FIELD: Car Features */
    carFeatures: {
      type: [String],   // Array of features
      default: [],
    },

    carImage: {
      type: String,  // store image URL
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

export default carModel;
