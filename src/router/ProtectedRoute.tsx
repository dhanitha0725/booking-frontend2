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

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user does not have the required roles, redirect to the home page or a different route
  if (!hasRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
