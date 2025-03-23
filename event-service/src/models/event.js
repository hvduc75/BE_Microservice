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
    contentEmail: { type: String },
    accountName: { type: String },
    accountNumber: { type: String },
    bankName: { type: String },
    branch: { type: String },
    score: { type: Number, default: 0 },
    checkAddEvent: { type: Number },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true },
  }
);

EventSchema.virtual("tickets", {
  ref: "Ticket",
  localField: "_id",
  foreignField: "eventId",
});

export default mongoose.model("Event", EventSchema);
