// pages/UserHome.tsx
import { useState } from "react";
import UserProfileOverlay from "../components/UserProfileOverlay";
import SidebarLayout from "../components/SidebarLayout";

const mockUser = {
  name: "Citizen 42",
  email: "user@test.com",
  avatarUrl: undefined,
};

const mockPosts = [
  { id: 1, animalType: "Wolf", mutantType: "Fire", classRequired: "Fighter", distance: "0.8 km", reward: "500", status: "OPEN" },
  { id: 2, animalType: "Bear", mutantType: "Ice", classRequired: "Fighter", distance: "0.8 km", reward: "500", status: "MATCHED" },
  { id: 3, animalType: "Snake", mutantType: "Poison", classRequired: "Fighter", distance: "0.8 km", reward: "500", status: "COMPLETED" },
];

const STATUS_COLOR: Record<string, string> = {
  OPEN: "border-[#39ff14] text-[#39ff14]",
  MATCHED: "border-[#facc15] text-[#facc15]",
  COMPLETED: "border-[#9ca3af] text-[#9ca3af]",
};

export default function UserHome() {
  const [showProfile, setShowProfile] = useState(false);

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
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-[#2d3748]">
              <button
                onClick={() => setShowProfile(true)}
                className="w-10 h-10 rounded-full bg-[#2d3748] border-2 border-[#39ff14] overflow-hidden flex items-center justify-center hover:border-[#39ff14]/80 transition-colors flex-shrink-0"
              >
                {mockUser.avatarUrl ? (
                  <img src={mockUser.avatarUrl} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#39ff14] text-lg">👤</span>
                )}
              </button>
              <div>
                <p className="text-[#e5e7eb] font-bold text-sm" style={{ fontFamily: "Orbitron, monospace" }}>
                  {mockUser.name.toUpperCase()}
                </p>
                <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>
                  USER · {mockPosts.length} active posts
                </p>
              </div>
            </div>

            {/* Posts */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              <p className="text-[#39ff14] text-xs font-bold tracking-widest mb-1" style={{ fontFamily: "Orbitron, monospace" }}>
                MY POSTS
              </p>

              {mockPosts.map((post) => (
                <div key={post.id} className="border border-[#2d3748] rounded-lg p-3 bg-[#050505]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <span className="text-[#e5e7eb] text-xs font-bold" style={{ fontFamily: "Fira Code, monospace" }}>
                        {post.animalType}
                      </span>
                      <span className="text-[#9ca3af] text-xs">·</span>
                      <span className="text-[#b7410e] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>
                        {post.mutantType}
                      </span>
                    </div>
                    <span className={`border rounded px-2 py-0.5 text-xs ${STATUS_COLOR[post.status]}`}
                      style={{ fontFamily: "Orbitron, monospace" }}>
                      {post.status}
                    </span>
                  </div>
                  <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>
                    [{post.classRequired}] {post.distance}
                  </p>
                  <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>
                    Reward: {post.reward}
                  </p>
                </div>
              ))}
            </div>

            {/* Post button */}
            <div className="p-4 border-t border-[#2d3748]">
              <button className="w-full bg-[#39ff14] text-black font-bold py-2 rounded tracking-widest text-xs hover:brightness-110 active:scale-95 transition-all"
                style={{ fontFamily: "Orbitron, monospace" }}>
                + POST MUTANT SIGHTING
              </button>
            </div>
          </div>
        }
      />

      {showProfile && (
        <UserProfileOverlay
          user={mockUser}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
}