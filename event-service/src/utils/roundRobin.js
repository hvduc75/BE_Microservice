import { EventAssignmentModel } from "../models";

export const findNextAdminToAssign = async (adminList) => {
  // Tạo map để đếm số lần mỗi admin đã được gán
  const countMap = {};

  for (let admin of adminList) {
    const count = await EventAssignmentModel.countDocuments({
      adminId: admin.id,
    });
    countMap[admin.id] = count;
  }

  // Tìm admin có số lần gán ít nhất
  let selectedAdmin = adminList[0];
  let minCount = countMap[selectedAdmin.id];

  for (let admin of adminList) {
    if (countMap[admin.id] < minCount) {
      selectedAdmin = admin;
      minCount = countMap[admin.id];
    }
  }

  return selectedAdmin;
};
