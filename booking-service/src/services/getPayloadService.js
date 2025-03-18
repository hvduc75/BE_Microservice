import { BookingModel } from "../models";

const getTicketsPayload = async (userId, { productId, qty }, event) => {
  try {
    console.log(userId, productId, qty, event);
    const product = await ProductModel.findById(productId);

    if (product) {
      const payload = {
        event: event,
        data: { userId, product, qty },
      };
      return {
        EM: "get payload success",
        EC: 0,
        DT: payload,
      };
    } else {
      return {
        EM: "Product not found",
        EC: -2,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrong is service...",
      EC: -2,
      DT: [],
    };
  }
};


module.exports = {
    getTicketsPayload,
};