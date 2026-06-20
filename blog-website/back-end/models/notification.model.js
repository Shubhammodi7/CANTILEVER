import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    type: {
      type: String,
      enum: ["admire", "response"],
      required: true,
    },

    blog: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Blog",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model(
  "Notification",
  NotificationSchema,
  "notifications",
);
export default Notification;
