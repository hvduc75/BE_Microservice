import { PaymentModel } from "../models";
import { CreateChannel, PublishMessage } from "../utils";

let channel;

const initializeChannel = async () => {
  channel = await CreateChannel();
};

initializeChannel();

const BOOKING_SERVICE = "booking_service";

const updatePayment = async (bookingId, status, transactionId) => {
  try {
    const existingPayment = await PaymentModel.findOne({ bookingId });

    if (existingPayment) {
      if (existingPayment.transactionId) {
        return { EC: 1, EM: "Transaction already recorded" };
      }

      existingPayment.status = status;
      existingPayment.transactionId = transactionId;
      await existingPayment.save();

      let dataPayload = {
        event: "SEND_EMAIL",
        data: {
          bookingId,
        },
      };

      PublishMessage(channel, BOOKING_SERVICE, JSON.stringify(dataPayload));

      return { EC: 0, EM: "Payment updated successfully" };
    } else {
      return { EC: -1, EM: "Payment not found" };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Something went wrong in service...",
      EC: -2,
      DT: [],
    };
  }
};

const updatePaymentStatus = async (orderId, status) => {
  try {
    await Payment.updateOne({ bookingId: orderId }, { status });
    return { EC: 0, EM: "Payment updated successfully" };
  } catch (error) {
    console.error(error);
    return { EC: 2, EM: "Update failed" };
  }
};

module.exports = { updatePayment, updatePaymentStatus };
