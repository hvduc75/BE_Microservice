import dotenv from "dotenv";
dotenv.config();
import { BookingModel } from "../models";
import { PublishBookingEvent, PublishMessage, CreateChannel } from "../utils";
// import axios from "../utils/customAxios";
import axios from "axios";

let channel;

const initializeChannel = async () => {
  channel = await CreateChannel();
};

initializeChannel();

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

const getBookingByEventId = async (userId, eventId) => {
  try {
    if (!eventId) {
      return {
        EM: "Must have eventId",
        EC: -1,
        DT: [],
      };
    }
    let bookings = await BookingModel.findOne({
      userId: userId,
      eventId: eventId,
      status: "PENDING",
    });
    return { EM: "Get booking successfully", EC: 0, DT: bookings };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something went wrong in service...",
      EC: -2,
      DT: [],
    };
  }
};

const getBookingByCondition = async (
  userId,
  condition,
  time,
  limit = 10,
  page = 1
) => {
  try {
    console.log("Condition:", condition);
    console.log("Time:", time);
    if (!condition) {
      return {
        EM: "Must have condition",
        EC: -1,
        DT: [],
      };
    }

    let statusCondition = {};
    if (condition !== "ALL") {
      const statusMap = {
        SUCCESS: "CONFIRMED",
        PENDING: "PENDING",
        CANCELED: "CANCELED",
      };
      if (!statusMap[condition]) {
        return {
          EM: "Invalid condition",
          EC: -1,
          DT: [],
        };
      }
      statusCondition.status = statusMap[condition];
    }

    // Step 1: Lấy tất cả bookings của user
    const allBookings = await BookingModel.find({
      userId,
      ...statusCondition,
    })
      .sort({ bookingTime: -1 })
      .select("_id bookingTime status eventId");

    console.log("All bookings:", allBookings);

    // Step 2: Lọc booking theo thời gian kết thúc của event
    const filteredBookings = await Promise.all(
      allBookings.map(async (booking) => {
        try {
          const res = await axios.get(
            `http://localhost:8080/event/getEventByExpired?eventId=${booking.eventId}&time=${time}`
          );
          const event = res.data?.DT;

          if (!event) return null;
          return { event, booking };
        } catch (err) {
          console.error("Error fetching event:", err);
          return null;
        }
      })
    );

    console.log("Filtered bookings:", filteredBookings);

    // Loại bỏ các null (tức là không phù hợp thời gian)
    const validBookings = filteredBookings.filter((b) => b !== null);

    // // Step 3: Phân trang
    const total = validBookings.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = validBookings.slice(start, end).map((item) => {
      return {
        booking: item.booking, // giữ nguyên toàn bộ object booking
        event: item.event, // và kèm theo cả event
      };
    });

    return {
      EM: "Get booking successfully",
      EC: 0,
      DT: {
        total,
        page,
        limit,
        bookings: paginated,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something went wrong in service...",
      EC: -2,
      DT: [],
    };
  }
};

const getAllBookingByEventId = async (userId, eventId) => {
  try {
    if (!eventId) {
      return {
        EM: "Must have eventId",
        EC: -1,
        DT: [],
      };
    }
    let bookings = await BookingModel.find({
      userId: userId,
      eventId: eventId,
    });
    return { EM: "Get all booking successfully", EC: 0, DT: bookings };
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

const deleteBooking = async (userId, bookingId) => {
  try {
    if (!bookingId) {
      return {
        EM: "Must have bookingId",
        EC: -1,
        DT: [],
      };
    }
    if (!userId) {
      return {
        EM: "Must have userId",
        EC: -1,
        DT: [],
      };
    }
    let booking = await BookingModel.findOneAndUpdate(
      { _id: bookingId, userId: userId },
      { status: "CANCELED" },
      { new: true }
    );

    let dataPayload = {
      event: "DELETE_BOOKING",
      data: {
        eventId: booking.eventId,
        tickets: booking.tickets,
      },
    };

    PublishMessage(
      channel,
      process.env.EVENT_SERVICE,
      JSON.stringify(dataPayload)
    );

    if (!booking) {
      return {
        EM: "Booking not found",
        EC: -1,
        DT: [],
      };
    }
    return { EM: "Delete booking successfully", EC: 0, DT: booking };
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
  getAllBookingByEventId,
  deleteBooking,
  getBookingByEventId,
  getBookingByCondition,
};
