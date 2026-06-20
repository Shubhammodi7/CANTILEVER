import express from "express";
import multer from "multer";
const route = express.Router();
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  Logout,
  UpdateAvatar,
  UpdateProfile,
} from "../controllers/user.controller.js";

// api/user/logout
route.get("/logout", verifyToken, Logout);

// api/user/update-profile
route.put("/update-profile", verifyToken, UpdateProfile);

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

// api/user/update-avatar
route.post(
  "/update-avatar",
  verifyToken,
  upload.single("avatarFile"),
  UpdateAvatar,
);

export default route;
