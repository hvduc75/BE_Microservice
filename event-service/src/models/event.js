import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true },
    eventName: { type: String, required: true },
    locationType: { type: String, required: true },
    locationName: { type: String, required: true },
    address: { type: String, required: true },
    eventType: { type: String, required: true },
    eventDescription: { type: String, required: true },
    organizerName: { type: String, required: true },
    eventLogo: { type: Buffer, required: true },
    backgroundEvent: { type: Buffer, required: true },
    organizerLogo: { type: Buffer, required: true },
    organizerDesc: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
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
  { timestamps: true }
);

export default mongoose.model("Event", EventSchema);
