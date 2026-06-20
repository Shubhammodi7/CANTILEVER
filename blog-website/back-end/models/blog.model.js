import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const BlogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
    },

    blogContent: {
      type: String,
      required: true,
      trim: true,
    },

    blogImageFile: {
      type: String,
      trim: true,
    },
    admires: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

const Blog = mongoose.model("Blog", BlogSchema, "blogs");
export default Blog;
