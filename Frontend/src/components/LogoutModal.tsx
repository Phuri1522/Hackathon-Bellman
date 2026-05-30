import { createPortal } from "react-dom"

interface Props {
  onConfirm: () => void
  onCancel: () => void
}

export default function LogoutModal({ onConfirm, onCancel }: Props) {
  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-[#0f1115] border border-[#2d3748] rounded-xl w-full max-w-xs p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[#e5e7eb] font-bold text-base mb-1 tracking-widest" style={{ fontFamily: "Orbitron, monospace" }}>
          LOG OUT
        </h2>
        <p className="text-[#9ca3af] text-xs mb-6" style={{ fontFamily: "Fira Code, monospace" }}>
          Are you sure you want to log out?
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 border border-[#2d3748] text-[#9ca3af] font-bold py-2 rounded text-xs hover:border-[#9ca3af] transition-colors"
            style={{ fontFamily: "Orbitron, monospace" }}
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#b7410e] text-white font-bold py-2 rounded text-xs hover:brightness-110 transition-all"
            style={{ fontFamily: "Orbitron, monospace" }}
          >
            LOG OUT
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}