import paymentService from "../services/paymentService";

const updatePayment = async (req, res) => {
  try {
    let data = await paymentService.updatePayment(req.user.userId, req.body);
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
  updatePayment,
};
