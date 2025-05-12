"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Group", [
      {
        name: "User",
        description: "Regular user group",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Admin",
        description: "Administrator group",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Group", {
      name: { [Sequelize.Op.in]: ["User", "Admin"] },
    });
  },
};
