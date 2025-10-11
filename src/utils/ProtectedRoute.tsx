import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // Vérifie s'il y a un token ou des infos utilisateur
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("userData");

  // Si rien de tout ça → redirection vers login
  if (!token || !userData) {
    return <Navigate to="/" replace />;
  }

  // Sinon on laisse accéder aux routes enfants
  return <Outlet />;
}