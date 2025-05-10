import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import proxy from "express-http-proxy";

import { checkUserJWT } from "./middleware/JWTAction.js";
import configCors from "./config/config_cors.js";

const app = express();

// config cors
configCors(app);

// config bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// config cookie -parser
app.use(cookieParser());

const addUserToHeaders = (proxyReqOpts, srcReq) => {
  if (srcReq.user) {
    const userBase64 = Buffer.from(JSON.stringify(srcReq.user)).toString("base64");
    proxyReqOpts.headers["X-User"] = userBase64;
  }
  if (srcReq.token) {
    proxyReqOpts.headers["X-Token"] = srcReq.token;
  }
  return proxyReqOpts;
};

app.use(
  "/customer",
  checkUserJWT,
  proxy("http://customer-service:8081", {
    parseReqBody: false,
    proxyReqOptDecorator: addUserToHeaders,
  })
);
app.use(
  "/event",
  checkUserJWT,
  proxy("http://event-service:8083", {
    parseReqBody: false,
    proxyReqOptDecorator: addUserToHeaders,
  })
);
app.use(
  "/booking",
  checkUserJWT,
  proxy("http://booking-service:8082", {
    parseReqBody: false,
    proxyReqOptDecorator: addUserToHeaders,
  })
);
app.use(
  "/payment",
  checkUserJWT,
  proxy("http://payment-service:8084", {
    proxyReqOptDecorator: addUserToHeaders,
  })
);
app.use(
  "/notification",
  checkUserJWT,
  proxy("http://notification-service:8085", {
    proxyReqOptDecorator: addUserToHeaders,
  })
);

app.listen(8080, () => {
  console.log("Gateway is Listening to Port 8080");
});
