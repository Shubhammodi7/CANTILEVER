import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

import { errorBody } from "../helpers/errorBody.js";
import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";

import { encode } from "entities";

import { v2 as cloudinary } from "cloudinary";
import Response from "../models/response.model.js";
import Notification from "../models/notification.model.js";

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_APP_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});

export const addBlog = async (req, res, next) => {
  try {
    const { category, title, slug, blogContent } = req.body;

    const activeCategory = await Category.findById(category);

    if (!activeCategory) {
      return next(errorBody(404, "No Category Found"));
    }

    if (!req.file) {
      return next(
        errorBody(400, "Featured cover image file is required or invalid."),
      );
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

    const blog = new Blog({
      author: req.user._id || req.user.id,
      category: activeCategory._id,
      title,
      slug,
      blogContent: encode(blogContent),
    });

    blog.blogImageFile = cloudinaryResponse.secure_url;
    await blog.save();

    return res.status(201).json({
      success: true,
      message: "Blog added successfully",
      blog: blog,
    });
  } catch (error) {
    next(error);
  }
};

export const editBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId).populate("category", "name");

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;

    const { category, title, slug, blogContent } = req.body;

    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return next(errorBody(404, "No Blog Post Found with this ID"));
    }

    const activeCategory = await Category.findById(category);
    if (!activeCategory) {
      return next(errorBody(404, "No Category Found"));
    }

    const updateFields = {
      category: activeCategory._id,
      title,
      slug,
      blogContent,
    };

    if (req.file) {
      const fileBase64 = req.file.buffer.toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${fileBase64}`;

      const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
        folder: "blog_avatars",
        resource_type: "image",
      });
      updateFields.blogImageFile = cloudinaryResponse.secure_url;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;

    const userId = req.user.id || req.user._id;

    const blog = await Blog.findById(blogId);

    if (blog.author.toString() !== userId) {
      return next(errorBody(402, "This Blog not belongs to you"));
    }

    await Response.deleteMany({ blog: blogId });

    await Blog.findOneAndDelete(blogId);

    return res.status(201).json({
      success: true,
      message: "Blog Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const showAllBlog = async (req, res, next) => {
  try {
    const blog = await Blog.find()
      .populate("author", "username avatar")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return res.status(200).json({
      blog,
    });
  } catch (error) {
    next(error);
  }
};

export const showBlogById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (
      !userId ||
      userId === "undefined" ||
      userId === "null" ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID format requested.",
      });
    }

    const blog = await Blog.find({ author: userId })
      .populate("author", "username avatar")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return res.status(200).json({
      blog,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleAdmires = async (req, res, next) => {
  try {
    const { blogId } = req.params;

    const userId = req.user.id || req.user._id;

    const blog = await Blog.findById(blogId);
    const isAdmired = blog.admires.includes(userId);

    if (isAdmired) {
      await Blog.findByIdAndUpdate(
        blogId,
        { $pull: { admires: userId } },
        { returnDocument: "after", runValidators: true },
      );

      return res
        .status(200)
        .json({ success: true, message: "Removed admire." });
    } else {
      if (blog.author.toString() !== userId.toString()) {
        await Notification.create({
          recipient: blog.author,
          sender: userId,
          type: "admire",
          blog: blogId,
        });
      }

      await Blog.findByIdAndUpdate(
        blogId,
        { $addToSet: { admires: userId } },
        { returnDocument: "after", runValidators: true },
      );

      return res.status(200).json({ success: true, message: "Added admire." });
    }
  } catch (error) {
    next(error);
  }
};
