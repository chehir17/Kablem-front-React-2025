import { JSX } from "react";
import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  children: JSX.Element;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const userData = localStorage.getItem("userData");
  const user = userData ? JSON.parse(userData) : null;

  if (!user || user.role !== "admin") {
    return <Navigate to="/error-500" replace />;
  }

  return children;
};

export default AdminRoute;
