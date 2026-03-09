import express from "express";
// import
import { register, login } from "../controllers/authController.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/authValidator.js";

//router setup
const authRouter = express.Router();

//routes setup
authRouter.post("/register", registerValidator, register); //register
authRouter.post("/login", loginValidator, login); //login

export default authRouter;
