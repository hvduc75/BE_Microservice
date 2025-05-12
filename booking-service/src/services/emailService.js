import { BookingModel } from "../models";
import nodemailer from "nodemailer";
import axios from "../utils/customAxios";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (bookingId) => {
  try {
    if (!bookingId) {
      return { EM: "Must have bookingId", EC: -1, DT: [] };
    }

    let booking = await BookingModel.findOne({ _id: bookingId });
    if (!booking) {
      return { EM: "Booking not found", EC: -1, DT: [] };
    }

    booking.status = "CONFIRMED";
    await booking.save();

    let data = await axios.get(
      `http://gateway:8080/event/getEventById?eventId=${booking.eventId}`
    );

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Hiển thị danh sách vé
    const ticketList = booking.tickets
      .map(
        (ticket) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${ticket.ticketName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${ticket.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${ticket.ticketPrice.toLocaleString()} VND</td>
      </tr>`
      )
      .join("");

    // Nội dung email
    const emailContent = `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
      <h2 style="color: #4CAF50; text-align: center;">🎟️ Xác nhận Đặt Vé Thành Công! 🎉</h2>
      
      <p>Xin chào <b>${booking.receiverName}</b>,</p>
      <p>${data.DT.contentEmail}</p>

      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><b>🎭 Sự kiện:</b></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.DT.eventName}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><b>📅 Thời gian:</b></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${new Date(data.DT.startDate).toLocaleTimeString("vi-VN", {hour: "2-digit",minute: "2-digit"})} - ${new Date(data.DT.startDate).toLocaleDateString("vi-VN")}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><b>📍 Địa điểm:</b></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.DT.locationName, data.DT.address }</td></tr>
      </table>

      <h3 style="color: #4CAF50;">🛒 Danh sách vé:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <th style="text-align: left; padding: 10px; border-bottom: 2px solid #4CAF50;">Loại vé</th>
          <th style="text-align: left; padding: 10px; border-bottom: 2px solid #4CAF50;">Số lượng</th>
          <th style="text-align: left; padding: 10px; border-bottom: 2px solid #4CAF50;">Giá</th>
        </tr>
        ${ticketList}
      </table>

      <p style="text-align: center; margin-top: 20px;">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${bookingId}" alt="QR Code" />
      </p>

      <p style="text-align: center; color: #888;">Hãy xuất trình mã QR Code này khi đến cổng sự kiện để check-in.</p>

      <div style="text-align: center; margin-top: 20px;">
        <a href="#" style="display: inline-block; padding: 10px 20px; background: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">Xem Vé Của Bạn</a>
      </div>

      <p style="text-align: center; font-size: 12px; color: #888; margin-top: 20px;">
        Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ <a href="mailto:support@ticketbox.com">support@ticketbox.com</a>.
      </p>
    </div>`;

    // Gửi email
    await transporter.sendMail({
      from: '"Ticket Box 🎟️" <noreply@ticketbox.com>',
      to: `${booking.receiverEmail}`,
      subject: "Xác nhận Đặt Vé Thành Công! 🎉",
      html: emailContent,
    });

    return { EM: "Email sent successfully", EC: 0, DT: [] };

  } catch (error) {
    console.log(error);
    return { EM: "Something went wrong in service...", EC: -2, DT: [] };
  }
};

module.exports = { sendEmail };
