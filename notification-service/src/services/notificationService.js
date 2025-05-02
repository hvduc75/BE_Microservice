import { NotificationModel } from "../models";
import { emitToUser } from "../config/socket";

const createNotification = async (data) => {
  try {
    const { eventId, userId, eventImage, type, title, message } = data;

    // Lưu vào MongoDB
    const notification = await NotificationModel.create({
      userId,
      eventId,
      eventImage,
      type,
      title,
      message,
    });

    // Gửi realtime qua socket.io
    emitToUser(userId, {
      type,
      title,
      message,
      eventId,
      eventImage,
      createdAt: notification.createdAt,
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

const getAllNotifications = async (userId) => {
  try {
    const notifications = await NotificationModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return {
      EM: "Get all notifications successfully",
      EC: 0,
      DT: notifications,
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return {
      EM: "Error fetching notifications",
      EC: -1,
      DT: [],
    };
  }
};

module.exports = { createNotification, getAllNotifications };
