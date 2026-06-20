import express from "express";
import multer from "multer";
const route = express.Router();
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  addBlog,
  deleteBlog,
  editBlog,
  showAllBlog,
  showBlogById,
  toggleAdmires,
  updateBlog,
} from "../controllers/blog.controller.js";
import rateLimit from "express-rate-limit";

const admireLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, message: "Too many requests. Please slow down." },
});

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

route.post("/add", verifyToken, upload.single("blogImageFile"), addBlog);
route.get("/edit/:blogId", verifyToken, editBlog);
route.put("/update/:blogId", upload.single("blogImageFile"), updateBlog);
route.delete("/delete/:blogId", verifyToken, deleteBlog);
route.get("/get-all", showAllBlog);

route.get("/get/:userId", verifyToken, showBlogById);

route.put("/admires/:blogId", verifyToken, admireLimiter, toggleAdmires);

export default route;
