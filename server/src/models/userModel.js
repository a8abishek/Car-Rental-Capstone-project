import { Schema, model } from "mongoose";

//create Schema
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["customer", "dealer", "admin"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "approved",
    },
    savedCars: {
      type: [{ type: Schema.Types.ObjectId, ref: "Car" }],
      default: [],
    },
  },
  { timestamps: true },
);

// unique email + role
userSchema.index({ email: 1, role: 1 }, { unique: true });

//create Model
const userModel = model("User", userSchema);

export default userModel;
