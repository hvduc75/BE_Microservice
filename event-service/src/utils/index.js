import amqplib from "amqplib";
import dotenv from "dotenv";
dotenv.config();

const MSG_QUEUE_URL = process.env.MSG_QUEUE_URL;
const EXCHANGE_NAME = process.env.EXCHANGE_NAME;
const EVENT_SERVICE = "event_service";

export const CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MSG_QUEUE_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
    return channel;
  } catch (error) {
    console.log(error);
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

  await channel.bindQueue(q.queue, EXCHANGE_NAME, EVENT_SERVICE);

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