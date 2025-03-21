import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    ticketName: { type: String, required: true },
    ticketPrice: { type: Number, required: true },
    ticketAmount: { type: Number, required: true },
    ticketMin: { type: Number, required: true },
    ticketMax: { type: Number, required: true },
    ticketDesc: { type: String, required: true },
    ticketImage: { type: Buffer },
    eventTicketSaleStartTime: { type: Date, required: true },
    eventTicketSaleEndTime: { type: Date, required: true },
  },
  { timestamps: true } 
);

export default mongoose.model("Ticket", TicketSchema);
