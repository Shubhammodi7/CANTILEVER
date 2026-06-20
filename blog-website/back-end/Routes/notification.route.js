import express from "express";
const route = express.Router();
import { verifyToken } from "../middlewares/verifyToken.js";
import { getUserNotifications } from "../controllers/notification.controller.js";

route.get("/get", verifyToken, getUserNotifications);

export default route;
