import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const steps = [
  "Preparing",
  "Cooking",
  "Out for Delivery",
  "Delivered",
];

export default function AdminPanel() {
  const socketRef = useRef(null);
  const [currentStatus, setCurrentStatus] = useState("Preparing");

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    return () => socketRef.current.disconnect();
  }, []);

  // 🔔 Send simple notification
  const sendNotification = (text) => {
    socketRef.current.emit("sendNotification", {
      message: text,
      time: new Date().toLocaleTimeString(),
    });
  };

  // 📦 Update live order status
  const updateOrderStatus = (status) => {
    setCurrentStatus(status);

    socketRef.current.emit("orderStatusUpdate", {
      orderId: "ORDER123",
      status,
    });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-10 bg-zinc-900 text-white">
      <h1 className="text-3xl font-semibold">🏨 Hotel Admin Panel</h1>

      {/* Notification Section */}
      <div className="flex gap-4">
        <button
          onClick={() => sendNotification("New Order Received")}
          className="bg-orange-600 px-6 py-3 rounded"
        >
          New Order
        </button>

        <button
          onClick={() => sendNotification("Table Booked")}
          className="bg-blue-600 px-6 py-3 rounded"
        >
          Table Booking
        </button>

        <button
          onClick={() => sendNotification("Order Delivered")}
          className="bg-green-600 px-6 py-3 rounded"
        >
          Order Delivered
        </button>
      </div>

      {/* Live Order Tracking Section */}
      <div className="mt-10 text-center">
        <p className="text-xl text-orange-400 mb-4">
          Current Order Status: {currentStatus}
        </p>

        <div className="flex gap-4">
          {steps.map((step) => (
            <button
              key={step}
              onClick={() => updateOrderStatus(step)}
              className="bg-orange-700 px-5 py-2 rounded"
            >
              {step}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
