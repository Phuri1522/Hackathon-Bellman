import { useEffect, useState } from "react"

type HuntRequest = {
  id: number
  isAutoMatched: boolean
  post: {
    id: number
    animalType: string
    mutantType: string
    reward: string | null
    latitude: number
    longitude: number
  }
  hunter?: {
    rank: string
    class: string
  }
}

type Props = {
  huntRequest: HuntRequest
  onAccept: (huntRequest: HuntRequest) => void
  onDecline: (huntRequest: HuntRequest) => void
}

const COUNTDOWN_SEC = 10

export default function AutoMatchNotification({ huntRequest, onAccept, onDecline }: Props) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SEC)

  useEffect(() => {
    if (countdown <= 0) {
      onDecline(huntRequest)
      return
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown, huntRequest, onDecline])

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60">
      <div
        className="w-[90vw] max-w-sm rounded border border-[#facc15] bg-[#0f1115] p-6 shadow-[0_0_30px_rgba(250,204,21,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 text-xs uppercase tracking-widest text-[#facc15]">
          AUTO MATCH FOUND
        </div>
        <h2 className="mb-4 font-['Orbitron'] text-xl font-bold text-[#facc15]">
          {huntRequest.post.mutantType} {huntRequest.post.animalType}
        </h2>

        {huntRequest.post.reward && (
          <p className="mb-3 text-sm text-[#9ca3af]">
            Reward:{" "}
            <span className="text-[#e5e7eb]">{huntRequest.post.reward}</span>
          </p>
        )}

        <div className="mb-5 text-center text-3xl font-bold text-[#facc15]">
          {countdown}
          <span className="ml-1 text-sm font-normal text-[#9ca3af]">s</span>
        </div>

        <div className="h-1 w-full overflow-hidden rounded bg-[#2d3748]">
          <div
            className="h-full rounded bg-[#facc15] transition-all duration-1000"
            style={{ width: `${(countdown / COUNTDOWN_SEC) * 100}%` }}
          />
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => onAccept(huntRequest)}
            className="flex-1 rounded border border-[#facc15] bg-[#facc15] py-2 font-bold text-black transition-opacity hover:opacity-80"
          >
            GO HUNT
          </button>
          <button
            onClick={() => onDecline(huntRequest)}
            className="flex-1 rounded border border-[#2d3748] py-2 font-bold text-[#9ca3af] transition-colors hover:border-[#b7410e] hover:text-[#b7410e]"
          >
            DECLINE
          </button>
        </div>
      </div>
    </div>
  )
}
