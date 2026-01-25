// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Login";
import Callback from "./pages/Callback";
import Dashboard from "./pages/Dashboard";
import ManageDevices from "./pages/ManageDevice";
import ManageResidents from "./pages/ManageResident";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/manage-residents" element={<ManageResidents />} />
      <Route path="/manage-devices" element={<ManageDevices />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
