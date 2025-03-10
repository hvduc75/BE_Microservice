import moment from "moment";
import { EventModel } from "../models";

const formatDateString = (dateString) => {
  return moment(dateString).format("YYYY-MM-DD HH:mm:ss");
};

const AddEvent = async (userId, data) => {
  try {
    console.log(data);
    if (
      !userId ||
      !data.eventName ||
      !data.locationType ||
      !data.locationName ||
      !data.eventType ||
      !data.eventDescription ||
      !data.organizerName ||
      !data.organizerDesc ||
      !data.eventLogo ||
      !data.backgroundEvent ||
      !data.address ||
      !data.organizerLogo
    ) {
      return { EM: "Missing parameter", EC: 1, DT: "" };
    }

    let newEvent = new EventModel({
      userId: userId,
      eventLogo: data.eventLogo,
      backgroundEvent: data.backgroundEvent,
      organizerLogo: data.organizerLogo,
      eventName: data.eventName,
      locationType: data.locationType,
      locationName: data.locationName,
      address: data.address,
      eventType: data.eventType,
      eventDescription: data.eventDescription,
      organizerName: data.organizerName,
      organizerDesc: data.organizerDesc,
      checkAddEvent: data.checkAddEvent || false,
    });

    let event = await newEvent.save();
    return { EM: "Add event successfully", EC: 0, DT: event };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrongs is service...",
      EC: -2,
      DT: [],
    };
  }
};

const getEventById = async (eventId) => {
  try {
    if (!eventId) {
      return { EM: "Must have eventId", EC: 1, DT: "" };
    }

    let event = await EventModel.findOne({ _id: eventId });

    return { EM: "Get event successfully", EC: 0, DT: event };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrongs is service...",
      EC: -2,
      DT: [],
    };
  }
};

const updateEventDate = async (data) => {
  console.log(data);
  const { eventId, startDate, endDate } = data;
  try {
    if (!eventId || !startDate || !endDate) {
      return { EM: "Missing parameter", EC: 1, DT: "" };
    }

    let event = await EventModel.findOne({ _id: eventId });
    event.startDate = formatDateString(startDate);
    event.endDate = formatDateString(endDate);

    await event.save();

    return { EM: "Update event date successfully", EC: 0, DT: event };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrongs is service...",
      EC: -2,
      DT: [],
    };
  }
}

export default { AddEvent, getEventById, updateEventDate };
