import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function ProtectedRoute() {
  const { user, ready } = useAuth();
  console.log("ProtectedRoute - Authenticated user:", user);

  if (!ready) return null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
