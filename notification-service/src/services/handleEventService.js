import { createNotification } from "./notificationService";

const handleEvent = async (payload) => {
  console.log("Triggering.... Events From Booking Service");

  const { event, data } = payload;
  console.log(payload);

  const { eventId, tickets } = data;

  console.log("data: ", data);

  switch (event) {
    case "NOTIFICATION":
      let res = await createNotification(data);
      console.log(res);
      return res;
    default:
      break;
  }
};

module.exports = {
  handleEvent,
};
