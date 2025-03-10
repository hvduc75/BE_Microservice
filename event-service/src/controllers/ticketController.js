import ticketService from "../services/ticketService";

const AddTicket = async (req, res) => {
  try {
    const ticketImage = req.file ? req.file.buffer : null;
    let data = await ticketService.AddTicket({ ...req.body, ticketImage });
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

const getTicketByEventId = async (req, res) => {
  try {
    let eventId = req.query.eventId;
    let data = await ticketService.getTicketByEventId(eventId);
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

const updateTicket = async (req, res) => {
  try {
    const ticketImage = req.file ? req.file.buffer : null;
    let data = await ticketService.updateTicket({ ...req.body, ticketImage });
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
  AddTicket,
  getTicketByEventId,
  updateTicket,
};
