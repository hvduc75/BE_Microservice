import { sendEmail } from "./emailService";

const handleEvent = async (payload) => {
  console.log("Triggering.... Events From Payment Service");

  const { event, data } = payload;
  console.log(payload);

  const { bookingId } = data;

  switch (event) {
    case "SEND_EMAIL":
      let data = await sendEmail(bookingId);
      console.log(data);
      return data;
    default:
      break;
  }
};

module.exports = {
  handleEvent,
};
