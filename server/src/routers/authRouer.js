import express from "express";
// import
import { register,login } from "../controllers/authController.js";
import {registerValidator,loginValidator} from '../validators/authValidator.js'

const authRouter = express.Router();

authRouter.post("/register", registerValidator, register);
authRouter.post("/login", loginValidator, login);

export default authRouter;
