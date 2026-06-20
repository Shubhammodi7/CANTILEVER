import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Blog",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxLength: 500,
    },
  },
  { timestamps: true },
);

const Response = mongoose.model("Response", responseSchema, "responses");
export default Response;
