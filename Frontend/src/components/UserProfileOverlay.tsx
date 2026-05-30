import { useState } from "react"
import { createPortal } from "react-dom"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import AvatarUpload from "./AvatarUpload"

interface User {
  id?: number
  name: string
  email: string
  avatarUrl?: string
}

interface Props {
  user: User
  onClose: () => void
  onAvatarUpdate?: (url: string) => void
}

export default function UserProfileOverlay({ user, onClose, onAvatarUpdate }: Props) {
  const { login, token } = useAuth()
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAvatarChange = (file: File, previewUrl: string) => {
    setSelectedFile(file)
    setAvatarPreview(previewUrl)
    setError("")
  }

  const handleUpload = async () => {
    if (!selectedFile || !user.id) return
    setLoading(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("avatar", selectedFile)
      const res = await api.patch(`/api/users/${user.id}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      const newUrl = res.data.avatarUrl
      setAvatarPreview(newUrl)
      onAvatarUpdate?.(newUrl)

      // update localStorage
      const savedUser = JSON.parse(localStorage.getItem("user") ?? "{}")
      const updated = { ...savedUser, avatarUrl: newUrl }
      localStorage.setItem("user", JSON.stringify(updated))
      if (token) login(token, updated)

      setIsEditing(false)
      setSelectedFile(null)
    } catch {
      setError("Upload failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSelectedFile(null)
    setAvatarPreview(user.avatarUrl)
    setError("")
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0f1115] border border-[#2d3748] rounded-xl w-full max-w-sm p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[#9ca3af] hover:text-[#e5e7eb] text-lg">✕</button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#2d3748] border-2 border-[#39ff14] overflow-hidden flex items-center justify-center mb-2">
            {avatarPreview
              ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              : <span className="text-[#39ff14] text-3xl">👤</span>
            }
          </div>
          <p className="text-[#9ca3af] text-xs" style={{ fontFamily: "Fira Code, monospace" }}>USER</p>
        </div>

        {!isEditing ? (
          <div className="flex flex-col gap-3">
            {[{ label: "NAME", value: user.name }, { label: "EMAIL", value: user.email }].map((item) => (
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
            <AvatarUpload preview={avatarPreview} accentColor="#39ff14" onFileChange={handleAvatarChange} />
            {error && <p className="text-[#b7410e] text-xs text-center" style={{ fontFamily: "Fira Code, monospace" }}>{error}</p>}
            <div className="flex gap-2">
              <button onClick={handleCancel}
                className="flex-1 border border-[#2d3748] text-[#9ca3af] font-bold py-2 rounded text-xs"
                style={{ fontFamily: "Orbitron, monospace" }}>CANCEL</button>
              <button onClick={handleUpload} disabled={!selectedFile || loading}
                className="flex-1 bg-[#39ff14] text-black font-bold py-2 rounded text-xs hover:brightness-110 disabled:opacity-50"
                style={{ fontFamily: "Orbitron, monospace" }}>
                {loading ? "UPLOADING..." : "UPLOAD"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}