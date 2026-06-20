import express from "express";
const route = express.Router();
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  addResponse,
  deleteResponse,
  editResponse,
  getResponse,
} from "../controllers/response.controller.js";

route.get("/get/:blogId", getResponse);
route.post("/add/:blogId", verifyToken, addResponse);
route.delete("/delete/:responseId", verifyToken, deleteResponse);
route.put("/update/:responseId", verifyToken, editResponse);

export default route;
