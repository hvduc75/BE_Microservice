import dotenv from "dotenv";
dotenv.config();
import { PaymentModel } from "../models";
import { CreateChannel, PublishMessage } from "../utils";

let channel;

const initializeChannel = async () => {
  channel = await CreateChannel();
};

initializeChannel();

const updatePayment = async (bookingId, status, transactionId) => {
  try {
    const existingPayment = await PaymentModel.findOne({ bookingId });

    if(status === "SUCCESS"){
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
  
        PublishMessage(channel, process.env.BOOKING_SERVICE, JSON.stringify(dataPayload));
  
        return { EC: 0, EM: "Payment updated successfully" };
      } else {
        return { EC: -1, EM: "Payment not found" };
      }
    }else{
      if (existingPayment) {
        existingPayment.status = status;
        await existingPayment.save();
  
        return { EC: 0, EM: "Payment updated successfully" };
      } else {
        return { EC: -1, EM: "Payment not found" };
      }
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

module.exports = { updatePayment };
