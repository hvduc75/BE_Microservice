import moment from "moment";
import { EventModel } from "../models";

const formatDateString = (dateString) => {
  return moment(dateString).format("YYYY-MM-DD HH:mm:ss");
};

const getEventById = async (eventId) => {
  try {
    if (!eventId) {
      return { EM: "Must have eventId", EC: 1, DT: "" };
    }

    let event = await EventModel.findOne({ _id: eventId }).populate("tickets");

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

const getEventByCondition = async (data) => {
  try {
    const { condition, limit = 5, page = 1 } = data;
    if (condition === undefined) {
      return { EM: "Must have condition", EC: 1, DT: "" };
    }

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 5;
    const skip = (pageNumber - 1) * limitNumber;

    const events = await EventModel.find({ checkAddEvent: condition })
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    return { EM: "Get event successfully", EC: 0, DT: events };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something went wrong in service...",
      EC: -2,
      DT: [],
    };
  }
};

const searchEvent = async (data) => {
  try {
    const { category, limit = 20, page = 1 } = data;
    
    if (!category) {
      return { EM: "Must have category", EC: 1, DT: "" };
    }

    const pageNumber = parseInt(page, 10) || 1;
    const categoryData = String(category); // Chuyển category thành string để regex
    const limitNumber = parseInt(limit, 10) || 20;
    const skip = (pageNumber - 1) * limitNumber;

    // Lấy danh sách sự kiện có kèm danh sách vé
    const events = await EventModel.find({
      eventType: { $regex: categoryData, $options: "i" },
    })
      .populate("tickets")  // Lấy luôn danh sách vé của mỗi event
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    return { EM: "Get event successfully", EC: 0, DT: events };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something went wrong in service...",
      EC: -2,
      DT: [],
    };
  }
};

const AddEvent = async (userId, data) => {
  try {
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
      checkAddEvent: data.checkAddEvent || 0,
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

const editEvent = async (data) => {
  try {
    if (
      !data.eventId ||
      !data.eventName ||
      !data.locationType ||
      !data.locationName ||
      !data.eventType ||
      !data.eventDescription ||
      !data.organizerName ||
      !data.organizerDesc ||
      !data.address
    ) {
      return { EM: "Missing parameter", EC: 1, DT: "" };
    }

    let currentEvent = await EventModel.findById(data.eventId);
    if (!currentEvent) {
      return { EM: "Event not found", EC: 1, DT: "" };
    }

    let updateData = {
      eventName: data.eventName,
      locationType: data.locationType,
      locationName: data.locationName,
      address: data.address,
      eventType: data.eventType,
      eventDescription: data.eventDescription,
      organizerName: data.organizerName,
      organizerDesc: data.organizerDesc,
      eventLogo: data.eventLogo ? data.eventLogo : currentEvent.eventLogo,
      backgroundEvent: data.backgroundEvent
        ? data.backgroundEvent
        : currentEvent.backgroundEvent,
      organizerLogo: data.organizerLogo
        ? data.organizerLogo
        : currentEvent.organizerLogo,
    };

    let eventUpdate = await EventModel.findByIdAndUpdate(
      data.eventId,
      updateData,
      { new: true }
    );

    return { EM: "Edit event successfully", EC: 0, DT: eventUpdate };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something went wrong in service...",
      EC: -2,
      DT: [],
    };
  }
};

const updateEventDate = async (data) => {
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
};

const updateContentEmail = async (data) => {
  if (!data.eventId || !data.contentEmail) {
    return { EM: "Missing parameter", EC: 1, DT: "" };
  }
  try {
    let event = await EventModel.findOne({ _id: data.eventId });
    if (!event) {
      return { EM: "Event not found", EC: 1, DT: "" };
    }
    event.contentEmail = data.contentEmail;
    await event.save();
    return { EM: "Update content email successfully", EC: 0, DT: event };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrongs is service...",
      EC: -2,
      DT: [],
    };
  }
};

const updateBankAccount = async (data) => {
  if(!data.eventId || !data.accountName || !data.accountNumber || !data.bankName || !data.branch) {
    return { EM: "Missing parameter", EC: 1, DT: "" };
  }
  try {
    let event = await EventModel.findOne({ _id: data.eventId });
    if (!event) {
      return { EM: "Event not found", EC: 1, DT: "" };
    }
    event.accountName = data.accountName;
    event.accountNumber = data.accountNumber;
    event.bankName = data.bankName;
    event.branch = data.branch;

    await event.save();
    event.checkAddEvent = 1;
    await event.save();

    return { EM: "Update bank account successfully", EC: 0, DT: event };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrongs is service...",
      EC: -2,
      DT: [],
    };
  }
}

const confirmEvent = async (data) => {
  if (!data.eventId) {
    return { EM: "Must have eventId", EC: 1, DT: "" };
  }
  try {
    let event = await EventModel.findOne({ _id: data.eventId });
    if (!event) {
      return { EM: "Event not found", EC: 1, DT: "" };
    }
    event.checkAddEvent = 2;
    await event.save();
    return { EM: "Confirm Event successfully", EC: 0, DT: event };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrongs is service...",
      EC: -2,
      DT: [],
    };
  }
};

export default {
  AddEvent,
  getEventById,
  updateEventDate,
  getEventByCondition,
  editEvent,
  updateContentEmail,
  updateBankAccount,
  confirmEvent,
  searchEvent
};
