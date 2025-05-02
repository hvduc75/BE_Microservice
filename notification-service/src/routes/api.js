import express from "express";
import extractUserFromHeader from "../middleware/extractUser";
import notificationController from "../controllers/notificationController";
import { SubscribeMessage } from "../utils";
import service from "../services/handleEventService";

const router = express.Router();
const extractUser = extractUserFromHeader;

const initApiRoutes = (app, channel) => {
  SubscribeMessage(channel, service);
  router.all("*", extractUser);

  router.get("/get-notifications", notificationController.getAllNotifications);

  return app.use("/", router);
};

export default initApiRoutes;
