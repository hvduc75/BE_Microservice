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
    console.log("test", tickets);
    let ticketUpdates = [];

    for (const ticket of tickets) {
      const existingTicket = await TicketModel.findOne({
        _id: ticket.ticketId,
      })
      // .session(session);
      if (!existingTicket || existingTicket.ticketAmount < ticket.quantity) {
        // await session.abortTransaction();
        console.log(error);
        return {
          EM: `${ticket.ticketName} chỉ còn lại ${ticket.ticketAmount} vé!`,
          EC: -1,
          DT: [],
        };
      }

      ticketUpdates.push({
        updateOne: {
          filter: { _id: ticket.ticketId },
          update: { $inc: { ticketAmount: -ticket.quantity } },
        },
      });
    }

    await TicketModel.bulkWrite(ticketUpdates);

    // await session.commitTransaction();
    // session.endSession();

    return {
      EM: "Check tickets successfully...",
      EC: 0,
      DT: [],
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
        ticketImage: data.ticketImage,
        eventTicketSaleStartTime: formatDateString(
          data.eventTicketSaleStartTime
        ),
        eventTicketSaleEndTime: formatDateString(data.eventTicketSaleEndTime),
      },
      { new: true }
    );

    if (!updatedTicket) {
      return {
        EM: "Ticket not found...",
        EC: 1,
        DT: [],
      };
    }

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

module.exports = {
  AddTicket,
  getTicketByEventId,
  updateTicket,
  checkAndUpdateTickets,
};
