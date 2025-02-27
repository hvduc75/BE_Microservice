import moment from "moment";

import { TicketModel } from "../models";

const formatDateString = (dateString) => {
  return moment(dateString, "DD/MM/YYYY").format("YYYY-MM-DD");
};

const AddTickets = async (data) => {
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
      !data.startTime ||
      !data.endTime ||
      !data.startDate ||
      !data.endDate
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
      startTime: formatDateString(data.startTime),
      endTime: formatDateString(data.endTime),
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
      EM: "Something wrongs is service...",
      EC: -2,
      DT: [],
    };
  }
};

module.exports = {
  AddTickets,
};
