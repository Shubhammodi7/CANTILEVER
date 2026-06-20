import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

import { errorBody } from "../helpers/errorBody.js";
import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";
import Response from "../models/response.model.js";

import Notification from "../models/notification.model.js";

export const addResponse = async (req, res, next) => {
  try {
    const { blogId } = req.params;

    const userId = req.user.id || req.user._id;

    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Response content cannot be empty.",
      });
    }

    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    const response = new Response({
      blog: blogId,
      author: userId,
      content: content.trim(),
    });

    await response.save();

    await response.populate("author", "username avatar");

    if (existingBlog.author.toString() !== userId.toString()) {
      await Notification.create({
        recipient: existingBlog.author,
        sender: userId,
        type: "response",
        blog: blogId,
      });
    }

    return res.status(200).json({
      success: true,
      response,
      message: "Response added",
    });
  } catch (error) {
    next(error);
  }
};

export const getResponse = async (req, res, next) => {
  try {
    const { blogId } = req.params;

    const responses = await Response.find({ blog: blogId })
      .populate("author", "username avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      responses,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteResponse = async (req, res, next) => {
  try {
    const { responseId } = req.params;

    const response = await Response.findById(responseId);

    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "Response not found." });
    }

    const userId = req.user.id || req.user._id;

    if (response.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this response.",
      });
    }

    await Response.findByIdAndDelete(responseId);

    return res.status(200).json({
      success: true,
      message: "Response successfully removed.",
    });
  } catch (error) {
    next(error);
  }
};

export const editResponse = async (req, res, next) => {
  try {
    const { responseId } = req.params;

    const userId = req.user.id || req.user._id;
    const { newContent } = req.body;

    const response = await Response.findById(responseId);

    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "Response not found." });
    }

    if (response.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this response.",
      });
    }

    const updatedResponse = await Response.findByIdAndUpdate(
      responseId,
      { content: newContent.trim() },
      { returnDocument: "after", runValidators: true },
    ).populate("author", "username avatar");

    return res.status(200).json({
      success: true,
      newResponse: updatedResponse,
      message: "Response updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};
