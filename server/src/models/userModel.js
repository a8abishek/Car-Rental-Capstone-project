import { Schema, model } from "mongoose";

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
  },
  { timestamps: true },
);

// unique email + role
userSchema.index({ email: 1, role: 1 }, { unique: true });

const userModel = model("User", userSchema);

export default userModel;
