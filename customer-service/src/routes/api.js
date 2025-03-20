import express from "express";
import authController from "../controllers/authController.js";
import roleController from "../controllers/roleController.js";
import groupController from "../controllers/groupController.js";
import userController from "../controllers/userController.js";
import extractUserFromHeader from "../middleware/extractUser";
import multer from "multer";

const router = express.Router();
const extractUser = extractUserFromHeader;

// config form data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const initApiRoutes = (app) => {
  router.all("*", extractUser);

  // user routes
  router.get("/account", userController.getAccount);
  router.post("/login", authController.handleLogin);
  router.post("/register", authController.handleRegister);
  router.post("/logout", authController.handleLogout);
  router.put("/update-profile", upload.single('avatar'), userController.updateProfile);

  // role routes
  router.get("/role/read", roleController.readFunc);
  router.get("/role/by-group:groupId", roleController.getRoleByGroup);
  router.post("/role/create", roleController.createFunc);
  router.post("/role/assign-to-group", roleController.assignRoleToGroup);
  router.put("/role/update", roleController.updateFunc);
  router.delete("/role/delete", roleController.deleteFunc);

  // group routes
  router.get("/group/read", groupController.readFunc);

  return app.use("/", router);
};

export default initApiRoutes;
