import express from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import connectDB from "./config/ConnectDB.js";
import initApiRoutes from "./routes/api.js";

dotenv.config();

const StartServer = async () => {
  const app = express();
  
  // config bodyParser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  // config cookie -parser
  app.use(cookieParser());

  initApiRoutes(app);
  await connectDB();
  
  app.listen(process.env.PORT || 8084, () => {
    console.log(`Payment Service is running on port ${process.env.PORT || 8084}`);
  });
}

StartServer();
