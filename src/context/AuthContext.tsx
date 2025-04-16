import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";
import { decodeToken } from "../utils/token";
import { useNavigate } from "react-router-dom";

interface User {
  userId: number;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const decoded = decodeToken(token);
      const user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
      setIsAuthenticated(true);
      setUser(user);

      // Redirect if on public page
      if (["/", "/login"].includes(window.location.pathname)) {
        navigate(getDefaultRoute(user.role));
      }
    } catch (error) {
      console.error("Token decode error:", error);
      logout();
    }
  }, [navigate]);

  const getDefaultRoute = (role: string): string => {
    switch (role.toLowerCase()) {
      case "admin":
        return "/admin/dashboard";
      case "employee":
        return "/admin/dashboard";
      case "accountant":
        return "/admin/reports";
      case "customer":
        return "/dashboard";
      default:
        return "/";
    }
  };

  const hasRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.map((r) => r.toLowerCase()).includes(user.role.toLowerCase());
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(email, password);
      const decoded = decodeToken(response.token);
      const user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
