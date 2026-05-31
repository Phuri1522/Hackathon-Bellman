import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth()
  const targetPath = isAuthenticated ? "/home" : "/login"
  const label = isAuthenticated ? "Back Home" : "Back to Login"

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-[#e5e7eb]">
      <section className="w-full max-w-md rounded border border-[#2d3748] bg-[#0f1115] p-8 text-center shadow-[0_0_24px_rgba(57,255,20,0.12)]">
        <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[#39ff14]">
          404
        </p>
        <h1
          className="mb-4 text-3xl font-bold text-[#39ff14]"
          style={{ fontFamily: "Orbitron, monospace" }}
        >
          404 — Signal Lost
        </h1>
        <p className="mb-8 text-sm text-[#9ca3af]">
          Route not found in the apocalypse network.
        </p>
        <Link
          to={targetPath}
          className="inline-flex h-11 items-center justify-center rounded border border-[#39ff14] px-5 text-sm font-semibold text-[#39ff14] transition-colors hover:bg-[#39ff14] hover:text-black"
        >
          {label}
        </Link>
      </section>
    </main>
  )
}
