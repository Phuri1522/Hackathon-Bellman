// pages/HunterHome.tsx
import { useState } from "react";
import HunterProfileOverlay from "../components/HunterprofileOverlay";
import SidebarLayout from "../components/SidebarLayout";

const mockHunter = {
  name: "Hunter_01",
  gender: "MALE",
  age: 26,
  class: "FIGHTER",
  rank: "B",
  rankScore: 420,
  avatarUrl: undefined,
};

const mockRequests = [
  { id: 1, animalType: "Bear", mutantType: "Ice", status: "ACCEPTED" },
  { id: 2, animalType: "Wolf", mutantType: "Fire", status: "PENDING" },
  { id: 3, animalType: "Snake", mutantType: "Poison", status: "COMPLETED" },
];

const mockSummary = [
  { id: 1, animalType: "Wolf", mutantType: "Fire", classRequired: "Fighter", distance: "0.4 km", reward: "glass of water", status: "OPEN" },
  { id: 2, animalType: "Bear", mutantType: "Ice", classRequired: "Tanker", distance: "1.2 km", reward: "abcd", status: "OPEN" },
];

const STATUS_COLOR: Record<string, string> = {
  ACCEPTED: "border-[#39ff14] text-[#39ff14]",
  PENDING: "border-[#facc15] text-[#facc15]",
  COMPLETED: "border-[#9ca3af] text-[#9ca3af]",
  OPEN: "border-[#39ff14] text-[#39ff14]",
};

const RANK_COLOR: Record<string, string> = {
  S: "bg-[#39ff14] text-black",
  A: "bg-[#facc15] text-black",
  B: "bg-orange-400 text-black",
  C: "bg-blue-400 text-black",
  D: "bg-[#9ca3af] text-black",
};

export default function HunterHome() {
  const [showProfile, setShowProfile] = useState(false);
  const [autoMatch, setAutoMatch] = useState(true);

  return (
    <>
      <SidebarLayout
        map={
          <div className="w-full h-full bg-[#050505] flex items-center justify-center">
            <p className="text-[#2d3748] text-sm" style={{ fontFamily: "Fira Code, monospace" }}>
              [ TACTICAL MAP VIEW ]
            </p>
          </div>
        }
        sidebar={
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-[#2d3748]">
              <button
                onClick={() => setShowProfile(true)}
                className="w-10 h-10 rounded-full bg-[#2d3748] border-2 border-[#39ff14] overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0"
              >
                {mockHunter.avatarUrl ? (
                  <img src={mockHunter.avatarUrl} className="w-full h-full object-cover" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="22" stroke="#39ff14" strokeWidth="2"/>
                    <path d="M16 20 L24 12 L32 20 M24 12 V36" stroke="#39ff14" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[#e5e7eb] font-bold text-sm" style={{ fontFamily: "Orbitron, monospace" }}>
                    {mockHunter.name.toUpperCase()}
                  </p>
                  <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${RANK_COLOR[mockHunter.rank]}`}
                    style={{ fontFamily: "Orbitron, monospace" }}>
                    {mockHunter.rank}
                  </span>
                </div>
                <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>
                  [{mockHunter.class}] · {mockHunter.gender} · Age {mockHunter.age}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 p-4 border-b border-[#2d3748]">
              {[
                { label: "RANK SCORE", value: mockHunter.rankScore },
                { label: "REQUESTS", value: mockRequests.length },
                { label: "COMPLETED", value: mockRequests.filter(r => r.status === "COMPLETED").length },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-[#39ff14] font-bold text-lg" style={{ fontFamily: "Orbitron, monospace" }}>{s.value}</p>
                  <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Auto match toggle */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2d3748]">
              <p className="text-[#9ca3af] text-xs tracking-widest" style={{ fontFamily: "Fira Code, monospace" }}>AUTO-MATCH</p>
              <button
                onClick={() => setAutoMatch(!autoMatch)}
                className={`w-12 h-6 rounded-full transition-colors relative ${autoMatch ? "bg-[#39ff14]" : "bg-[#2d3748]"}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-transform ${autoMatch ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>

            {/* My Requests */}
            <div className="p-4 border-b border-[#2d3748]">
              <p className="text-[#39ff14] text-xs font-bold tracking-widest mb-3" style={{ fontFamily: "Orbitron, monospace" }}>
                MY REQUESTS
              </p>
              <div className="flex flex-col gap-2">
                {mockRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-[#e5e7eb] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>{req.animalType}</span>
                      <span className="text-[#9ca3af] text-xs">·</span>
                      <span className="text-[#b7410e] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>{req.mutantType}</span>
                    </div>
                    <span className={`border rounded px-2 py-0.5 text-xs ${STATUS_COLOR[req.status]}`}
                      style={{ fontFamily: "Orbitron, monospace" }}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="p-4">
              <p className="text-[#39ff14] text-xs font-bold tracking-widest mb-3" style={{ fontFamily: "Orbitron, monospace" }}>
                SUMMARY THIS WEEK
              </p>
              <div className="flex flex-col gap-2">
                {mockSummary.map((s) => (
                  <div key={s.id} className="border border-[#2d3748] rounded-lg p-3 bg-[#050505]">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[#e5e7eb] text-xs font-bold" style={{ fontFamily: "Fira Code, monospace" }}>{s.animalType}</span>
                        <span className="text-[#9ca3af] text-xs">·</span>
                        <span className="text-[#b7410e] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>{s.mutantType}</span>
                      </div>
                      <span className={`border rounded px-2 py-0.5 text-xs ${STATUS_COLOR[s.status]}`}
                        style={{ fontFamily: "Orbitron, monospace" }}>
                        {s.status}
                      </span>
                    </div>
                    <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>[{s.classRequired}] {s.distance}</p>
                    <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>Reward: {s.reward}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      />

      {showProfile && (
        <HunterProfileOverlay
          hunter={mockHunter}
          isOwner={true}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
}