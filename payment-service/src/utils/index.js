import axios from "axios";
import amqplib from "amqplib";
import dotenv from "dotenv";
dotenv.config();

const MSG_QUEUE_URL = process.env.MSG_QUEUE_URL;
const EXCHANGE_NAME = process.env.EXCHANGE_NAME;

export const CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MSG_QUEUE_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(EXCHANGE_NAME, "direct", { durable: true });
    return channel;
  } catch (error) {
    console.log(error);
  }
};

export const PublishMessage = (channel, service, msg) => {
  channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
  console.log(`[x] Sent ${msg}`);
};
