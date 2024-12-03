import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
// io is like a middle-man that sit on top of server -- basically sit on top of rest api and help with real time data com and db work
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {

  return userSocketMap[userId];
}



// used to store online users
const userSocketMap = {}; // {userId: socketId}, userID from db, socketId from socket.id

io.on("connection", (socket) => {
  // if there is connection event then call back happen, socket is the user that jsut connected

  console.log("A user connected", socket.id); // socket is the person connected, an object tthus got alot of method,

  // Extract userId from query params during handshake
  const userId = socket.handshake.query.userId;
  // If userId exists, store the socket.id in userSocketMap
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clietns
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
export { io, app, server };
