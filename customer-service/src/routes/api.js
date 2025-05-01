import express from "express";
import authController from "../controllers/authController.js";
import roleController from "../controllers/roleController.js";
import groupController from "../controllers/groupController.js";
import userController from "../controllers/userController.js";
import extractUserFromHeader from "../middleware/extractUser";
import extractTokenFromHeader from "../middleware/extractToken.js";
import multer from "multer";

const router = express.Router();
const extractUser = extractUserFromHeader;
const extractToken = extractTokenFromHeader;

// config form data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const initApiRoutes = (app) => {
  router.all("*", extractUser, extractToken);

  // user routes
  router.get("/account", userController.getAccount);
  router.get('/get-All-User', userController.readFunc);
  router.post('/create-user', upload.single('image'), userController.createFunc);
  router.post("/login", upload.none(), authController.handleLogin);
  router.post("/register", upload.none(), authController.handleRegister);
  router.post("/logout", authController.handleLogout);
  router.post("/refresh_token", authController.handleRefreshToken);
  router.put('/update-user', upload.single('image'), userController.updateFunc);
  router.put("/update-profile", upload.single('avatar'), userController.updateProfile);
  router.put("/update-receiverInfo", upload.none(), userController.updateReceiverInfo);
  router.delete('/delete-user', userController.deleteFunc);

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
