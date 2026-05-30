import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpRole() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"USER" | "HUNTER">("USER");

  return (
    <div className="min-h-screen bg-[#050505] flex">
      <div className="hidden md:flex w-1/3 flex-col items-center justify-center border-r border-[#2d3748] bg-[#0f1115]">
        <div className="flex flex-col items-center gap-4">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="#39ff14" strokeWidth="2"/>
            <path d="M16 20 L24 12 L32 20 M24 12 V36 M16 28 L24 36 L32 28" stroke="#39ff14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="text-center">
            <p className="text-[#39ff14] font-bold text-2xl tracking-widest" style={{ fontFamily: "Orbitron, monospace" }}>MUTANT</p>
            <p className="text-[#39ff14] font-bold text-2xl tracking-widest" style={{ fontFamily: "Orbitron, monospace" }}>HUNTER</p>
            <p className="text-[#9ca3af] text-xs tracking-widest mt-1" style={{ fontFamily: "Fira Code, monospace" }}>// HUNT OR BE HUNTED</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8 md:hidden">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="#39ff14" strokeWidth="2"/>
              <path d="M16 20 L24 12 L32 20 M24 12 V36 M16 28 L24 36 L32 28" stroke="#39ff14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-[#39ff14] font-bold text-xl tracking-widest mt-2" style={{ fontFamily: "Orbitron, monospace" }}>MUTANT HUNTER</p>
          </div>

          <h1 className="text-[#39ff14] text-2xl font-bold mb-1 tracking-widest" style={{ fontFamily: "Orbitron, monospace" }}>JOIN THE HUNT</h1>
          <p className="text-[#9ca3af] text-xs mb-6" style={{ fontFamily: "Fira Code, monospace" }}>Choose your role in the ecosystem</p>

          <div className="flex gap-3 mb-6">
            <button onClick={() => setRole("USER")}
              className={`flex-1 border rounded-lg p-4 text-left transition-all ${role === "USER" ? "border-[#39ff14] bg-[#39ff1410]" : "border-[#2d3748] bg-[#0f1115] hover:border-[#4b5563]"}`}>
              <p className={`font-bold text-sm tracking-widest mb-1 ${role === "USER" ? "text-[#39ff14]" : "text-[#e5e7eb]"}`} style={{ fontFamily: "Orbitron, monospace" }}>USER</p>
              <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>Report sightings & post bounties</p>
            </button>
            <button onClick={() => setRole("HUNTER")}
              className={`flex-1 border rounded-lg p-4 text-left transition-all ${role === "HUNTER" ? "border-[#facc15] bg-[#facc1510]" : "border-[#2d3748] bg-[#0f1115] hover:border-[#4b5563]"}`}>
              <p className={`font-bold text-sm tracking-widest mb-1 ${role === "HUNTER" ? "text-[#facc15]" : "text-[#e5e7eb]"}`} style={{ fontFamily: "Orbitron, monospace" }}>HUNTER</p>
              <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>Accept bounties & eliminate threats</p>
            </button>
          </div>

          <button onClick={() => navigate(role === "USER" ? "/register/step-2-user" : "/register/step-2-hunter")}
            className="w-full bg-[#39ff14] text-black font-bold py-2 rounded tracking-widest text-sm hover:brightness-110 active:scale-95 transition-all" style={{ fontFamily: "Orbitron, monospace" }}>
            CONTINUE →
          </button>

          <p className="text-center text-[#9ca3af] text-xs mt-4" style={{ fontFamily: "Fira Code, monospace" }}>
            Already registered?{" "}
            <button onClick={() => navigate("/login")} className="text-[#39ff14] hover:underline">SIGN IN</button>
          </p>
        </div>
      </div>
    </div>
  );
}