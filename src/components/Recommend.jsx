import React, { useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function Recommend({ onBooked }) {
  const [coords, setCoords] = useState({ lat: 37.7749, lng: -122.4194 });
  const [vehicleType, setVehicleType] = useState("");
  const [rec, setRec] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRec = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...coords, vehicle_type: vehicleType || null }),
      });
      if (!res.ok) throw new Error("Failed to get recommendation");
      const data = await res.json();
      setRec(data);
    } catch (e) {
      setError("No recommendation available. Seed data first.");
    } finally {
      setLoading(false);
    }
  };

  const startBooking = async () => {
    if (!rec) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/book/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lot_id: rec.lot_id,
          spot_id: rec.spot_id,
          vehicle_plate: "8ABC123",
          user_name: "Guest",
        }),
      });
      if (!res.ok) throw new Error("Failed to start booking");
      const data = await res.json();
      onBooked(data.booking_id);
    } catch (e) {
      setError("Could not start booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-4 md:p-6">
      <h2 className="text-white font-semibold mb-3">Smart Recommendation</h2>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs text-blue-200/70 mb-1">Latitude</label>
          <input
            type="number"
            step="0.0001"
            className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3 py-2 text-white"
            value={coords.lat}
            onChange={(e) => setCoords((c) => ({ ...c, lat: parseFloat(e.target.value) }))}
          />
        </div>
        <div>
          <label className="block text-xs text-blue-200/70 mb-1">Longitude</label>
          <input
            type="number"
            step="0.0001"
            className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3 py-2 text-white"
            value={coords.lng}
            onChange={(e) => setCoords((c) => ({ ...c, lng: parseFloat(e.target.value) }))}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-xs text-blue-200/70 mb-1">Vehicle Type</label>
        <select
          className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3 py-2 text-white"
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
        >
          <option value="">Any</option>
          <option value="car">Car</option>
          <option value="ev">EV</option>
          <option value="motorcycle">Motorcycle</option>
          <option value="accessible">Accessible</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={getRec}
          className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-500"
        >
          Get Recommendation
        </button>
        {rec && (
          <button
            onClick={startBooking}
            className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-500"
          >
            Reserve Spot #{rec.spot_number}
          </button>
        )}
      </div>

      {loading && <p className="text-blue-200 mt-3">Working...</p>}
      {error && <p className="text-rose-400 text-sm mt-2">{error}</p>}
      {rec && (
        <div className="mt-3 text-blue-200/90 text-sm">
          <p>
            Recommended lot: <span className="text-white">{rec.lot_name}</span>
          </p>
          <p>
            Spot: <span className="text-white">{rec.spot_number}</span>
          </p>
          <p className="text-xs text-blue-300/70">{rec.reason}</p>
        </div>
      )}
    </div>
  );
}
