import express from "express";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";

import connectDB from "./config/connectDB.js";
import initApiRoutes from "./routes/api.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8888;

// config bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// config cookie -parser
app.use(cookieParser());

// test connection db
connectDB();

// config router
initApiRoutes(app);

app.listen(PORT, () => {
  console.log('Server is running on PORT: ' + PORT);
});