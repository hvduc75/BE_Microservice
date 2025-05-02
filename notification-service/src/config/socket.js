import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

let ioInstance = null;
const connectedUsers = new Map(); 

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); 
      socket.user = {
        id: decoded.userId,
        role: decoded.groupWithRoles.name,
      };
      next();
    } catch (err) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const { id: userId, role } = socket.user;
    console.log("🔌 Socket connected:", socket.id, "User:", userId, "Role:", role);

    // Lưu mapping userId -> socket.id
    connectedUsers.set(userId, socket.id);

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
      connectedUsers.delete(userId);
    });

    socket.on("send-notification", (data) => {
      console.log("📨 New notification from", userId, ":", data);
      io.emit("notification", data);
    });
  });

  ioInstance = io;
};

// Gửi thông báo tới user cụ thể (theo userId)
export const emitToUser = (userId, data) => {
  const socketId = connectedUsers.get(userId);
  if (ioInstance && socketId) {
    ioInstance.to(socketId).emit("notification", data);
  }
};

// Gửi broadcast cho tất cả
export const emitNotification = (data) => {
  if (ioInstance) {
    ioInstance.emit("notification", data);
  }
};
