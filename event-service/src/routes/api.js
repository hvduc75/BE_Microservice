import express from "express";
import eventController from "../controllers/eventController";
import ticketController from "../controllers/ticketController";
import httpController from "../controllers/httpController";
import extractUserFromHeader from "../middleware/extractUser";
import { SubscribeMessage } from "../utils";
import service from "../services/handleEventService";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();
const extractUser = extractUserFromHeader;

const initApiRoutes = (app, channel) => {
  SubscribeMessage(channel, service);
  router.all("*", extractUser);

  router.post(
    "/booking-httpcall",
    upload.none(),
    httpController.bookingHttpCall
  );

  router.get("/getEventById", eventController.getEventById);
  router.get("/getEventByCondition", eventController.getEventByCondition);
  router.get("/searchEvent", eventController.searchEvent);
  router.get("/getEventByTime", eventController.getEventByTime);
  router.get("/getEventByScore", eventController.getEventByScore);
  router.post(
    "/add-event",
    upload.fields([
      { name: "eventLogo", maxCount: 1 },
      { name: "backgroundEvent", maxCount: 1 },
      { name: "organizerLogo", maxCount: 1 },
    ]),
    eventController.AddEvent
  );
  router.put(
    "/edit-event",
    upload.fields([
      { name: "eventLogo", maxCount: 1 },
      { name: "backgroundEvent", maxCount: 1 },
      { name: "organizerLogo", maxCount: 1 },
    ]),
    eventController.editEvent
  );
  router.put(
    "/updateEventDate",
    upload.none(),
    eventController.updateEventDate
  );
  router.put(
    "/updateContentEmail",
    upload.none(),
    eventController.updateContentEmail
  );
  router.put(
    "/updateBankAccount",
    upload.none(),
    eventController.updateBankAccount
  );
  router.put("/confirmEvent", upload.none(), eventController.confirmEvent);
  router.put("/updateScore", upload.none(), eventController.updateScore);

  router.get("/getTicketByEventId", ticketController.getTicketByEventId);
  router.post(
    "/add-ticket",
    upload.single("ticketImage"),
    ticketController.AddTicket
  );
  router.post(
    "/check-and-update-tickets",
    upload.none(),
    ticketController.checkAndUpdateTickets
  );
  router.put(
    "/update-ticket",
    upload.single("ticketImage"),
    ticketController.updateTicket
  );

  return app.use("/", router);
};

export default initApiRoutes;
