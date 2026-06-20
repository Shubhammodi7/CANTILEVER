import Notification from "../models/notification.model.js";

export const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;

    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "username avatar")
      .populate("blog", "title")
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};
