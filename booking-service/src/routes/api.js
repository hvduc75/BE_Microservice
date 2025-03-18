import express from "express";

import bookingController from "../controllers/bookingController";
import extractUserFromHeader from "../middleware/extractUser";

const router = express.Router();
const extractUser = extractUserFromHeader;

const initApiRoutes = (app) => {
  router.all("*", extractUser);

  router.post("/booking", bookingController.createBooking);
  

  return app.use("/", router);
};

export default initApiRoutes;
