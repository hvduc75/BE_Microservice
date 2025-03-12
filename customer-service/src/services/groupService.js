import db from "../models";

const getGroups = async () => {
  try {
    let data = await db.Group.findAll({
      order: [["name", "ASC"]],
    });
    return {
      EM: "Get groups success",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "error from service",
      EC: 1,
      DT: [],
    };
  }
};

const getGroupWithRoles = async (user) => {
  let roles = await db.Group.findOne({
    where: { id: user.groupId },
    attributes: ["name"],
    include: {
      model: db.Role,
      attributes: ["url"],
      through: { attributes: [] },
    },
  });
  return roles ? roles : {};
};

module.exports = {
  getGroups,
  getGroupWithRoles,
};
