import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// import
import DBConnection from "./src/config/dbConnection.js";
// import Router
import authRouter from "./src/routers/authRouer.js";
import adminRouter from "./src/routers/adminRouter.js";
import carRouter from "./src/routers/carRouter.js";
import bookingRouter from "./src/routers/bookingRouter.js";
import driverRouter from "./src/routers/driverRouter.js";
import userRouter from "./src/routers/userRouter.js";
import reviewRouter from "./src/routers/reviewRouter.js";
import paymentRouter from "./src/routers/paymentRoutes.js";

//app Setup
const app = express();

//config
dotenv.config();

//Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FORNTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

//DB connection
DBConnection();

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/cars", carRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/driver", driverRouter);
app.use("/api/users", userRouter);
app.use("/api/review", reviewRouter);
app.use("/api/payment", paymentRouter);
// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Car Rental Server is Running Successfully",
  });
});

//server listen
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running... on http://localhost:${PORT}`);
});
