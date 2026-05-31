import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import HunterProfileOverlay from "./HunterProfileOverlay"
import LogoutModal from "./LogoutModal"
import api from "../services/api"

const STATUS_COLOR: Record<string, string> = {
  ACCEPTED: "border-[#39ff14] text-[#39ff14]",
  ACCEPTED_BY_USER: "border-[#39ff14] text-[#39ff14]",
  AUTO_ACCEPTED: "border-[#39ff14] text-[#39ff14]",
  PENDING: "border-[#facc15] text-[#facc15]",
  COMPLETED: "border-[#9ca3af] text-[#9ca3af]",
  DECLINED_BY_USER: "border-[#b7410e] text-[#b7410e]",
  DECLINED_BY_HUNTER: "border-[#b7410e] text-[#b7410e]",
  OPEN: "border-[#39ff14] text-[#39ff14]",
}

const RANK_COLOR: Record<string, string> = {
  S: "bg-[#39ff14] text-black",
  A: "bg-[#facc15] text-black",
  B: "bg-orange-400 text-black",
  C: "bg-blue-400 text-black",
  D: "bg-[#9ca3af] text-black",
}

interface Hunter {
  id?: number
  name: string
  gender: string
  age: number
  class: string
  rank: string
  rankScore: number
  avatarUrl?: string
  autoMatch: boolean
}

interface Request {
  id: number
  animalType: string
  mutantType: string
  status: string
  postLatitude?: number
  postLongitude?: number
}

interface Summary {
  id: number
  animalType: string
  mutantType: string
  classRequired: string
  distance?: string
  reward?: string
  powerScore?: number
}

interface Props {
  hunter: Hunter
  requests: Request[]
  summary: Summary[]
  onSelectRequest?: (lat: number, lng: number) => void
  onCompleteRequest?: (id: number) => void
  onDismissRequest?: (id: number, status: string) => void
}

export default function HunterSidebar({ hunter, requests, summary, onSelectRequest, onCompleteRequest, onDismissRequest }: Props) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [showProfile, setShowProfile] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const [autoMatch, setAutoMatch] = useState(hunter.autoMatch)
  const [confirmDoneId, setConfirmDoneId] = useState<number | null>(null)

  useEffect(() => {
    setAutoMatch(hunter.autoMatch)
  }, [hunter.autoMatch])

  const handleToggle = async () => {
    const next = !autoMatch
    setAutoMatch(next)
    try {
      if (hunter.id) {
        await api.patch(`/api/hunters/${hunter.id}/auto-match`, { autoMatch: next })
      }
    } catch {
      setAutoMatch(!next)
    }
  }

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
            {hunter.avatarUrl
              ? <img src={hunter.avatarUrl} className="w-full h-full object-cover" />
              : <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="22" stroke="#39ff14" strokeWidth="2"/>
                  <path d="M16 20 L24 12 L32 20 M24 12 V36" stroke="#39ff14" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            }
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[#e5e7eb] font-bold text-sm" style={{ fontFamily: "Orbitron, monospace" }}>
                {hunter.name.toUpperCase()}
              </p>
              <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${RANK_COLOR[hunter.rank] ?? RANK_COLOR.D}`}
                style={{ fontFamily: "Orbitron, monospace" }}>{hunter.rank}</span>
            </div>
            <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>
              [{hunter.class}] · {hunter.gender} · Age {hunter.age}
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 p-4 border-b border-[#2d3748]">
          {[
            { label: "RANK SCORE", value: hunter.rankScore },
            { label: "REQUESTS", value: requests.length },
            { label: "COMPLETED", value: requests.filter(r => r.status === "COMPLETED").length },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-[#39ff14] font-bold text-lg" style={{ fontFamily: "Orbitron, monospace" }}>{s.value}</p>
              <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Auto match */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2d3748]">
          <p className="text-[#9ca3af] text-xs tracking-widest" style={{ fontFamily: "Fira Code, monospace" }}>AUTO-MATCH</p>
          <button
            onClick={handleToggle}
            className={`w-12 h-6 rounded-full transition-colors relative ${autoMatch ? "bg-[#39ff14]" : "bg-[#2d3748]"}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-transform ${autoMatch ? "translate-x-7" : "translate-x-1"}`} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-[#2d3748]">
            <p className="text-[#39ff14] text-xs font-bold tracking-widest mb-3" style={{ fontFamily: "Orbitron, monospace" }}>
              MY REQUESTS
            </p>
            {requests.length === 0 && (
              <p className="text-[#4b5563] text-xs text-center" style={{ fontFamily: "Fira Code, monospace" }}>No requests yet</p>
            )}
            <div className="flex flex-col gap-2">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className={`flex items-center justify-between rounded p-1 -mx-1 transition-colors ${req.postLatitude ? "cursor-pointer hover:bg-[#2d3748]" : ""}`}
                  onClick={() => req.postLatitude && req.postLongitude && onSelectRequest?.(req.postLatitude, req.postLongitude)}
                >
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-[#e5e7eb] text-xs truncate" style={{ fontFamily: "Fira Code, monospace" }}>{req.animalType}</span>
                    <span className="text-[#9ca3af] text-xs">·</span>
                    <span className="text-[#b7410e] text-xs truncate" style={{ fontFamily: "Fira Code, monospace" }}>{req.mutantType}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-1">
                    {req.status === "ACCEPTED_BY_USER" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDoneId(req.id) }}
                        className="border border-[#39ff14] text-[#39ff14] rounded px-2 py-0.5 text-xs hover:bg-[#39ff1415] transition-colors"
                        style={{ fontFamily: "Orbitron, monospace" }}
                      >
                        DONE
                      </button>
                    )}
                    <span className={`border rounded px-2 py-0.5 text-xs ${STATUS_COLOR[req.status] ?? "border-[#9ca3af] text-[#9ca3af]"}`}
                      style={{ fontFamily: "Orbitron, monospace" }}>{req.status}</span>
                    {req.status !== "ACCEPTED_BY_USER" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDismissRequest?.(req.id, req.status) }}
                        className="text-[#4b5563] hover:text-[#9ca3af] text-xs leading-none"
                        title="Dismiss"
                      >✕</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4">
            <p className="text-[#39ff14] text-xs font-bold tracking-widest mb-3" style={{ fontFamily: "Orbitron, monospace" }}>
              SUMMARY THIS WEEK
            </p>
            {summary.length === 0 && (
              <p className="text-[#4b5563] text-xs text-center" style={{ fontFamily: "Fira Code, monospace" }}>No completed hunts this week</p>
            )}
            <div className="flex flex-col gap-2">
              {summary.map((s) => (
                <div key={s.id} className="border border-[#2d3748] rounded-lg p-3 bg-[#050505]">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[#e5e7eb] text-xs font-bold" style={{ fontFamily: "Fira Code, monospace" }}>{s.animalType}</span>
                      <span className="text-[#9ca3af] text-xs">·</span>
                      <span className="text-[#b7410e] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>{s.mutantType}</span>
                    </div>
                    {s.powerScore && (
                      <span className="text-[#facc15] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>+{s.powerScore} pts</span>
                    )}
                  </div>
                  {s.classRequired && (
                    <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>
                      [{s.classRequired}]{s.distance ? ` ${s.distance}` : ""}
                    </p>
                  )}
                  {s.reward && (
                    <p className="text-[#facc15] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>+{s.reward}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom - PC: small logout bottom right */}
        <div className="hidden md:flex justify-end p-3 border-t border-[#2d3748]">
          <button
            onClick={() => setShowLogout(true)}
            className="border border-[#b7410e] text-[#b7410e] font-bold px-4 py-1.5 rounded text-xs hover:bg-[#b7410e15] transition-colors"
            style={{ fontFamily: "Orbitron, monospace" }}
          >
            LOG OUT
          </button>
        </div>
      </div>

      {showProfile && (
        <HunterProfileOverlay
          hunter={hunter}
          isOwner={true}
          onClose={() => setShowProfile(false)}
        />
      )}
      {showLogout && (
        <LogoutModal onConfirm={handleLogout} onCancel={() => setShowLogout(false)} />
      )}
      {confirmDoneId !== null && createPortal(
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60"
          onClick={() => setConfirmDoneId(null)}
        >
          <div
            className="bg-[#0f1115] border border-[#2d3748] rounded-lg p-6 w-80 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[#e5e7eb] text-sm mb-1 font-bold" style={{ fontFamily: "Orbitron, monospace" }}>COMPLETE HUNT?</p>
            <p className="text-[#9ca3af] text-xs mb-5" style={{ fontFamily: "Fira Code, monospace" }}>
              This will mark the job as done and re-enable auto-match.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDoneId(null)}
                className="flex-1 border border-[#2d3748] text-[#9ca3af] rounded py-2 text-xs hover:bg-[#2d3748] transition-colors"
                style={{ fontFamily: "Orbitron, monospace" }}
              >CANCEL</button>
              <button
                onClick={() => { onCompleteRequest?.(confirmDoneId!); setConfirmDoneId(null) }}
                className="flex-1 bg-[#39ff14] text-black font-bold rounded py-2 text-xs hover:brightness-110 transition-all"
                style={{ fontFamily: "Orbitron, monospace" }}
              >CONFIRM</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}