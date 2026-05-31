import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import UserProfileOverlay from "./UserProfileOverlay"
import LogoutModal from "./LogoutModal"

const STATUS_COLOR: Record<string, string> = {
  OPEN: "border-[#39ff14] text-[#39ff14]",
  MATCHMAKING: "border-[#facc15] text-[#facc15]",
  PUBLIC: "border-[#39ff14] text-[#39ff14]",
  MATCHED: "border-[#facc15] text-[#facc15]",
  COMPLETED: "border-[#9ca3af] text-[#9ca3af]",
}

interface Post {
  id: number
  animalType: string
  mutantType: string
  classRequired: string
  distance?: string
  reward?: string
  status: string
  latitude?: number
  longitude?: number
}

interface User {
  id?: number
  name: string
  email: string
  avatarUrl?: string
}

interface Props {
  user: User
  posts: Post[]
  onCreatePost?: () => void
  onSelectPost?: (lat: number, lng: number) => void
}

export default function UserSidebar({ user, posts, onCreatePost, onSelectPost }: Props) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [showProfile, setShowProfile] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-[#2d3748]">
          <button
            onClick={() => setShowProfile(true)}
            className="w-10 h-10 rounded-full bg-[#2d3748] border-2 border-[#39ff14] overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity shrink-0"
          >
            {user.avatarUrl
              ? <img src={user.avatarUrl} className="w-full h-full object-cover" />
              : <span className="text-[#39ff14] text-lg">👤</span>
            }
          </button>
          <div className="flex-1">
            <p className="text-[#e5e7eb] font-bold text-sm" style={{ fontFamily: "Orbitron, monospace" }}>
              {user.name.toUpperCase()}
            </p>
            <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>
              USER · {posts.length} active posts
            </p>
          </div>
          {/* Mobile: logout top right */}
          <button
            onClick={() => setShowLogout(true)}
            className="md:hidden text-[#b7410e] text-xs border border-[#b7410e] rounded px-2 py-1 hover:bg-[#b7410e15] transition-colors shrink-0"
            style={{ fontFamily: "Orbitron, monospace" }}
          >
            LOGOUT
          </button>
        </div>

        {/* Posts */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          <p className="text-[#39ff14] text-xs font-bold tracking-widest mb-1" style={{ fontFamily: "Orbitron, monospace" }}>
            MY POSTS
          </p>
          {posts.length === 0 && (
            <p className="text-[#4b5563] text-xs text-center mt-8" style={{ fontFamily: "Fira Code, monospace" }}>
              No posts yet
            </p>
          )}
          {posts.map((post) => (
            <div
              key={post.id}
              className={`border border-[#2d3748] rounded-lg p-3 bg-[#050505] transition-colors ${post.latitude ? "cursor-pointer hover:border-[#39ff14]" : ""}`}
              onClick={() => post.latitude && post.longitude && onSelectPost?.(post.latitude, post.longitude)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <span className="text-[#e5e7eb] text-xs font-bold" style={{ fontFamily: "Fira Code, monospace" }}>{post.animalType}</span>
                  <span className="text-[#9ca3af] text-xs">·</span>
                  <span className="text-[#b7410e] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>{post.mutantType}</span>
                </div>
                <span className={`border rounded px-2 py-0.5 text-xs ${STATUS_COLOR[post.status] ?? "border-[#9ca3af] text-[#9ca3af]"}`}
                  style={{ fontFamily: "Orbitron, monospace" }}>{post.status}</span>
              </div>
              <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>
                [{post.classRequired}]{post.distance ? ` ${post.distance}` : ""}
              </p>
              {post.reward && (
                <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>
                  Reward: {post.reward}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="p-4 border-t border-[#2d3748]">
          <div className="flex items-center gap-2">
            <button
              onClick={onCreatePost}
              className="flex-1 bg-[#39ff14] text-black font-bold py-2 rounded tracking-widest text-xs hover:brightness-110 active:scale-95 transition-all"
              style={{ fontFamily: "Orbitron, monospace" }}
            >
              + POST MUTANT SIGHTING
            </button>
            {/* PC: small logout button bottom right */}
            <button
              onClick={() => setShowLogout(true)}
              className="hidden md:flex items-center justify-center border border-[#b7410e] text-[#b7410e] rounded px-3 py-2 text-xs hover:bg-[#b7410e15] transition-colors shrink-0"
              style={{ fontFamily: "Orbitron, monospace" }}
            >
              LOGOUT
            </button>
          </div>
        </div>
      </div>

      {showProfile && (
        <UserProfileOverlay user={user} onClose={() => setShowProfile(false)} />
      )}
      {showLogout && (
        <LogoutModal onConfirm={handleLogout} onCancel={() => setShowLogout(false)} />
      )}
    </>
  )
}