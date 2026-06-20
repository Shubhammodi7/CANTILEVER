import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";
connectDB();

import authRoute from "./Routes/auth.route.js";
import userRoute from "./Routes/user.routes.js";
import categoryRoute from "./Routes/category.route.js";
import blogRoute from "./Routes/blog.route.js";
import responseRoute from "./Routes/response.route.js";
import notificationRoute from "./Routes/notification.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/blogs", blogRoute);
app.use("/api/response", responseRoute);
app.use("/api/notification", notificationRoute);

const PORT = process.env.PORT;
console.log("front-end is running at: ", process.env.FRONTEND_URL);
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Internal Server Error" });
});
