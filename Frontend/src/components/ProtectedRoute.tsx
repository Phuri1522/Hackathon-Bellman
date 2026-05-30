// src/components/ProtectedRoute.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("User" | "Hunter")[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  // If user didn't login yet navigate user to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  //if user role not match with the permission then throw user back to the right page
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "Hunter" ? "/hunter/home" : "/user/home"} replace />;
  }

  return <>{children}</>;
}