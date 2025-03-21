import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true },
    bookingId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    paymentMethod: {
      type: String,
      enum: ["VNPAY", "MOMO", "ZALO_PAY"],
      required: true,
    },
    transactionId: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", PaymentSchema);
