import mongoose from "mongoose";

const EventAssignmentSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    adminId: { type: Number, required: true },
    isApproved: { type: Boolean, default: false },
    approvedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("EventAssignment", EventAssignmentSchema);
