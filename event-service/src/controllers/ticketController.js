import ticketService from "../services/ticketService";

const AddTickets = async (req, res) => {
  try {
    let data = await ticketService.AddTickets(req.body);
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
  AddTickets,
};