import express from "express";
import bookingController from "../controllers/bookingController";
import extractUserFromHeader from "../middleware/extractUser";
import { SubscribeMessage } from "../utils";
import service from "../services/handleEventService"
import upload from "../middleware/uploadMiddleware";

const router = express.Router();
const extractUser = extractUserFromHeader;

const initApiRoutes = (app, channel) => {
  SubscribeMessage(channel, service);
  router.all("*", extractUser);

  router.get("/getBookingById", bookingController.getBookingById);
  router.post("/create-booking", upload.none(), bookingController.createBooking);
  router.put("/update-receiverInfo", upload.none(), bookingController.updateReceiverInfo);

  return app.use("/", router);
};

export default initApiRoutes;
