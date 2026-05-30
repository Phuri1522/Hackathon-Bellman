import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/SignIn";
import CreateAcc1 from "../pages/SignUpRole";
import CreateAcc2user from "../pages/SignUpUser";
import CreateAcc2hunter from "../pages/SignUpHunter";
import UserHome from "../pages/UserHome";
import HunterHome from "../pages/HunterHome";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/step-1" element={<CreateAcc1 />} />
        <Route path="/register/step-2-user" element={<CreateAcc2user />} />
        <Route path="/register/step-2-hunter" element={<CreateAcc2hunter />} />
        <Route path="/UserHome" element={<UserHome />} />
        <Route path="/HunterHome" element={<HunterHome />} />
      </Routes>
    </BrowserRouter>
  );
}