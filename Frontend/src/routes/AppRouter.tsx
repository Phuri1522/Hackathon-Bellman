import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "../contexts/AuthContext"
import LoginPage from "../pages/SignIn"
import CreateAcc1 from "../pages/SignUpRole"
import CreateAcc2user from "../pages/SignUpUser"
import CreateAcc2hunter from "../pages/SignUpHunter"
import HomePage from "../pages/HomePage"
import NotFoundPage from "../pages/NotFoundPage"
import ProtectedRoute from "../components/ProtectedRoute"
import CreatePost from "../modules/MutantHuntingRequestSystem/pages/CreatePost"
import HuntRoomDetails from "../modules/MutantHuntingRequestSystem/pages/HuntRoomDetails"

export default function AppRouter() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/step-1" element={<CreateAcc1 />} />
        <Route path="/register/step-2-user" element={<CreateAcc2user />} />
        <Route path="/register/step-2-hunter" element={<CreateAcc2hunter />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["User", "Hunter"]}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/create-post"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/hunt-details"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <HuntRoomDetails />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  )
}
