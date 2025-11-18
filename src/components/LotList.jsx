import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function LotList({ onSelectLot }) {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLots = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/lots`);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setLots(data);
    } catch (e) {
      setError("Unable to load lots. Try seeding data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLots();
  }, []);

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">Nearby Parking Lots</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchLots}
            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-500"
          >
            Refresh
          </button>
          <button
            onClick={async () => {
              try {
                await fetch(`${API_BASE}/seed`, { method: "POST" });
                fetchLots();
              } catch (e) {}
            }}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-500"
          >
            Seed Demo
          </button>
        </div>
      </div>
      {loading && <p className="text-blue-200">Loading...</p>}
      {error && <p className="text-rose-400 text-sm mb-2">{error}</p>}
      <div className="grid md:grid-cols-2 gap-4">
        {lots.map((lot) => (
          <button
            key={lot.id}
            onClick={() => onSelectLot(lot)}
            className="text-left bg-slate-900/40 hover:bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{lot.name}</p>
                <p className="text-xs text-blue-200/70">{lot.address}</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 text-sm font-semibold">
                  {lot.available_spots} free
                </p>
                <p className="text-blue-300/70 text-xs">${lot.price_per_hour}/h</p>
              </div>
            </div>
          </button>
        ))}
        {!loading && lots.length === 0 && (
          <p className="text-blue-200/80">No lots yet. Click Seed Demo.</p>
        )}
      </div>
    </div>
  );
}
