import React, { useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function Booking() {
  const [bookingId, setBookingId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const endBooking = async () => {
    if (!bookingId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/book/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId }),
      });
      if (!res.ok) throw new Error("Failed to end booking");
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError("Could not end booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-4 md:p-6">
      <h2 className="text-white font-semibold mb-3">End Booking & Pay</h2>
      <input
        className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3 py-2 text-white mb-3"
        placeholder="Enter Booking ID"
        value={bookingId}
        onChange={(e) => setBookingId(e.target.value)}
      />
      <button
        onClick={endBooking}
        className="px-3 py-2 rounded-lg bg-rose-600 text-white text-sm hover:bg-rose-500"
      >
        End Booking
      </button>
      {loading && <p className="text-blue-200 mt-3">Processing...</p>}
      {error && <p className="text-rose-400 text-sm mt-2">{error}</p>}
      {result && (
        <div className="mt-3 text-blue-200/90 text-sm">
          <p>Duration: <span className="text-white">{result.duration_minutes.toFixed(1)} mins</span></p>
          <p>Amount Due: <span className="text-white">${result.amount_due} {result.currency}</span></p>
        </div>
      )}
    </div>
  );
}
