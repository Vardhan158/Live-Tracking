import { Routes, Route } from "react-router-dom";
import Navbar from "./components/UserNavbar";
import AdminPanel from "./components/AdminPanel";
import DeliveryPanel from "./components/DeliveryPanel";
import LiveMap from "./components/LiveMap";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LiveMap />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/delivery" element={<DeliveryPanel />} />
      </Routes>
    </>
  );
}
