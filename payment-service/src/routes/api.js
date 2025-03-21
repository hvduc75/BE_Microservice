import express from "express";

import paymentController from "../controllers/paymentController";
import extractUserFromHeader from "../middleware/extractUser";

const router = express.Router();
const extractUser = extractUserFromHeader;

const initApiRoutes = (app) => {
  router.all("*", extractUser);

  // payment routes
  router.post("/vnpay", paymentController.checkout);
  router.get("/vnpay_return", paymentController.vnpReturn);
  router.post("/vnpay/refund", paymentController.refund);

  return app.use("/", router);
};

export default initApiRoutes;
