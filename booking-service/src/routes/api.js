import express from "express";

import bookingController from "../controllers/bookingController";
import extractUserFromHeader from "../middleware/extractUser";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();
const extractUser = extractUserFromHeader;

const initApiRoutes = (app) => {
  router.all("*", extractUser);

  router.post("/create-booking", upload.none(), bookingController.createBooking);
  

  return app.use("/", router);
};

export default initApiRoutes;
