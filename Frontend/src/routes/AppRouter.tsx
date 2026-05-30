import { Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "../components/ProtectedRoute";
import CreatePost from "../modules/MutantHuntingRequestSystem/pages/CreatePost";
import HuntRoomDetails from "../modules/MutantHuntingRequestSystem/pages/HuntRoomDetails";


export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/user/create-post" replace />} />

      <Route
        path="/user/create-post"
        element={<CreatePost />}
      />

      <Route
        path="/user/hunt-details"
        element={<HuntRoomDetails />}
      />
    </Routes>
  );
}