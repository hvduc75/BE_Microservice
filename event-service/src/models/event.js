import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true }, // Liên kết với User
    eventImage: { type: String, required: true },
    eventName: { type: String, required: true },
    locationType: { type: String, required: true },
    location: { type: String, required: true },
    eventType: { type: String, required: true },
    eventDesc: { type: String, required: true },
    organizerName: { type: String, required: true },
    organizerDesc: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    checkAddEvent: { type: Boolean, default: false },
    // tickets: [
    //   {
    //     ticketName: { type: String, required: true },
    //     ticketPrice: { type: Number, required: true },
    //     ticketAmount: { type: Number, required: true },
    //     ticketMin: { type: Number, required: true },
    //     ticketMax: { type: Number, required: true },
    //     ticketDesc: { type: String, required: true },
    //     ticketImage: { type: String, required: true },
    //   },
    // ],
  },
  { timestamps: true } // Tự động tạo createdAt, updatedAt
);

export default mongoose.model("Event", EventSchema);
