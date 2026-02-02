const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // 🔔 Send notification to all users
  socket.on("sendNotification", (data) => {
    io.emit("newNotification", data);
  });

  // 📦 Live order status tracking
  socket.on("orderStatusUpdate", (data) => {
    io.emit("orderStatusUpdate", data);

    io.emit("newNotification", {
      message: `Order is now ${data.status}`,
      time: new Date().toLocaleTimeString(),
    });
  });

  // 🚴 Live delivery GPS tracking
  socket.on("deliveryLocationUpdate", (data) => {
    console.log("📡 Delivery GPS:", data.location);
    io.emit("deliveryLocationUpdate", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ✅ Render-compatible port
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
