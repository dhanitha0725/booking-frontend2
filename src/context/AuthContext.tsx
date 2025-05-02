// this file is responsible for managing authentication state
// and providing authentication-related functions to the rest of the application.

import React, { createContext, useState, useEffect } from "react";
import { authService } from "../services/api"; // Import the authService for API calls
import { decodeToken } from "../utils/token"; // Import the decodeToken function to decode JWT tokens
import { useNavigate } from "react-router-dom";

interface User {
  userId: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Function to handle user login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(email, password);
      const decoded = decodeToken(response.token);

      const user = {
        userId: String(
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ]
        ),
        email: String(decoded.sub),
        role: String(
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ]
        ),
      };

      // Store the token in local storage for future use
      localStorage.setItem("authToken", response.token);
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Function to handle user logout
  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  // Function to check if the user has a specific role
  const hasRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.map((r) => r.toLowerCase()).includes(user.role.toLowerCase());
  };

  // Function to get the default route based on user role
  const getDefaultRoute = (role: string): string => {
    switch (role.toLowerCase()) {
      case "admin":
        return "/admin/staff";
      case "employee":
        return "/employee/dashboard";
      case "accountant":
        return "/admin/reports";
      case "customer":
        return "/home";
      default:
        return "/";
    }
  };

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const decoded = decodeToken(token);
      const user = {
        userId:
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ],
        email: decoded.sub,
        role: decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
      };
      setIsAuthenticated(true);
      setUser(user);

      // Define public routes
      const publicRoutes = ["/", "/home", "/facilities", "/login", "/signup"];

      // Define admin routes
      const adminRoutes = [
        "/admin/staff",
        "/admin/facilities-management",
        "/admin/customers-management",
      ];
      // define employee routes
      const employeeRoutes = [
        "/employee/dashboard",
        "/employee/reservations",
        "/employee/notifications",
      ];

      const currentPath = window.location.pathname;

      // Determine if redirection is needed
      const shouldRedirect =
        (publicRoutes.includes(currentPath) &&
          user.role.toLowerCase() !== "customer") || // Non-customer on public route
        (currentPath.startsWith("/admin") &&
          !adminRoutes.includes(currentPath) &&
          user.role.toLowerCase() !== "admin" &&
          user.role.toLowerCase() !== "accountant") || // Non-admin/accountant on admin route
        (currentPath.startsWith("/employee") &&
          !employeeRoutes.includes(currentPath) &&
          user.role.toLowerCase() !== "employee"); // Non-employee on employee route

      if (shouldRedirect) {
        navigate(getDefaultRoute(user.role));
      }
    } catch (error) {
      console.error("Token decode error:", error);
      logout();
    }
  }, [navigate]);

  // Provide the authentication context to children components
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
