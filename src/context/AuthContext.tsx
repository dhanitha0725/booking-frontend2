import React, { createContext, useState, useEffect } from "react";
import { authService } from "../services/api";
import { decodeToken } from "../utils/token";
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

      localStorage.setItem("authToken", response.token);
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  const hasRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.map((r) => r.toLowerCase()).includes(user.role.toLowerCase());
  };

  const getDefaultRoute = (role: string): string => {
    switch (role.toLowerCase()) {
      case "admin":
        return "/admin/dashboard";
      case "employee":
        return "/admin/dashboard";
      case "accountant":
        return "/admin/reports";
      case "customer":
        return "/home";
      default:
        return "/";
    }
  };

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

      // Define public and admin routes
      const publicRoutes = ["/", "/login", "/signup"];
      const adminRoutes = [
        "/admin",
        "/admin/dashboard",
        "/admin/staff",
        "/admin/facilities",
      ];

      // Redirect only if the user is on a public route
      if (publicRoutes.includes(window.location.pathname)) {
        navigate(getDefaultRoute(user.role));
      }

      // Prevent redirection if the user is already on a valid admin route
      if (
        user.role === "admin" &&
        adminRoutes.includes(window.location.pathname)
      ) {
        return;
      }
    } catch (error) {
      console.error("Token decode error:", error);
      logout();
    }
  }, [navigate]);

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
