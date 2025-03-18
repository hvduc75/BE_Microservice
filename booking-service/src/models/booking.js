import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    eventId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    tickets: [
        {
            ticketId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
            ticketName: { type: String, required: true },
            ticketPrice: { type: Number, required: true },
            quantity: { type: Number, required: true }, 
        }
    ],
    bookingTime: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "canceled"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("Booking", BookingSchema);
