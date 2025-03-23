const cron = require('node-cron');
const mongoose = require('mongoose');
import EventModel from '../models/event';

cron.schedule('* * * * *', async () => { // Chạy mỗi phút một lần
    const now = new Date();
    console.log('🔄 Cron job đang kiểm tra sự kiện...');

    try {
        // Tìm các sự kiện có `start_time` nhỏ hơn `now` và `checkAddEvent` chưa cập nhật
        const expiredEvents = await EventModel.find({
            startDate: { $lt: now },
            checkAddEvent: { $ne: 3 } // Chỉ cập nhật nếu checkAddEvent chưa là 3
        });

        if (!expiredEvents || expiredEvents.length === 0) {
            console.log('Không có sự kiện nào cần cập nhật.');
            return;
        }

        // Cập nhật `checkAddEvent = 3` cho tất cả các sự kiện tìm thấy
        await EventModel.updateMany(
            { startDate: { $lt: now }, checkAddEvent: { $ne: 3 } },
            { $set: { checkAddEvent: 3 } }
        );

        console.log(`✅ Đã cập nhật ${expiredEvents.length} sự kiện checkAddEvent = 3.`);
        console.log('✅ Cron job đã hoàn tất!');
    } catch (error) {
        console.error('❌ Lỗi khi chạy cron job:', error);
    }
});
