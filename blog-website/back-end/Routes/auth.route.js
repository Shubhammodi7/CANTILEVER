import express from "express";
const route = express.Router();
import {
  Register,
  Login,
  GoogleLogin,
  GetUser,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

// //api/auth/send-otp
// route.post("/send-otp", sendSignupOtp);

// api/auth/register
route.post("/register", Register);

// api/auth/login
route.post("/login", Login);

// api/auth/login
route.post("/google-login", GoogleLogin);

// api/auth/get-user
route.get("/get-user", GetUser);

export default route;
