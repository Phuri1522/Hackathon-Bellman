import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpHunter() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", gender: "MALE", age: "", class: "FIGHTER" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register hunter:", form); // TODO: integrate API
  };

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
          <div className="flex flex-col items-center mb-6 md:hidden">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="#39ff14" strokeWidth="2"/>
              <path d="M16 20 L24 12 L32 20 M24 12 V36 M16 28 L24 36 L32 28" stroke="#39ff14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-[#39ff14] font-bold text-xl tracking-widest mt-2" style={{ fontFamily: "Orbitron, monospace" }}>MUTANT HUNTER</p>
          </div>

          <h1 className="text-[#facc15] text-2xl font-bold mb-1 tracking-widest" style={{ fontFamily: "Orbitron, monospace" }}>HUNTER PROFILE</h1>
          <p className="text-[#9ca3af] text-xs mb-6" style={{ fontFamily: "Fira Code, monospace" }}>// REGISTER YOUR HUNTER CREDENTIALS</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>Name</label>
              <input type="text" name="name" placeholder="Hunter name" value={form.name} onChange={handleChange} required
                className="bg-[#0f1115] border border-[#2d3748] rounded px-3 py-2 text-[#e5e7eb] text-sm outline-none focus:border-[#facc15] transition-colors placeholder:text-[#4b5563]"
                style={{ fontFamily: "Fira Code, monospace" }} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>Email</label>
              <input type="email" name="email" placeholder="hunter@domain.com" value={form.email} onChange={handleChange} required
                className="bg-[#0f1115] border border-[#2d3748] rounded px-3 py-2 text-[#e5e7eb] text-sm outline-none focus:border-[#facc15] transition-colors placeholder:text-[#4b5563]"
                style={{ fontFamily: "Fira Code, monospace" }} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>Password</label>
              <input type="password" name="password" placeholder="Create password" value={form.password} onChange={handleChange} required
                className="bg-[#0f1115] border border-[#2d3748] rounded px-3 py-2 text-[#e5e7eb] text-sm outline-none focus:border-[#facc15] transition-colors placeholder:text-[#4b5563]"
                style={{ fontFamily: "Fira Code, monospace" }} />
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange}
                  className="bg-[#0f1115] border border-[#2d3748] rounded px-3 py-2 text-[#e5e7eb] text-sm outline-none focus:border-[#facc15] transition-colors"
                  style={{ fontFamily: "Fira Code, monospace" }}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 w-28">
                <label className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>Age</label>
                <input type="number" name="age" placeholder="Your age" value={form.age} onChange={handleChange} required min={1} max={99}
                  className="bg-[#0f1115] border border-[#2d3748] rounded px-3 py-2 text-[#e5e7eb] text-sm outline-none focus:border-[#facc15] transition-colors placeholder:text-[#4b5563]"
                  style={{ fontFamily: "Fira Code, monospace" }} />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>Class</label>
              <select name="class" value={form.class} onChange={handleChange}
                className="bg-[#0f1115] border border-[#2d3748] rounded px-3 py-2 text-[#e5e7eb] text-sm outline-none focus:border-[#facc15] transition-colors"
                style={{ fontFamily: "Fira Code, monospace" }}>
                <option value="FIGHTER">Fighter</option>
                <option value="TANKER">Tanker</option>
                <option value="RANGER">Ranger</option>
              </select>
            </div>

            <button type="submit" className="bg-[#facc15] text-black font-bold py-2 rounded tracking-widest text-sm mt-1 hover:brightness-110 active:scale-95 transition-all" style={{ fontFamily: "Orbitron, monospace" }}>
              REGISTER AS HUNTER
            </button>
          </form>

          <p className="text-center text-[#9ca3af] text-xs mt-4" style={{ fontFamily: "Fira Code, monospace" }}>
            <button onClick={() => navigate("/register/step-1")} className="text-[#39ff14] hover:underline">← Back</button>
          </p>
        </div>
      </div>
    </div>
  );
}