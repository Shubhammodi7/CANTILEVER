import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  addCategory,
  deleteCategory,
  editCategory,
  showAllCategory,
  showCategory,
} from "../controllers/category.controller.js";

const route = express.Router();

route.post("/add", verifyToken, addCategory);
route.put("/update/:categoryId", verifyToken, editCategory);
route.delete("/delete/:categoryId", verifyToken, deleteCategory);

route.get("/show/:categoryId", showCategory);
route.get("/all-category", showAllCategory);

export default route;
