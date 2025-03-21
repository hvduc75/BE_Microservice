import { BookingModel } from "../models";
import { PublishBookingEvent } from "../utils";

const getBookingById = async (userId, bookingId) => {
  try {
    if (!bookingId) {
      return {
        EM: "BookingId is required",
        EC: -1,
        DT: [],
      };
    }
    let booking = await BookingModel.findOne({
      _id: bookingId,
      userId: userId,
    });
    if (!booking) {
      return {
        EM: "Booking not found",
        EC: -1,
        DT: [],
      };
    }
    return { EM: "Get booking successfully", EC: 0, DT: booking };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something went wrong in service...",
      EC: -2,
      DT: [],
    };
  }
};

const createBooking = async (userId, data) => {
  try {
    let tickets = data?.tickets;
    if (typeof tickets === "string") {
      tickets = JSON.parse(tickets);
    }
    let res = await PublishBookingEvent({
      event: "CREATE_BOOKING",
      data: tickets,
    });

    if (res.EC === 0) {
      let newBooking = new BookingModel({
        userId: userId,
        eventId: data.eventId,
        tickets: tickets,
        bookingTime: new Date(),
        totalAmount: data.totalAmount,
        status: "PENDING",
      });
      await newBooking.save();
      return { EM: "Create booking successfully", EC: 0, DT: newBooking };
    } else {
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

const updateReceiverInfo = async (userId, data) => {
  const { bookingId, receiverEmail, receiverPhone, receiverName } = data;
  try {
    if (!userId || !bookingId || !receiverEmail) {
      return {
        EM: "Missing required fields",
        EC: -1,
        DT: [],
      };
    }
    let booking = await BookingModel.findOne({
      _id: bookingId,
      userId: userId,
    });
    if (!booking) {
      return {
        EM: "Booking not found",
        EC: -1,
        DT: [],
      };
    }
    booking.receiverEmail = receiverEmail;
    booking.receiverPhone = receiverPhone;
    booking.receiverName = receiverName;
    await booking.save();
    return { EM: "Update receiver email successfully", EC: 0, DT: booking };
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
  getBookingById,
  updateReceiverInfo,
};
