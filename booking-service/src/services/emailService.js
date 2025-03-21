import { BookingModel } from "../models";
import axios from '../utils/customAxios';

const sendEmail = async (bookingId) => {
  try {
    if (!bookingId) {
      return {
        EM: "Must have bookingId",
        EC: -1,
        DT: [],
      };
    }
    let booking = await BookingModel.findOne({ _id: bookingId });
    if (!booking) {
      return {
        EM: "Booking not found",
        EC: -1,
        DT: [],
      };
    }else{}
    let receiverEmail =  booking.receiverEmail;
    let data = await axios.get(
      `http://localhost:8080/event/getEventById?eventId=${booking.eventId}`
    );
    console.log(data, receiverEmail);
  } catch (error) {
    console.log(error);
    return {
      EM: "Something went wrong in service...",
      EC: -2,
      DT: [],
    };
  }
};

module.exports = {
  sendEmail,
};
