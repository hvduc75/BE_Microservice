import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

import { EventAssignmentModel } from "../models";
import { findNextAdminToAssign } from "../utils/roundRobin";
import { PublishMessage, CreateChannel } from "../utils";

let channel;

const initializeChannel = async () => {
  channel = await CreateChannel();
};

initializeChannel();

export const sendEventApprovalNotification = async (event) => {
  try {
    const response = await axios.get(
      "http://customer-service:8081/get-user-by-groupId",
      {
        params: { groupId: 2 },
      }
    );

    const listAdmin = response.data.DT;
    console.log("List admin:", listAdmin);

    if (!listAdmin || listAdmin.length === 0) return;

    // Tìm admin ít được phân công nhất (theo round-robin)
    const admin = await findNextAdminToAssign(listAdmin);

    console.log("Admin to assign:", admin);

    // 1. Tạo bản ghi EventAssignment
    const existing = await EventAssignmentModel.findOne({
      eventId: event._id,
    });

    if (existing) return; // đã gán rồi => không tạo/gửi lại

    await EventAssignmentModel.create({
      eventId: event._id,
      adminId: admin.id,
    });

    // 2. Gửi thông báo
    let dataPayload = {
      event: "NOTIFICATION",
      data: {
        userId: admin.id,
        eventId: event._id,
        eventImage: event.backgroundEvent,
        type: "event_approval_request",
        title: `Yêu cầu duyệt sự kiện`,
        message: `Bạn được phân công duyệt sự kiện "${event.eventName}".`,
      },
    };

    PublishMessage(
      channel,
      process.env.NOTIFICATION_SERVICE,
      JSON.stringify(dataPayload)
    );
  } catch (error) {
    console.log("Send notification failed:", error);
  }
};
