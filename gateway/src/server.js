import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import proxy from "express-http-proxy";

import { checkUserJWT } from "./middleware/JWTAction.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true
}));

// config bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// config cookie -parser
app.use(cookieParser());

const addUserToHeaders = (proxyReqOpts, srcReq) => {
  if (srcReq.user) {
    proxyReqOpts.headers["X-User"] = JSON.stringify(srcReq.user); 
  }
  return proxyReqOpts;
};

app.use("/customer", checkUserJWT, proxy("http://localhost:8081", { proxyReqOptDecorator: addUserToHeaders }));
app.use("/event", checkUserJWT, proxy("http://localhost:8083", { proxyReqOptDecorator: addUserToHeaders }));
app.use("/product", checkUserJWT, proxy("http://localhost:8082", { proxyReqOptDecorator: addUserToHeaders }));

app.listen(8080, () => {
  console.log("Gateway is Listening to Port 8080");
});
