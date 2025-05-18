import moment from "moment";
import { EventModel, EventAssignmentModel } from "../models";
import { sendEventApprovalNotification } from "./eventAssignmentService";

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

const getEventByCondition = async (role, userId, data) => {
  try {
    const { condition, limit = 5, page = 1 } = data;

    if (condition === undefined) {
      return { EM: "Must have condition", EC: 1, DT: "" };
    }

    if (role === "User" && !userId) {
      return { EM: "Must have userId", EC: 1, DT: "" };
    }

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 5;
    const skip = (pageNumber - 1) * limitNumber;

    let query = { checkAddEvent: condition };
    if (role === "User") {
      query.userId = userId;
    }

    const totalEvents = await EventModel.countDocuments(query);
    const totalPages = Math.ceil(totalEvents / limitNumber);

    const events = await EventModel.find(query)
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    return { EM: "Get event successfully", EC: 0, DT: { events, totalPages } };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something went wrong in service...",
      EC: -2,
      DT: [],
    };
  }
};

const getEventByAdmin = async (adminId, data) => {
  try {
    const { limit = 5, page = 1 } = data;

    if (!adminId) {
      return { EM: "Must have adminId", EC: 1, DT: "" };
    }

    // Bước 1: Lấy danh sách eventId được phân công cho admin
    const assignments = await EventAssignmentModel.find({ adminId });
    const eventIds = assignments.map(item => item.eventId);

    // Bước 2: Đếm tổng số sự kiện có checkAddEvent = 1
    const total = await EventModel.countDocuments({
      _id: { $in: eventIds },
      checkAddEvent: 1
    });

    // Bước 3: Lấy danh sách sự kiện phân trang + điều kiện
    const events = await EventModel.find({
      _id: { $in: eventIds },
      checkAddEvent: 1
    })
      .populate("tickets")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      EM: "Get events successfully",
      EC: 0,
      DT: {
        totalPages: Math.ceil(total / limit),
        events,
      },
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

const getSpecialEvent = async () => {
  try {
    const specialEvents = await EventModel.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "_id",
          foreignField: "eventId",
          as: "tickets",
        },
      },
      {
        $addFields: {
          totalTickets: { $sum: "$tickets.ticketAmount" },
        },
      },
      {
        $match: {
          totalTickets: { $gt: 100 },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    console.log("specialEvents", specialEvents);  

    return {
      EM: "Get special events successfully",
      EC: 0,
      DT: specialEvents,
    };
  } catch (error) {
    console.error("Error in getSpecialEvent:", error);
    return {
      EM: "Something went wrong in service...",
      EC: -2,
      DT: [],
    };
  }
};

const searchEvent = async (data) => {
  try {
    const { category, q, page = 1, limit = 20, date, location, isFree } = data;
    const sanitizeParam = (param) => (param === "null" ? null : param);

    const sanitizedCategory = sanitizeParam(category);
    const sanitizedQ = sanitizeParam(q);
    const sanitizedDate = sanitizeParam(date);
    const sanitizedLocation = sanitizeParam(location);
    const sanitizedIsFree = sanitizeParam(isFree);

    console.log("search params", {
      category: sanitizedCategory,
      q: sanitizedQ,
      page,
      limit,
      date: sanitizedDate,
      location: sanitizedLocation,
      isFree: sanitizedIsFree,
    });

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 20;
    const skip = (pageNumber - 1) * limitNumber;

    const queryConditions = {
      checkAddEvent: 2,
    };

    if (
      sanitizedCategory !== "undefined" &&
      sanitizedCategory !== null &&
      sanitizedCategory !== ""
    ) {
      queryConditions.eventType = {
        $regex: String(sanitizedCategory),
        $options: "i",
      };
    }

    if (sanitizedQ) {
      queryConditions.$or = [
        { eventName: { $regex: sanitizedQ, $options: "i" } },
        { eventDescription: { $regex: sanitizedQ, $options: "i" } },
      ];
    }

    if (sanitizedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const friday = new Date(today);
      friday.setDate(today.getDate() + (5 - dayOfWeek)); // 5 = Friday

      const sunday = new Date(today);
      sunday.setDate(today.getDate() + (7 - dayOfWeek)); // 0 = Sunday next (hoặc 0 nếu hôm nay chủ nhật)
      sunday.setHours(23, 59, 59, 999);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const endOfTomorrow = new Date(tomorrow);
      endOfTomorrow.setHours(23, 59, 59, 999);

      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);

      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);

      switch (date) {
        case "today":
          queryConditions.startDate = { $gte: today, $lte: endOfToday };
          break;
        case "tomorrow":
          queryConditions.startDate = { $gte: tomorrow, $lte: endOfTomorrow };
          break;
        case "this_week":
          if (dayOfWeek >= 5) {
            // Friday (5), Saturday (6), Sunday (0)
            queryConditions.startDate = { $gte: today, $lte: sunday };
          } else {
            // Nếu trước thứ 6, không tìm gì cả
            queryConditions.startDate = { $gte: friday, $lte: sunday };
          }
          break;
        case "this_month":
          queryConditions.startDate = { $gte: today, $lte: endOfMonth };
          break;
        default:
          break;
      }
    }

    // Filter by location
    if (sanitizedLocation) {
      let locationName = "";
      if (sanitizedLocation === "hcm") {
        locationName = "Hồ Chí Minh";
      } else if (sanitizedLocation === "hn") {
        locationName = "Hà Nội";
      } else if (sanitizedLocation === "dl") {
        locationName = "Đà Lạt";
      }
      queryConditions.address = { $regex: locationName, $options: "i" };
    }

    // Filter by isFree
    if (sanitizedIsFree === "true") {
      queryConditions["tickets.price"] = 0;
    } else if (sanitizedIsFree === false) {
      queryConditions["tickets.price"] = { $gt: 0 };
    }

    console.log("queryConditions", queryConditions);

    const totalEvents = await EventModel.countDocuments(queryConditions);
    const totalPages = Math.ceil(totalEvents / limitNumber);

    const events = await EventModel.find(queryConditions)
      .populate("tickets")
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    return { EM: "Get event successfully", EC: 0, DT: { events, totalPages } };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something went wrong in service...",
      EC: -2,
      DT: [],
    };
  }
};

const getEventByTime = async (data) => {
  try {
    console.log("data", data);
    const { date, limit = 20, page = 1 } = data;

    if (!date) {
      return { EM: "Must have date in query", EC: 1, DT: "" };
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    let dateFilter = {};

    if (date === "this_week") {
      // Lấy Thứ 6, Thứ 7, Chủ Nhật của tuần hiện tại
      let weekends = [];
      let tempDate = new Date(today);
      let dayOfWeek = tempDate.getDay(); // 0 (CN) -> 6 (T7)

      // Xác định ngày bắt đầu của tuần (Thứ 2)
      tempDate.setDate(
        tempDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
      );

      // Di chuyển đến Thứ 6
      tempDate.setDate(tempDate.getDate() + 4);
      for (let i = 0; i < 3; i++) {
        let startOfDay = new Date(tempDate.setHours(0, 0, 0, 0));
        let endOfDay = new Date(tempDate.setHours(23, 59, 59, 999));
        weekends.push({ start: startOfDay, end: endOfDay });

        tempDate.setDate(tempDate.getDate() + 1);
      }

      dateFilter = {
        $or: weekends.map(({ start, end }) => ({
          startDate: { $gte: start, $lt: end },
        })),
      };
    }

    if (date === "this_month") {
      // Lấy từ ngày 21 đến hết tháng
      let startOf21st = new Date(currentYear, currentMonth, 21, 0, 0, 0, 0);
      let endOfMonth = new Date(
        currentYear,
        currentMonth + 1,
        0,
        23,
        59,
        59,
        999
      );

      dateFilter = { startDate: { $gte: startOf21st, $lt: endOfMonth } };
    }

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 20;
    const skip = (pageNumber - 1) * limitNumber;

    const totalEvents = await EventModel.countDocuments({
      ...dateFilter,
      checkAddEvent: 2,
    });
    const totalPages = Math.ceil(totalEvents / limitNumber);

    const events = await EventModel.find({
      ...dateFilter,
      checkAddEvent: 2,
    })
      .populate("tickets")
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    return { EM: "Get event successfully", EC: 0, DT: { events, totalPages } };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something went wrong in service...",
      EC: -2,
      DT: [],
    };
  }
};

const getEventByExpired = async (eventId, time) => {
  try {
    if (!eventId) {
      return {
        EM: "Missing event ID",
        EC: -1,
        DT: null,
      };
    }

    const now = new Date();

    let query = { _id: eventId };

    if (time === "END") {
      query.endDate = { $lt: now }; // Đã kết thúc
    } else if (time === "START") {
      query.endDate = { $gte: now }; // Sắp diễn ra
    }

    const event = await EventModel.findOne(query, {
      eventName: 1,
      locationName: 1,
      endDate: 1,
      startDate: 1,
      address: 1,
    });

    if (!event) {
      return {
        EM: "Event not found with given condition",
        EC: 1,
        DT: null,
      };
    }

    return {
      EM: "Get event successfully",
      EC: 0,
      DT: event,
    };
  } catch (error) {
    console.log("Error in getEventByExpired:", error);
    return {
      EM: "Something went wrong in service...",
      EC: -2,
      DT: null,
    };
  }
};

const getEventByScore = async () => {
  try {
    let events = await EventModel.find({ checkAddEvent: 2 })
      .populate("tickets")
      .sort({ score: -1 })
      .limit(12);
    if (!events) {
      return { EM: "Event not found", EC: 1, DT: "" };
    }
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
  const { eventId, startDate = null, endDate = null } = data;
  console.log("data", data);
  try {
    if (!eventId) {
      return { EM: "Must have eventId", EC: 1, DT: "" };
    }

    let event = await EventModel.findOne({ _id: eventId });
    event.startDate = startDate ? formatDateString(startDate) : event.startDate;
    event.endDate = endDate ? formatDateString(endDate) : event.endDate;

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
  if (
    !data.eventId ||
    !data.accountName ||
    !data.accountNumber ||
    !data.bankName ||
    !data.branch
  ) {
    return { EM: "Missing parameter", EC: 1, DT: "" };
  }
  try {
    let event = await EventModel.findOne({ _id: data.eventId });
    if (!event) {
      return { EM: "Event not found", EC: 1, DT: "" };
    }

    const isFirstTimeComplete = event.checkAddEvent === 0;

    event.accountName = data.accountName;
    event.accountNumber = data.accountNumber;
    event.bankName = data.bankName;
    event.branch = data.branch;

    if (isFirstTimeComplete) {
      event.checkAddEvent = 1;
      sendEventApprovalNotification(event);
    }
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
};

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

const updateScore = async (data) => {
  const { eventId, score = 1 } = data;
  try {
    if (!eventId) {
      return { EM: "Must have eventId", EC: 1, DT: "" };
    }

    let event = await EventModel.findOne({ _id: eventId });
    if (!event) {
      return { EM: "Event not found", EC: 1, DT: "" };
    }

    event.score = Number(event.score || 0) + Number(score);

    await event.save();
    return { EM: "Update score successfully", EC: 0, DT: event };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something went wrong in service...",
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
  searchEvent,
  getEventByTime,
  updateScore,
  getEventByScore,
  getEventByExpired,
  getEventByAdmin,
  getSpecialEvent
};
