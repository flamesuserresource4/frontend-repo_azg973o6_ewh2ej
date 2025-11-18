import React, { useState } from "react";
import Header from "./components/Header";
import LotList from "./components/LotList";
import Recommend from "./components/Recommend";
import Booking from "./components/Booking";

function App() {
  const [bookingId, setBookingId] = useState("");
  const [selectedLot, setSelectedLot] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <Header />

        <div className="grid md:grid-cols-2 gap-6">
          <LotList onSelectLot={(lot) => setSelectedLot(lot)} />
          <div className="space-y-6">
            <Recommend onBooked={(id) => setBookingId(id)} />
            <Booking />
            {bookingId && (
              <div className="bg-emerald-900/30 border border-emerald-600/30 text-emerald-200 rounded-xl p-4 text-sm">
                Active booking ID: <span className="text-white">{bookingId}</span>
              </div>
            )}
            {selectedLot && (
              <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-4">
                <p className="text-white font-medium">Selected Lot</p>
                <p className="text-blue-200/80 text-sm">{selectedLot.name}</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-blue-300/60 text-xs mt-10">
          Tip: Click Seed Demo if the list is empty.
        </p>
      </div>
    </div>
  );
}

export default App;
