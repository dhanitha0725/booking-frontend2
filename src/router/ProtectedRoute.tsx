// responsible for protecting routes based on user authentication and roles
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

// This component checks if the user is authenticated and has the required roles to access a route.
// If not, it redirects them to the login page or a different route based on their authentication status.
interface ProtectedRouteProps {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
