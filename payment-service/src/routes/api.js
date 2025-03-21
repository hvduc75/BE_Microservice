import express from "express";

import vnpayController from "../controllers/vnpayController";
import paymenController from "../controllers/paymentController";
import extractUserFromHeader from "../middleware/extractUser";

const router = express.Router();
const extractUser = extractUserFromHeader;

const initApiRoutes = (app) => {
  router.all("*", extractUser);

  // vnapy routes
  router.post("/vnpay", vnpayController.checkout);
  router.get("/vnpay_return", vnpayController.vnpReturn);
  router.post("/vnpay/refund", vnpayController.refund);

  // payment router
  router.post("/update-payment", paymenController.updatePayment);

  return app.use("/", router);
};

export default initApiRoutes;
