import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function Navbar() {
  const socketRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    // 🔔 Notifications
    socketRef.current.on("newNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    // 📦 Live order tracking
    socketRef.current.on("orderStatusUpdate", (data) => {
      setOrderStatus(data.status);
    });

    return () => socketRef.current.disconnect();
  }, []);

  return (
    <div className="bg-zinc-900 text-white">
      {/* Top Navbar */}
      <div className="p-4 flex justify-between items-center border-b border-zinc-700">
        <h1 className="text-xl font-semibold">🍽️ DineFlow</h1>

        {/* Notification Bell */}
        <div className="relative">
          <button onClick={() => setOpen(!open)} className="text-2xl">
            🔔
          </button>

          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-2 py-1 rounded-full">
              {notifications.length}
            </span>
          )}

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-4 w-80 bg-zinc-800 border border-zinc-700 rounded shadow-xl z-50">
              <div className="p-3 font-semibold border-b border-zinc-700">
                Notifications
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="p-4 text-sm text-zinc-400">
                    No notifications
                  </p>
                )}

                {notifications.map((n, i) => (
                  <div
                    key={i}
                    className="p-4 border-b border-zinc-700 text-sm hover:bg-zinc-700"
                  >
                    <p>{n.message}</p>
                    <span className="text-xs text-zinc-400">
                      {n.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Order Status Bar */}
      {orderStatus && (
        <div className="bg-orange-600 text-center py-2 text-sm font-medium">
          📦 Live Order Status: {orderStatus}
        </div>
      )}
    </div>
  );
}
