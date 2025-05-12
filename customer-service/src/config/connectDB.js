import { Sequelize } from "sequelize";

const sequelize = new Sequelize("customer_service", "root", "123456", {
  host: "mysql_db",
  dialect: "mysql",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to container MySQL successfully.");
  } catch (error) {
    console.error("❌ Failed to connect:", error.message);
  }
};

export default connectDB;
