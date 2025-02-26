import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

const initApiRoutes = (app) => {
    router.post("/login", authController.handleLogin);
    router.post("/register", authController.handleRegister);

    return app.use('/', router);
}

export default initApiRoutes;