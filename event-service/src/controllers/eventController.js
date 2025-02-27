import eventService from "../services/eventService";

const AddEvent = async (req, res) => {
  try {
    let data = await eventService.AddEvent(req.user.userId, req.body);
    console.log(data);
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
  AddEvent,
};