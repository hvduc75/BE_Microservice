import express from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import connectDB from "./config/ConnectDB.js";
import initApiRoutes from "./routes/api.js";
import { CreateChannel } from "./utils/index.js";

dotenv.config();

const StartServer = async () => {
  const app = express();
  
  // config bodyParser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  // config cookie -parser
  app.use(cookieParser());

  const channel = await CreateChannel();

  initApiRoutes(app, channel);
  await connectDB();
  
  app.listen(process.env.PORT || 8082, () => {
    console.log(`Shopping Service is running on port ${process.env.PORT || 8082}`);
  });
}

StartServer();
