import moment from "moment";

import { EventModel } from "../models";

const formatDateString = (dateString) => {
  return moment(dateString, "DD/MM/YYYY").format("YYYY-MM-DD");
};

const AddEvent = async (userId, data) => {
  try {
    console.log(userId);
    console.log(data);
    if (
      !userId ||
      !data.eventImage ||
      !data.eventName ||
      !data.locationType ||
      !data.location ||
      !data.eventType ||
      !data.eventDesc ||
      !data.organizerName ||
      !data.organizerDesc ||
      !data.startDate ||
      !data.endDate
    ) {
      return {
        EM: "Missing parameter...",
        EC: 1,
        DT: "",
      };
    }
    let newEvent = new EventModel({
      userId: userId,
      eventImage: data.eventImage,
      eventName: data.eventName,
      locationType: data.locationType,
      location: data.location,
      eventType: data.eventType,
      eventDesc: data.eventDesc,
      organizerName: data.organizerName,
      organizerDesc: data.organizerDesc,
      startDate: formatDateString(data.startDate),
      endDate: formatDateString(data.endDate),
    });
    let event = await newEvent.save();
    return {
      EM: "Add event successfully...",
      EC: 0,
      DT: event,
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
  AddEvent,
};
