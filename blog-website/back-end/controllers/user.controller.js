import dotenv from "dotenv";
dotenv.config();

import User from "../models/user.model.js";
import { errorBody } from "../helpers/errorBody.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_APP_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});

export const Logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logout Successful",
    });
  } catch (error) {
    next(err);
  }
};

export const UpdateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { username, bio, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(errorBody(44, "User Not Found"));
    }

    if (newPassword) {
      if (!currentPassword) {
        return next(
          errorBody(402, "Current password is required to change password"),
        );
      }

      const isMatch = await user.comparePassword(currentPassword);

      if (!isMatch) {
        return next(errorBody(400, "Invalid Current Password"));
      }

      user.password = newPassword;
    }

    if (username) user.username = username;

    if (bio) user.bio = bio;

    const updatedUser = await user.save();

    const { password: _, ...userWithoutPassword } = updatedUser._doc;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userWithoutPassword,
    });
  } catch (err) {
    next(err);
  }
};

export const UpdateAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return next(errorBody(400, "No image file provided."));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(errorBody(404, "User Not Found"));
    }

    const fileBase64 = req.file.buffer.toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${fileBase64}`;

    const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
      folder: "blog_avatars",
      resource_type: "image",
    });

    console.log(
      "Cloudinary Upload Success! Dynamic URL:",
      cloudinaryResponse.secure_url,
    );

    user.avatar = cloudinaryResponse.secure_url;
    const updatedUser = await user.save();

    const { password: _, ...userWithoutPassword } = updatedUser._doc;

    return res.status(200).json({
      success: true,
      message: "Avatar Updated successfully",
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("CRITICAL CRASH INSIDE UPDATEAVATAR:");
    console.error(err);

    next(err);
  }
};
