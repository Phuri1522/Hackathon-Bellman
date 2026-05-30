import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

import LoginPage from "../pages/SignIn";
import CreateAcc1 from "../pages/SignUpRole";
import CreateAcc2user from "../pages/SignUpUser";
import CreateAcc2hunter from "../pages/SignUpHunter";

import HomeUser from "../pages/UserHome";
import CreatePost from "../pages/CreatePost";
import UserDetails from "../pages/HuntRoomDetails";

import HomeHunter from "../pages/HunterHome";

import NotFoundPage from "../pages/NotFoundPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/step-1" element={<CreateAcc1 />} />
          <Route path="/register/step-2-user" element={<CreateAcc2user />} />
          <Route path="/register/step-2-hunter" element={<CreateAcc2hunter />} />

          {/* User Only */}
          <Route
            path="/user/home"
            element={<HomeUser />}
            // element={
            //   <ProtectedRoute allowedRoles={["User"]}>
            //     <HomeUser />
            //   </ProtectedRoute>
            // }
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
            path="/user/details"
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <UserDetails />
              </ProtectedRoute>
            }
          />

          {/* Hunter Only */}
          <Route
            path="/hunter/home"
            element={<HomeHunter />}
            // element={
            //   <ProtectedRoute allowedRoles={["Hunter"]}>
            //     <HomeHunter />
            //   </ProtectedRoute>
            // }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}