import express from "express";
// import
import { approveDealer } from "../controllers/adminController.js";
import {protect,adminOnly} from '../middleware/authMiddleware.js'

const adminRouter = express.Router();

adminRouter.put("/approve/:id", protect, adminOnly, approveDealer);

export default adminRouter;
