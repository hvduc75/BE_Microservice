import moment from "moment";
import mongoose from "mongoose";
import { TicketModel } from "../models";

const formatDateString = (dateString) => {
  return moment(dateString).format("YYYY-MM-DD HH:mm:ss");
};

const getTicketByEventId = async (eventId) => {
  try {
    let tickets = await TicketModel.find({ eventId: eventId });

    if (!tickets || tickets.length === 0) {
      return {
        EM: "No tickets found for this event...",
        EC: 1,
        DT: [],
      };
    }

    return {
      EM: "Get tickets successfully...",
      EC: 0,
      DT: tickets,
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

const AddTicket = async (data) => {
  try {
    if (
      !data.eventId ||
      !data.ticketName ||
      !data.ticketPrice ||
      !data.ticketAmount ||
      !data.ticketMin ||
      !data.ticketMax ||
      !data.ticketDesc ||
      !data.ticketImage ||
      !data.eventTicketSaleStartTime ||
      !data.eventTicketSaleEndTime
    ) {
      return {
        EM: "Missing parameter...",
        EC: 1,
        DT: "",
      };
    }

    let newTicket = new TicketModel({
      eventId: data.eventId,
      ticketName: data.ticketName,
      ticketPrice: data.ticketPrice,
      ticketAmount: data.ticketAmount,
      ticketMin: data.ticketMin,
      ticketMax: data.ticketMax,
      ticketDesc: data.ticketDesc,
      ticketImage: data.ticketImage,
      eventTicketSaleStartTime: formatDateString(data.eventTicketSaleStartTime),
      eventTicketSaleEndTime: formatDateString(data.eventTicketSaleEndTime),
    });

    let tickets = await newTicket.save();
    return {
      EM: "Add tickets successfully...",
      EC: 0,
      DT: tickets,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrong in service...",
      EC: -2,
      DT: [],
    };
  }
};

const checkAndUpdateTickets = async (data) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();

  try {
    const { tickets } = data;

    const ticketIds = tickets.map((ticket) => ticket.ticketId);
    const existingTickets = await TicketModel.find({ _id: { $in: ticketIds } }); //.session(session);

    if (existingTickets.length !== tickets.length) {
      // await session.abortTransaction();
      return {
        EM: "Có vé không tồn tại...",
        EC: -1,
        DT: [],
      };
    }

    let ticketUpdates = [];

    for (const ticket of tickets) {
      const existingTicket = existingTickets.find(
        (t) => t._id.toString() === ticket.ticketId
      );

      if (!existingTicket || existingTicket.ticketAmount < ticket.quantity) {
        // await session.abortTransaction();
        return {
          EM: `${ticket.ticketName} chỉ còn lại ${
            existingTicket ? existingTicket.ticketAmount : 0
          } vé!`,
          EC: -1,
          DT: [],
        };
      }

      ticketUpdates.push({
        updateOne: {
          filter: { _id: ticket.ticketId },
          update: {
            $inc: {
              ticketAmount: -ticket.quantity,
              soldQuantity: ticket.quantity,
            },
          },
        },
      });
    }

    // Cập nhật số lượng vé
    await TicketModel.bulkWrite(ticketUpdates); //.session(session);

    // await session.commitTransaction();
    // session.endSession();

    return {
      EM: "Cập nhật vé thành công...",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log("Lỗi khi cập nhật vé:", error);
    // await session.abortTransaction();
    // session.endSession();
    return {
      EM: "Có lỗi xảy ra khi cập nhật vé...",
      EC: -2,
      DT: [],
    };
  }
};

const updateTicket = async (data) => {
  try {
    if (
      !data.ticketId ||
      !data.eventId ||
      !data.ticketName ||
      !data.ticketPrice ||
      !data.ticketAmount ||
      !data.ticketMin ||
      !data.ticketMax ||
      !data.ticketDesc ||
      !data.eventTicketSaleStartTime ||
      !data.eventTicketSaleEndTime
    ) {
      return {
        EM: "Missing parameter...",
        EC: 1,
        DT: "",
      };
    }

    let existingTicket = await TicketModel.findById(data.ticketId);
    if (!existingTicket) {
      return {
        EM: "Ticket not found...",
        EC: 1,
        DT: [],
      };
    }

    let updatedTicket = await TicketModel.findByIdAndUpdate(
      data.ticketId,
      {
        eventId: data.eventId,
        ticketName: data.ticketName,
        ticketPrice: data.ticketPrice,
        ticketAmount: data.ticketAmount,
        ticketMin: data.ticketMin,
        ticketMax: data.ticketMax,
        ticketDesc: data.ticketDesc,
        ticketImage: data.ticketImage
          ? data.ticketImage
          : existingTicket.ticketImage,
        eventTicketSaleStartTime: formatDateString(
          data.eventTicketSaleStartTime
        ),
        eventTicketSaleEndTime: formatDateString(data.eventTicketSaleEndTime),
      },
      { new: true }
    );

    return {
      EM: "Update ticket successfully...",
      EC: 0,
      DT: updatedTicket,
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

const updateTicketsByEvent = async (eventId, tickets) => {
  try {
    if (!eventId || !Array.isArray(tickets)) {
      return {
        EM: "Missing parameter or invalid ticket data...",
        EC: 1,
        DT: "",
      };
    }

    // Duyệt từng vé trong danh sách và cập nhật lại số lượng
    for (let ticket of tickets) {
      await TicketModel.updateOne(
        { _id: ticket.ticketId, eventId: eventId },
        {
          $inc: {
            ticketAmount: ticket.quantity, // Tăng số lượng vé còn lại
            soldQuantity: -ticket.quantity,  // Giảm số lượng vé đã bán
          },
        }
      );
    }

    return {
      EM: "Update tickets successfully...",
      EC: 0,
      DT: tickets,
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

module.exports = {
  AddTicket,
  getTicketByEventId,
  updateTicket,
  checkAndUpdateTickets,
  updateTicketsByEvent,
};
