import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Người nhận thông báo
    eventId: { type: String, default: null }, // Liên kết đến sự kiện, nếu có
    eventImage: { type: String, default: null }, // Hình ảnh sự kiện, nếu có
    type: { type: String, required: true }, // Ví dụ: 'event_approval_request'
    title: { type: String, required: true }, // Tiêu đề thông báo
    message: { type: String, required: true }, // Nội dung thông báo
    status: { type: String, enum: ["unread", "read"], default: "unread" },
    readAt: { type: Date, default: null }, // Thời gian đã đọc
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Notification", NotificationSchema);
