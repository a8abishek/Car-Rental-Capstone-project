import { Schema, model } from "mongoose";

//create Schema
const driverSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    experienceYears: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

//create model
const driverModel = model("Driver", driverSchema);

export default driverModel;
