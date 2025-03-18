import { BookingModel } from "../models";
import { PublishBookingEvent } from "../utils";

const createBooking = async (userId, data) => {
  try {
    let tickets = data?.tickets;
    if (typeof tickets === "string") {
      tickets = JSON.parse(tickets);
    }
    let res = await PublishBookingEvent({ event: "CREATE_BOOKING", data: tickets });

    if(res.EC === 0){
      let newBooking = new BookingModel({
        userId: userId,
        eventId: data.eventId,
        tickets: tickets,
        bookingTime: new Date(),
        totalAmount: data.totalAmount,
        status: "PENDING",
      });
      await newBooking.save();
      return { EM: "Create booking successfully", EC: 0, DT: [] };
    }else{
      return res;
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

module.exports = {
  createBooking,
};
