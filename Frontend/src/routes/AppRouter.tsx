import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "../components/ProtectedRoute";

import LoginPage from "../pages/SignIn";
import CreateAcc1 from "../pages/SignUpRole";
import CreateAcc2user from "../pages/SignUpUser";
import CreateAcc2hunter from "../pages/SignUpHunter";
import UserHome from "../pages/UserHome";
import HunterHome from "../pages/HunterHome";
import CreatePost from "../modules/MutantHuntingRequestSystem/pages/CreatePost";
import HuntRoomDetails from "../modules/MutantHuntingRequestSystem/pages/HuntRoomDetails";

export default function AppRouter() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/step-1" element={<CreateAcc1 />} />
        <Route path="/register/step-2-user" element={<CreateAcc2user />} />
        <Route path="/register/step-2-hunter" element={<CreateAcc2hunter />} />
        <Route path="/UserHome" element={<UserHome />} />
        <Route path="/HunterHome" element={<HunterHome />} />
        <Route path="/" element={<Navigate to="/user/create-post" replace />} />
        <Route path="/user/create-post" element={<CreatePost />}/>
        <Route path="/user/hunt-details"element={<HuntRoomDetails />}/>
      </Routes>
  );
}