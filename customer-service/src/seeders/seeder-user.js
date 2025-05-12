"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("752004", 10);

    await queryInterface.bulkInsert("User", [
      {
        username: "admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        type: "LOCAL",
        gender: 1,
        birthDay: new Date("1990-01-01"),
        phone: "0123456789",
        groupId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("User", {
      email: "admin@gmail.com",
    });
  },
};
