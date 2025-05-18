import eventService from "../services/eventService";
import uploadToCloudinary from "../utils/uploadToCloudinary";

const getEventById = async (req, res) => {
  // console.log(req.user); tạm thời chưa dùng được userId vì nó đã bỏ qua JWT mất rồi nên ko gán lại decoded lại được
  try {
    let data = await eventService.getEventById(req.query.eventId);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const getEventByCondition = async (req, res) => {
  try {
    let data = await eventService.getEventByCondition(
      req.user.groupWithRoles.name,
      req.user.userId,
      req.query
    );
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const getEventByAdmin = async (req, res) => {
  try {
    let data = await eventService.getEventByAdmin(req.user.userId, req.query);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const getEventByExpired = async (req, res) => {
  try {
    const eventId = req.query.eventId ? req.query.eventId : null;
    const time = req.query.time ? req.query.time : null;
    console.log("EventId:", eventId);
    console.log("Time:", time);
    let data = await eventService.getEventByExpired(eventId, time);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const searchEvent = async (req, res) => {
  try {
    let data = await eventService.searchEvent(req.query);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const getEventByTime = async (req, res) => {
  try {
    let data = await eventService.getEventByTime(req.query);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const getEventByScore = async (req, res) => {
  try {
    let data = await eventService.getEventByScore();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const getSpecialEvent = async (req, res) => {
  try {
    let data = await eventService.getSpecialEvent();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const AddEvent = async (req, res) => {
  try {
    const eventLogoFile = req.files["eventLogo"]
      ? req.files["eventLogo"][0]
      : null;
    const backgroundEventFile = req.files["backgroundEvent"]
      ? req.files["backgroundEvent"][0]
      : null;
    const organizerLogoFile = req.files["organizerLogo"]
      ? req.files["organizerLogo"][0]
      : null;

    const eventLogo = eventLogoFile
      ? await uploadToCloudinary(eventLogoFile)
      : null;
    const backgroundEvent = backgroundEventFile
      ? await uploadToCloudinary(backgroundEventFile)
      : null;
    const organizerLogo = organizerLogoFile
      ? await uploadToCloudinary(organizerLogoFile)
      : null;

    let data = await eventService.AddEvent(req.user.userId, {
      ...req.body,
      eventLogo,
      backgroundEvent,
      organizerLogo,
    });
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const editEvent = async (req, res) => {
  try {
    console.log(req.files);
    const eventLogo = req.files["eventLogo"]
      ? req.files["eventLogo"][0].buffer
      : null;
    const backgroundEvent = req.files["backgroundEvent"]
      ? req.files["backgroundEvent"][0].buffer
      : null;
    const organizerLogo = req.files["organizerLogo"]
      ? req.files["organizerLogo"][0].buffer
      : null;

    let data = await eventService.editEvent({
      ...req.body,
      eventLogo,
      backgroundEvent,
      organizerLogo,
    });
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const updateEventDate = async (req, res) => {
  try {
    let data = await eventService.updateEventDate(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const updateContentEmail = async (req, res) => {
  try {
    let data = await eventService.updateContentEmail(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const updateBankAccount = async (req, res) => {
  try {
    let data = await eventService.updateBankAccount(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const confirmEvent = async (req, res) => {
  try {
    let data = await eventService.confirmEvent(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const updateScore = async (req, res) => {
  try {
    let data = await eventService.updateScore(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

module.exports = {
  getSpecialEvent,
  AddEvent,
  getEventById,
  updateEventDate,
  getEventByCondition,
  editEvent,
  updateBankAccount,
  updateContentEmail,
  confirmEvent,
  searchEvent,
  getEventByTime,
  updateScore,
  getEventByScore,
  getEventByExpired,
  getEventByAdmin
};
