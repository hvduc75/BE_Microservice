import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    eventId: { type: String, required: true },
    tickets: [
        {
            ticketId: { type: String, required: true },
            ticketName: { type: String, required: true },
            ticketPrice: { type: Number, required: true },
            quantity: { type: Number, required: true }, 
        }
    ],
    bookingTime: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    receiverEmail: { type: String },
    receiverName: { type: String },
    receiverPhone: { type: String },
    status: { type: String, enum: ["PENDING", "CONFIRMED", "CANCELED"], default: "PENDING" },
}, { timestamps: true });

export default mongoose.model("Booking", BookingSchema);
