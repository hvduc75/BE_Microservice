import express from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import http from 'http';

import connectDB from "./config/ConnectDB.js";
import initApiRoutes from "./routes/api.js";
import { initSocket } from "./config/socket.js";
import { CreateChannel } from "./utils/index.js";

dotenv.config();

const StartServer = async () => {
  const app = express();
  const server = http.createServer(app); // 👈 Tạo server HTTP

  // config bodyParser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // config cookie-parser
  app.use(cookieParser());

  // Khởi tạo WebSocket riêng biệt
  initSocket(server);

  // Khởi tạo RabbitMQ channel
  const channel = await CreateChannel();

  initApiRoutes(app, channel);
  await connectDB();

  const PORT = process.env.PORT || 8085;
  server.listen(PORT, () => {
    console.log(`Notification Service is running on port ${PORT}`);
  });
}

StartServer();
