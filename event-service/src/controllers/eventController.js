import eventService from "../services/eventService";

const AddEvent = async (req, res) => {
  try {
    const eventLogo = req.files["eventLogo"]
      ? req.files["eventLogo"][0].buffer
      : null;
    const backgroundEvent = req.files["backgroundEvent"]
      ? req.files["backgroundEvent"][0].buffer
      : null;
    const organizerLogo = req.files["organizerLogo"]
      ? req.files["organizerLogo"][0].buffer
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

const getEventById = async (req, res) => {
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
}

const updateEventDate = async (req, res) => {
  try {
    console.log(req.body);
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
}

module.exports = {
  AddEvent,getEventById, updateEventDate
};
