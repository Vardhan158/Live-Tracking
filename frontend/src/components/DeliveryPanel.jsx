import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function DeliveryPanel() {
  const socketRef = useRef(null);
  const watchIdRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // 🔥 IMPORTANT: use laptop IP, not localhost
    socketRef.current = io("https://live-tracking-bapo.onrender.com");

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    // Force permission popup
    navigator.geolocation.getCurrentPosition(
      () => {
        console.log("✅ Permission granted");
      },
      (err) => {
        console.error(err);
        setError("Location permission denied");
      }
    );

    // Watch real GPS location
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        console.log("📍 Live GPS:", coords);

        setLocation(coords);

        socketRef.current.emit("deliveryLocationUpdate", {
          orderId: "ORDER123",
          location: coords,
        });
      },
      (err) => {
        console.error(err);
        setError("Please allow location permission");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 bg-zinc-900 text-white">
      <h1 className="text-3xl">🚴 Live Delivery GPS</h1>

      {error && <p className="text-red-400">{error}</p>}

      {!location && <p>Waiting for GPS permission...</p>}

      {location && (
        <>
          <p>Latitude: {location.lat}</p>
          <p>Longitude: {location.lng}</p>
          <p className="text-green-400">
            Sending live location to users...
          </p>
        </>
      )}
    </div>
  );
}
