import express from "express";

import eventController from "../controllers/eventController";
import ticketController from "../controllers/ticketController";
import extractUserFromHeader from "../middleware/extractUser";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();
const extractUser = extractUserFromHeader;

const initApiRoutes = (app) => {
  router.all("*", extractUser);

  router.get("/getEventById", eventController.getEventById);
  router.post(
    "/add-event",
    upload.fields([
      { name: "eventLogo", maxCount: 1 },
      { name: "backgroundEvent", maxCount: 1 },
      { name: "organizerLogo", maxCount: 1 },
    ]),
    eventController.AddEvent
  );
  router.put("/updateEventDate", upload.none(), eventController.updateEventDate);

  router.get("/getTicketByEventId", ticketController.getTicketByEventId);
  router.post(
    "/add-ticket",
    upload.single("ticketImage"),
    ticketController.AddTicket
  );
  router.put(
    "/update-ticket",
    upload.single("ticketImage"),
    ticketController.updateTicket
  );

  return app.use("/", router);
};

export default initApiRoutes;
