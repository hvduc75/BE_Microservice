import notificationService from "../services/notificationService";

const getAllNotifications = async (req, res) => {
  try {
    let data = await notificationService.getAllNotifications(req.user.userId);
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
  getAllNotifications,
};
