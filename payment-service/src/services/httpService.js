import { checkAndUpdateTickets } from "./ticketService";

const bookingHttpCall = async (payload) => {
  console.log("Events From Booking Service");

  const { event, data } = payload;

  const  tickets  = JSON.parse(data);
  if (event === "CREATE_BOOKING") {
    let res = await checkAndUpdateTickets({ tickets });
    return res;
  }
};

module.exports = {
  bookingHttpCall,
};
