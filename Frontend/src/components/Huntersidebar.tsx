import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import HunterProfileOverlay from "./HunterProfileOverlay"
import LogoutModal from "./LogoutModal"
import api from "../services/api"

const RANK_COLOR: Record<string, string> = {
  S: "bg-[#39ff14] text-black",
  A: "bg-[#facc15] text-black",
  B: "bg-orange-400 text-black",
  C: "bg-blue-400 text-black",
  D: "bg-[#9ca3af] text-black",
}

const RANK_SCORE_CAP: Record<string, number> = {
  D: 200,
  C: 400,
  B: 700,
  A: 1000,
  S: 1000,
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
  classRequired: string
  distance?: string
  reward?: string
  picture?: string | null
  imageUrl?: string | null
  createdAt?: string
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
  matchmakingRequests?: Request[]
  requests: Request[]
  summary: Summary[]
  hasActiveTask?: boolean
  onAutoMatchChange?: (enabled: boolean) => void
  onAcceptMatchmaking?: (taskId: number) => void
  onDenyMatchmaking?: (taskId: number) => void
  onFinishTask?: (taskId: number) => void
}

const ACTIVE_TASK_MESSAGE = "Complete your current task before accepting another match."

function getRewardText(reward?: string) {
  return reward?.trim() ? reward : "-"
}

function calculateRankFromScore(score: number) {
  if (score >= 1000) return "S";
  if (score >= 700) return "A";
  if (score >= 400) return "B";
  if (score >= 200) return "C";
  return "D";
}

function getRankCap(rank: string) {
  return RANK_SCORE_CAP[rank] ?? RANK_SCORE_CAP.D;
}

function formatRankScore(rankScore: number, rank: string) {
  const score = Math.floor(rankScore)
  const cap = RANK_SCORE_CAP[rank] ?? RANK_SCORE_CAP.D

  return `${score}/${cap}`
}

function getTaskImage(task: Request) {
  return task.picture ?? task.imageUrl ?? "https://images.unsplash.com/photo-1546182990-dffeafbe841d"
}

function getTaskName(task: Request) {
  return `${task.mutantType} ${task.animalType}`
}

function getTimeRemaining(createdAt?: string) {
  if (!createdAt) return 60

  const createdTime = new Date(createdAt).getTime()
  if (Number.isNaN(createdTime)) return 60

  return Math.max(0, Math.ceil(60 - (Date.now() - createdTime) / 1000))
}

function MatchmakingCard({
  task,
  acceptDisabled = false,
  variant = "compact",
  onAccept,
  onDeny,
}: {
  task: Request
  acceptDisabled?: boolean
  variant?: "compact" | "full"
  onAccept?: (taskId: number) => void
  onDeny?: (taskId: number) => void
}) {
  const isFull = variant === "full"

  return (
    <div className={isFull ? "rounded-lg border border-[#2d3748] bg-[#050505] p-5" : "rounded-lg border border-[#2d3748] bg-[#050505] p-3"}>
      <div className="mb-3 overflow-hidden rounded border border-[#2d3748] bg-[#050505]">
        <img
          src={getTaskImage(task)}
          alt={getTaskName(task)}
          className={isFull ? "h-56 w-full object-cover" : "h-24 w-full object-cover"}
          onError={(event) => {
            event.currentTarget.src =
              "https://images.unsplash.com/photo-1546182990-dffeafbe841d"
          }}
        />
      </div>
      <p className={isFull ? "text-lg font-bold text-[#e5e7eb]" : "text-xs font-bold text-[#e5e7eb]"} style={{ fontFamily: "Fira Code, monospace" }}>
        {getTaskName(task)}
      </p>
      <p className={isFull ? "mt-2 text-sm text-[#9ca3af]" : "text-xs text-[#9ca3af]"} style={{ fontFamily: "Fira Code, monospace" }}>
        Class: {task.classRequired}
      </p>
      <p className={isFull ? "text-sm text-[#9ca3af]" : "text-xs text-[#9ca3af]"} style={{ fontFamily: "Fira Code, monospace" }}>
        Reward: {getRewardText(task.reward)}
      </p>
      {task.distance && (
        <p className={isFull ? "text-sm text-[#9ca3af]" : "text-xs text-[#9ca3af]"} style={{ fontFamily: "Fira Code, monospace" }}>
          Distance: {task.distance}
        </p>
      )}
      <p className={isFull ? "mt-2 text-sm text-[#39ff14]" : "mt-1 text-xs text-[#39ff14]"} style={{ fontFamily: "Fira Code, monospace" }}>
        {getTimeRemaining(task.createdAt)} seconds remaining
      </p>
      <div className={isFull ? "mt-5 flex gap-3" : "mt-3 flex gap-2"}>
        <button
          type="button"
          onClick={() => onAccept?.(task.id)}
          disabled={acceptDisabled}
          className={isFull ? "flex-1 rounded bg-[#39ff14] px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-[#52ff2f] disabled:cursor-not-allowed disabled:bg-[#2d3748] disabled:text-[#9ca3af] disabled:hover:bg-[#2d3748]" : "flex-1 rounded bg-[#39ff14] px-3 py-1.5 text-xs font-bold text-black transition-colors hover:bg-[#52ff2f] disabled:cursor-not-allowed disabled:bg-[#2d3748] disabled:text-[#9ca3af] disabled:hover:bg-[#2d3748]"}
          style={{ fontFamily: "Orbitron, monospace" }}
        >
          {acceptDisabled ? "LOCKED" : "ACCEPT"}
        </button>
        <button
          type="button"
          onClick={() => onDeny?.(task.id)}
          className={isFull ? "flex-1 rounded border border-[#b7410e] px-4 py-2 text-sm font-bold text-[#b7410e] transition-colors hover:bg-[#b7410e15]" : "flex-1 rounded border border-[#b7410e] px-3 py-1.5 text-xs font-bold text-[#b7410e] transition-colors hover:bg-[#b7410e15]"}
          style={{ fontFamily: "Orbitron, monospace" }}
        >
          DENY
        </button>
      </div>
    </div>
  )
}

export default function HunterSidebar({
  hunter,
  matchmakingRequests = [],
  requests,
  summary,
  hasActiveTask = false,
  onAutoMatchChange,
  onAcceptMatchmaking,
  onDenyMatchmaking,
  onFinishTask,
}: Props) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [showProfile, setShowProfile] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const [autoMatch, setAutoMatch] = useState(hunter.autoMatch)
  const [, setTick] = useState(0)

  useEffect(() => {
    setAutoMatch(hunter.autoMatch)
  }, [hunter.autoMatch])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTick((current) => current + 1)
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  const handleToggle = async () => {
    const next = !autoMatch
    setAutoMatch(next)
    onAutoMatchChange?.(next)
    try {
      if (hunter.id) {
        await api.patch(`/api/hunters/${hunter.id}/auto-match`, { autoMatch: next })
      }
    } catch (error) {
      console.error("Failed to persist Auto Match preference", error)
    }
  }

  const handleAcceptMatchmaking = (taskId: number) => {
    if (hasActiveTask) return

    onAcceptMatchmaking?.(taskId)
  }

  const handleDenyMatchmaking = (taskId: number) => {
    onDenyMatchmaking?.(taskId)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }
  const activeMatchmakingRequest = matchmakingRequests[0]

  const completedScore = summary.reduce((total, task) => {
    return total + (task.powerScore ?? 0);
  }, 0);

  const displayedRankScore = completedScore || hunter.rankScore || 0;
  const displayedRank = calculateRankFromScore(displayedRankScore);

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-[#2d3748] p-4">
          <button
            onClick={() => setShowProfile(true)}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#39ff14] bg-[#2d3748] transition-opacity hover:opacity-80"
          >
            {hunter.avatarUrl
              ? <img src={hunter.avatarUrl} className="h-full w-full object-cover" />
              : <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" stroke="#39ff14" strokeWidth="2" />
                <path d="M16 20 L24 12 L32 20 M24 12 V36" stroke="#39ff14" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-[#e5e7eb]" style={{ fontFamily: "Orbitron, monospace" }}>
                {hunter.name.toUpperCase()}
              </p>
              <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${RANK_COLOR[hunter.rank] ?? RANK_COLOR.D}`}
                style={{ fontFamily: "Orbitron, monospace" }}>{hunter.rank}</span>
            </div>
            <p className="text-xs text-[#9ca3af]" style={{ fontFamily: "Fira Code, monospace" }}>
              [{hunter.class}] / {hunter.gender} / Age {hunter.age}
            </p>
          </div>
          <button
            onClick={() => setShowLogout(true)}
            className="flex-shrink-0 rounded border border-[#b7410e] px-2 py-1 text-xs text-[#b7410e] transition-colors hover:bg-[#b7410e15] md:hidden"
            style={{ fontFamily: "Orbitron, monospace" }}
          >
            LOGOUT
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 border-b border-[#2d3748] p-4">
          {[
            { label: "RANK SCORE", value: formatRankScore(displayedRankScore, displayedRank) },
            { label: "RANK", value: displayedRank },
            { label: "COMPLETED", value: summary.length },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-lg font-bold text-[#39ff14]" style={{ fontFamily: "Orbitron, monospace" }}>{s.value}</p>
              <p className="text-xs text-[#9ca3af]" style={{ fontFamily: "Fira Code, monospace" }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-b border-[#2d3748] px-4 py-3">
          <p className="text-xs tracking-widest text-[#9ca3af]" style={{ fontFamily: "Fira Code, monospace" }}>AUTO-MATCH</p>
          <button
            onClick={handleToggle}
            className={`relative h-6 w-12 rounded-full transition-colors ${autoMatch ? "bg-[#39ff14]" : "bg-[#2d3748]"}`}
          >
            <div className={`absolute top-1 h-4 w-4 rounded-full bg-black transition-transform ${autoMatch ? "translate-x-7" : "translate-x-1"}`} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="border-b border-[#2d3748] p-4">
            <p className="mb-3 text-xs font-bold tracking-widest text-[#39ff14]" style={{ fontFamily: "Orbitron, monospace" }}>
              CURRENT TASK
            </p>
            {requests.length === 0 && (
              <p className="text-center text-xs text-[#4b5563]" style={{ fontFamily: "Fira Code, monospace" }}>No current task</p>
            )}
            <div className="flex flex-col gap-2">
              {requests.map((task) => (
                <div key={task.id} className="rounded-lg border border-[#2d3748] bg-[#050505] p-3">
                  <div className="mb-3 overflow-hidden rounded border border-[#2d3748] bg-[#050505]">
                    <img
                      src={getTaskImage(task)}
                      alt={`${task.mutantType} ${task.animalType}`}
                      className="h-24 w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src =
                          "https://images.unsplash.com/photo-1546182990-dffeafbe841d"
                      }}
                    />
                  </div>
                  <p className="mb-1 text-xs font-bold text-[#e5e7eb]" style={{ fontFamily: "Fira Code, monospace" }}>
                    {getTaskName(task)}
                  </p>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[#e5e7eb]" style={{ fontFamily: "Fira Code, monospace" }}>{task.animalType}</span>
                      <span className="text-xs text-[#9ca3af]">/</span>
                      <span className="text-xs text-[#b7410e]" style={{ fontFamily: "Fira Code, monospace" }}>{task.mutantType}</span>
                    </div>
                    <span className="rounded border border-[#39ff14] px-2 py-0.5 text-xs text-[#39ff14]" style={{ fontFamily: "Orbitron, monospace" }}>
                      {task.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#9ca3af]" style={{ fontFamily: "Fira Code, monospace" }}>
                    [{task.classRequired}]{task.distance ? ` ${task.distance}` : ""}
                  </p>
                  <p className="text-xs text-[#9ca3af]" style={{ fontFamily: "Fira Code, monospace" }}>
                    Reward: {getRewardText(task.reward)}
                  </p>
                  <button
                    type="button"
                    onClick={() => onFinishTask?.(task.id)}
                    className="mt-3 w-full rounded bg-[#39ff14] px-3 py-1.5 text-xs font-bold text-black transition-colors hover:bg-[#52ff2f]"
                    style={{ fontFamily: "Orbitron, monospace" }}
                  >
                    FINISH
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4">
            <p className="mb-3 text-xs font-bold tracking-widest text-[#39ff14]" style={{ fontFamily: "Orbitron, monospace" }}>
              SUMMARY THIS WEEK
            </p>
            <div className="mb-3 rounded border border-[#2d3748] bg-[#050505] p-2 text-xs text-[#9ca3af]" style={{ fontFamily: "Fira Code, monospace" }}>
              Completed: <span className="text-[#39ff14]">{summary.length}</span>
            </div>
            {summary.length === 0 && (
              <p className="text-center text-xs text-[#4b5563]" style={{ fontFamily: "Fira Code, monospace" }}>No completed hunts this week</p>
            )}
            <div className="flex flex-col gap-2">
              {summary.map((s) => (
                <div key={s.id} className="rounded-lg border border-[#2d3748] bg-[#050505] p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[#e5e7eb]" style={{ fontFamily: "Fira Code, monospace" }}>{s.animalType}</span>
                      <span className="text-xs text-[#9ca3af]">/</span>
                      <span className="text-xs text-[#b7410e]" style={{ fontFamily: "Fira Code, monospace" }}>{s.mutantType}</span>
                    </div>
                    {s.powerScore && (
                      <span className="text-xs text-[#facc15]" style={{ fontFamily: "Fira Code, monospace" }}>+{s.powerScore} pts</span>
                    )}
                  </div>
                  <p className="text-xs text-[#9ca3af]" style={{ fontFamily: "Fira Code, monospace" }}>
                    [{s.classRequired}]{s.distance ? ` ${s.distance}` : ""}
                  </p>
                  {s.reward && (
                    <p className="text-xs text-[#9ca3af]" style={{ fontFamily: "Fira Code, monospace" }}>Reward: {s.reward}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden justify-end border-t border-[#2d3748] p-3 md:flex">
          <button
            onClick={() => setShowLogout(true)}
            className="rounded border border-[#b7410e] px-4 py-1.5 text-xs font-bold text-[#b7410e] transition-colors hover:bg-[#b7410e15]"
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
      {autoMatch && activeMatchmakingRequest && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-x-hidden bg-black/70 p-4">
          <div className="mx-auto my-auto max-h-[80vh] w-[90vw] max-w-lg overflow-y-auto overflow-x-hidden rounded-xl border border-[#2d3748] bg-[#0f1115] p-4 text-[#e5e7eb] shadow-[0_0_24px_rgba(57,255,20,0.25)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-bold tracking-widest text-[#39ff14]" style={{ fontFamily: "Orbitron, monospace" }}>
                MATCHMAKING
              </p>
              <span className="text-xs text-[#9ca3af]" style={{ fontFamily: "Fira Code, monospace" }}>
                {matchmakingRequests.length > 1 ? `1 of ${matchmakingRequests.length}` : "Auto Match"}
              </span>
            </div>
            <div>
              {hasActiveTask && (
                <p className="mb-3 text-center text-xs text-[#facc15]" style={{ fontFamily: "Fira Code, monospace" }}>
                  {ACTIVE_TASK_MESSAGE}
                </p>
              )}
              <MatchmakingCard
                task={activeMatchmakingRequest}
                variant="full"
                acceptDisabled={hasActiveTask}
                onAccept={handleAcceptMatchmaking}
                onDeny={handleDenyMatchmaking}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
