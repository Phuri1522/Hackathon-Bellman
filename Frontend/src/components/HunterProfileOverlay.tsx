import { useState } from "react";

interface Hunter {
  name: string;
  gender: string;
  age: number;
  class: string;
  rank: string;
  rankScore: number;
  avatarUrl?: string;
}

interface Props {
  hunter: Hunter;
  isOwner?: boolean;
  onClose: () => void;
}

const RANK_COLOR: Record<string, string> = {
  S: "text-[#39ff14] border-[#39ff14]",
  A: "text-[#facc15] border-[#facc15]",
  B: "text-orange-400 border-orange-400",
  C: "text-blue-400 border-blue-400",
  D: "text-[#9ca3af] border-[#9ca3af]",
};

export default function HunterProfileOverlay({ hunter, isOwner = false, onClose }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    gender: hunter.gender,
    age: hunter.age,
    class: hunter.class,
  });
  const [avatarPreview, setAvatarPreview] = useState(hunter.avatarUrl);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    // TODO: integrate API PATCH /api/hunters/:id
    console.log("Save profile:", form);
    setIsEditing(false);
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Card */}
      <div
        className="bg-[#0f1115] border border-[#2d3748] rounded-xl w-full max-w-sm p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9ca3af] hover:text-[#e5e7eb] text-lg"
        >
          ✕
        </button>

        {/* Avatar + Rank */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-[#2d3748] border-2 border-[#39ff14] overflow-hidden flex items-center justify-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="22" stroke="#39ff14" strokeWidth="2"/>
                  <path d="M16 20 L24 12 L32 20 M24 12 V36" stroke="#39ff14" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
            </div>

            {/* Edit avatar button */}
            {isEditing && (
              <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#39ff14] rounded-full flex items-center justify-center cursor-pointer text-black text-xs">
                ✎
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[#e5e7eb] font-bold text-lg" style={{ fontFamily: "Orbitron, monospace" }}>
                {hunter.name}
              </p>
              <span className={`border rounded px-2 py-0.5 text-xs font-bold ${RANK_COLOR[hunter.rank] ?? RANK_COLOR.D}`}
                style={{ fontFamily: "Orbitron, monospace" }}>
                {hunter.rank}
              </span>
            </div>
            <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>
              RANK SCORE: {hunter.rankScore}
            </p>
          </div>
        </div>

        {/* Info */}
        {!isEditing ? (
          <div className="flex flex-col gap-3">
            {[
              { label: "GENDER", value: hunter.gender },
              { label: "AGE", value: String(hunter.age) },
              { label: "CLASS", value: hunter.class },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center border-b border-[#2d3748] pb-2">
                <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>{item.label}</p>
                <p className="text-[#e5e7eb] text-sm font-bold" style={{ fontFamily: "Orbitron, monospace" }}>{item.value}</p>
              </div>
            ))}

            {isOwner && (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full mt-2 border border-[#39ff14] text-[#39ff14] font-bold py-2 rounded tracking-widest text-xs hover:bg-[#39ff1415] transition-colors"
                style={{ fontFamily: "Orbitron, monospace" }}
              >
                EDIT PROFILE
              </button>
            )}
          </div>
        ) : (
          // Edit mode
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>GENDER</label>
                <select name="gender" value={form.gender} onChange={handleChange}
                  className="bg-[#050505] border border-[#2d3748] rounded px-3 py-2 text-[#e5e7eb] text-sm outline-none focus:border-[#39ff14] transition-colors"
                  style={{ fontFamily: "Fira Code, monospace" }}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 w-24">
                <label className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>AGE</label>
                <input type="number" name="age" value={form.age} onChange={handleChange} min={1} max={99}
                  className="bg-[#050505] border border-[#2d3748] rounded px-3 py-2 text-[#e5e7eb] text-sm outline-none focus:border-[#39ff14] transition-colors"
                  style={{ fontFamily: "Fira Code, monospace" }} />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>CLASS</label>
              <select name="class" value={form.class} onChange={handleChange}
                className="bg-[#050505] border border-[#2d3748] rounded px-3 py-2 text-[#e5e7eb] text-sm outline-none focus:border-[#39ff14] transition-colors"
                style={{ fontFamily: "Fira Code, monospace" }}>
                <option value="FIGHTER">Fighter</option>
                <option value="TANKER">Tanker</option>
                <option value="RANGER">Ranger</option>
              </select>
            </div>

            <div className="flex gap-2 mt-1">
              <button onClick={() => setIsEditing(false)}
                className="flex-1 border border-[#2d3748] text-[#9ca3af] font-bold py-2 rounded text-xs hover:border-[#9ca3af] transition-colors"
                style={{ fontFamily: "Orbitron, monospace" }}>
                CANCEL
              </button>
              <button onClick={handleSave}
                className="flex-1 bg-[#39ff14] text-black font-bold py-2 rounded text-xs hover:brightness-110 transition-all"
                style={{ fontFamily: "Orbitron, monospace" }}>
                SAVE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}