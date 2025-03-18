import { BookingModel } from "../models";

const createBooking = async (data) => {
  try {
    let booking = new BookingModel(data);
    await booking.save();

    return { EM: "Create booking successfully", EC: 0, DT: booking };
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
