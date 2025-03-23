import { updateTicketsByEvent } from "./ticketService";

const handleEvent = async (payload) => {
  console.log("Triggering.... Events From Booking Service");

  const { event, data } = payload;
  console.log(payload);

  const { eventId, tickets } = data;

  switch (event) {
    case "DELETE_BOOKING":
      let data = await updateTicketsByEvent(eventId, tickets);
      console.log(data);
      return data;
    default:
      break;
  }
};

module.exports = {
  handleEvent,
};
