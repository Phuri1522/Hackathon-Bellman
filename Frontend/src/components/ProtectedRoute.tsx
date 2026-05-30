import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface Props {
  children: React.ReactNode
  allowedRoles: ("User" | "Hunter")[]
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const role = user?.accountType === "HUNTER" ? "Hunter" : "User"
  if (!allowedRoles.includes(role)) return <Navigate to="/login" replace />

  return <>{children}</>
}