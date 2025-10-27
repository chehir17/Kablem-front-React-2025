import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {

  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("userData");


  if (!token || !userData) {
    return <Navigate to="/" replace />;
  }


  return <Outlet />;
}