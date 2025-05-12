import axios from "axios";
import amqplib from "amqplib";
import dotenv from "dotenv";
dotenv.config();

const MSG_QUEUE_URL = process.env.MSG_QUEUE_URL;
const EXCHANGE_NAME = process.env.EXCHANGE_NAME;
const BOOKING_SERVICE = "booking_service";

export const PublishBookingEvent = async (payload) => {
  try {
    console.log("📤 [REQUEST] Gửi API từ booking-service:");
    console.log("📦 Body:", JSON.stringify(payload, null, 2));

    const formData = new FormData();
    formData.append("event", payload.event);
    formData.append("data", JSON.stringify(payload.data));

    let response = await axios.post(
      "http://gateway:8080/event/booking-httpcall",
      formData
    );

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

export const CreateChannel = async () => {
  try {
    console.log("🔌 Đang kết nối đến RabbitMQ:", MSG_QUEUE_URL);
    const connection = await amqplib.connect(MSG_QUEUE_URL);
    const channel = await connection.createChannel();
    console.log("✅ Đã tạo channel thành công");
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
    return channel;
  } catch (error) {
    console.error("❌ Lỗi khi tạo channel:", error.message);
    return null;
  }
};

export const PublishMessage = (channel, service, msg) => {
  channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
  console.log(`[x] Sent ${msg}`);
};

export const SubscribeMessage = async (channel, service) => {
  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
  const q = await channel.assertQueue("", { exclusive: true });
  console.log(`[*] Waiting for messages in ${q.queue}`);

  await channel.bindQueue(q.queue, EXCHANGE_NAME, BOOKING_SERVICE);

  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
        const parsedData = JSON.parse(msg.content.toString());
        service.handleEvent(parsedData);
      }
      console.log("[X] received");
    },
    {
      noAck: true,
    }
  );
};
