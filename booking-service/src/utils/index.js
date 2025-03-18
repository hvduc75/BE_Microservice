import axios from "axios";
import amqplib from "amqplib";
import dotenv from "dotenv";
dotenv.config();


export const PublishBookingEvent = async (payload) => {
  try {
    console.log("📤 [REQUEST] Gửi API từ booking-service:");
    console.log("📦 Body:", JSON.stringify(payload, null, 2));

    const formData = new FormData();
    formData.append("event", payload.event); 
    formData.append("data", JSON.stringify(payload.data));

    let response = await axios.post("http://localhost:8080/event/booking-httpcall", formData);    

    console.log("✅ [RESPONSE] API từ event-service:");
    console.log("🔄 Status:", response.status);
    console.log("📥 Data:", JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error("❌ [ERROR] Lỗi khi gọi API:");
    if (error.response) {
      console.log("🔄 Status:", error.response.status);
      console.log("📥 Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log("❌ Không có response từ server:", error.message);
    }
  }
};
