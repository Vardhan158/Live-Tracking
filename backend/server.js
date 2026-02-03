const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // User joins
  socket.on("join", (username) => {
    socket.username = username;
    console.log(`${username} joined`);

    io.emit("message", {
      user: "System",
      text: `${username} joined the chat`,
    });
  });

  // Receive and broadcast message
  socket.on("sendMessage", (text) => {
    console.log(`💬 ${socket.username}: ${text}`);

    io.emit("message", {
      user: socket.username,
      text,
    });
  });

  // Typing indicator
  socket.on("typing", () => {
    socket.broadcast.emit("typing", socket.username);
  });

  socket.on("stopTyping", () => {
    socket.broadcast.emit("stopTyping");
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`🔴 ${socket.username} disconnected`);

    if (socket.username) {
      io.emit("message", {
        user: "System",
        text: `${socket.username} left the chat`,
      });
    }
  });
});

server.listen(5000, () => {
  console.log("🚀 Chat server running on port 5000");
});
