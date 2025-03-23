const cron = require("node-cron");
import { BookingModel } from "../models";
import { PublishMessage, CreateChannel } from "../utils";

let channel;

const initializeChannel = async () => {
  channel = await CreateChannel();
};

initializeChannel();

cron.schedule("* * * * *", async () => {
    console.log("🔄 Cron job đang kiểm tra sự kiện...");
  
    try {
      const now = new Date();
      const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
  
      const expiredBookings = await BookingModel.find({
        bookingTime: { $lt: fifteenMinutesAgo },
        status: "PENDING",
      }).select("_id eventId tickets");
  
      if (!expiredBookings.length) {
        console.log("✅ No expired bookings found");
        return;
      }
  
      // Xóa các booking quá hạn
      await BookingModel.deleteMany({
        _id: { $in: expiredBookings.map((b) => b._id) },
      });
  
      // Gửi thông báo hủy booking
      for (const booking of expiredBookings) {
        const dataPayload = {
          event: "DELETE_BOOKING",
          data: {
            eventId: booking.eventId,
            tickets: booking.tickets,
          },
        };
        PublishMessage(
          channel,
          process.env.EVENT_SERVICE,
          JSON.stringify(dataPayload)
        );
      }
  
      console.log(`🗑️ Deleted ${expiredBookings.length} expired bookings`);
    } catch (error) {
      console.error("❌ Error in deleteExpiredBookings:", error);
    }
  });
  
