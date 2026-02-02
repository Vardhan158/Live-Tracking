import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// 🔥 This forces map to move when position changes
function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position);
  }, [position, map]);

  return null;
}

export default function LiveMap() {
  const socketRef = useRef(null);

  const [position, setPosition] = useState({
    lat: 12.9716,
    lng: 77.5946,
  });

  useEffect(() => {
    socketRef.current = io("https://live-tracking-bapo.onrender.com");

    socketRef.current.on("deliveryLocationUpdate", (data) => {
      console.log("📍 New location:", data.location);
      setPosition(data.location);
    });

    return () => socketRef.current.disconnect();
  }, []);

  return (
    <div className="h-[500px] w-full">
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* This makes map follow the rider */}
        <RecenterMap position={position} />

        <Marker position={position} />
      </MapContainer>
    </div>
  );
}
