import express from "express";
import eventController from "../controllers/eventController";
import ticketController from "../controllers/ticketController";
// import orderController from "../controllers/orderController";
// import { SubscribeMessage } from "../utils";
// import service from "../services/eventService";

const router = express.Router();

const extractUserFromHeader = (req, res, next) => {
  if (req.headers["x-user"]) {
    req.user = JSON.parse(req.headers["x-user"]); // Chuyển từ chuỗi JSON về object
  }
  next();
};

const initApiRoutes = (app) => {
  // SubscribeMessage(channel, service);

  router.all("*", extractUserFromHeader);
  router.post("/add-event", eventController.AddEvent);
  router.post("/add-tickets", ticketController.AddTickets);
  // router.post("/order", orderController.createOrder);

  return app.use("/", router);
};

export default initApiRoutes;
