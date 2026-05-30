import { useState } from "react";

interface User {
  name: string;
  email: string;
  avatarUrl?: string;
}

interface Props {
  user: User;
  onClose: () => void;
}

export default function UserProfileOverlay({ user, onClose }: Props) {
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl);
  const [name, setName] = useState(user.name);
  const [isEditing, setIsEditing] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    // TODO: integrate API PATCH /api/users/:id/avatar
    console.log("Save user:", { name, avatarPreview });
    setIsEditing(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0f1115] border border-[#2d3748] rounded-xl w-full max-w-sm p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-[#9ca3af] hover:text-[#e5e7eb] text-lg">
          ✕
        </button>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-[#2d3748] border-2 border-[#39ff14] overflow-hidden flex items-center justify-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#39ff14] text-3xl">👤</span>
              )}
            </div>
            {isEditing && (
              <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#39ff14] rounded-full flex items-center justify-center cursor-pointer text-black text-xs">
                ✎
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            )}
          </div>

          <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>
            USER
          </p>
        </div>

        {/* Info */}
        // Edit mode เหลือแค่ avatar
        {!isEditing ? (
        <div className="flex flex-col gap-3">
            {[
            { label: "NAME", value: user.name },
            { label: "EMAIL", value: user.email },
            ].map((item) => (
            <div key={item.label} className="flex justify-between items-center border-b border-[#2d3748] pb-2">
                <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>{item.label}</p>
                <p className="text-[#e5e7eb] text-sm" style={{ fontFamily: "Fira Code, monospace" }}>{item.value}</p>
            </div>
            ))}

            <button onClick={() => setIsEditing(true)}
            className="w-full mt-2 border border-[#39ff14] text-[#39ff14] font-bold py-2 rounded tracking-widest text-xs hover:bg-[#39ff1415] transition-colors"
            style={{ fontFamily: "Orbitron, monospace" }}>
            CHANGE AVATAR
            </button>
        </div>
        ) : (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2">
            <label className="cursor-pointer border border-dashed border-[#39ff14] rounded-lg p-4 w-full text-center hover:bg-[#39ff1410] transition-colors">
                <p className="text-[#39ff14] text-xs mb-1" style={{ fontFamily: "Fira Code, monospace" }}>
                Click to select image
                </p>
                <p className="text-[#4b5563] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>
                JPG, PNG, WEBP
                </p>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
            </div>

            <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)}
                className="flex-1 border border-[#2d3748] text-[#9ca3af] font-bold py-2 rounded text-xs"
                style={{ fontFamily: "Orbitron, monospace" }}>
                CANCEL
            </button>
            <button onClick={handleSave}
                className="flex-1 bg-[#39ff14] text-black font-bold py-2 rounded text-xs hover:brightness-110"
                style={{ fontFamily: "Orbitron, monospace" }}>
                UPLOAD
            </button>
            </div>
        </div>
        )}
      </div>
    </div>
  );
}