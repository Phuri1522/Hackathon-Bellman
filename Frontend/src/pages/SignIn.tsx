import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate API
    console.log("Sign in:", form);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Left Panel */}
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

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8 md:hidden">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="#39ff14" strokeWidth="2"/>
              <path d="M16 20 L24 12 L32 20 M24 12 V36 M16 28 L24 36 L32 28" stroke="#39ff14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-[#39ff14] font-bold text-xl tracking-widest mt-2" style={{ fontFamily: "Orbitron, monospace" }}>MUTANT HUNTER</p>
            <p className="text-[#9ca3af] text-xs tracking-widest" style={{ fontFamily: "Fira Code, monospace" }}>// HUNT OR BE HUNTED</p>
          </div>

          <h1 className="text-[#39ff14] text-2xl font-bold mb-1 tracking-widest" style={{ fontFamily: "Orbitron, monospace" }}>SIGN IN</h1>
          <p className="text-[#9ca3af] text-xs mb-6" style={{ fontFamily: "Fira Code, monospace" }}>Enter your credentials to access the system</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>Email</label>
              <input type="email" name="email" placeholder="hunter@domain.com" value={form.email} onChange={handleChange} required
                className="bg-[#0f1115] border border-[#2d3748] rounded px-3 py-2 text-[#e5e7eb] text-sm outline-none focus:border-[#39ff14] transition-colors placeholder:text-[#4b5563]"
                style={{ fontFamily: "Fira Code, monospace" }} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>Password</label>
              <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required
                className="bg-[#0f1115] border border-[#2d3748] rounded px-3 py-2 text-[#e5e7eb] text-sm outline-none focus:border-[#39ff14] transition-colors placeholder:text-[#4b5563]"
                style={{ fontFamily: "Fira Code, monospace" }} />
            </div>
            <button type="submit" className="bg-[#39ff14] text-black font-bold py-2 rounded tracking-widest text-sm mt-2 hover:brightness-110 active:scale-95 transition-all" style={{ fontFamily: "Orbitron, monospace" }}>
              SIGN IN
            </button>
          </form>

          <p className="text-center text-[#9ca3af] text-xs mt-4" style={{ fontFamily: "Fira Code, monospace" }}>
            Don't have an account?{" "}
            <button onClick={() => navigate("/register/step-1")} className="text-[#39ff14] hover:underline">SIGN UP</button>
          </p>
        </div>
      </div>
    </div>
  );
}