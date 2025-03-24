import bookingService from "../services/bookingService";

const getBookingById = async (req, res) => {
  try {
    let data = await bookingService.getBookingById(
      req.user.userId,
      req.query.bookingId
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

const getBookingByEventId = async (req, res) => {
  try {
    let data = await bookingService.getBookingByEventId(
      req.user.userId,
      req.query.eventId
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

const getAllBookingByEventId = async (req, res) => {
  try {
    let data = await bookingService.getAllBookingByEventId(
      req.user.userId,
      req.query.eventId
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

const createBooking = async (req, res) => {
  try {
    let data = await bookingService.createBooking(req.user.userId, req.body);
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

const updateReceiverInfo = async (req, res) => {
  try {
    let data = await bookingService.updateReceiverInfo(
      req.user.userId,
      req.body
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

const deleteBooking = async (req, res) => {
  try {
    let data = await bookingService.deleteBooking(
      req.user.userId,
      req.body.bookingId
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

module.exports = {
  createBooking,
  getBookingById,
  updateReceiverInfo,
  getAllBookingByEventId,
  deleteBooking,
  getBookingByEventId,
};
