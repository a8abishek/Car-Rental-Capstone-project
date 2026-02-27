import { Navigate, useLocation } from "react-router";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Check which dashboard user is trying to access
    if (location.pathname.startsWith("/dealer")) {
      return <Navigate to="/dealer/login" replace />;
    }

    if (location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/login" replace />;
    }

    // Default → customer
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
