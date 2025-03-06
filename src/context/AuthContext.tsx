import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";
import { decodeToken } from "../utils/token";
import { useNavigate } from "react-router-dom";

interface User {
  userId: number;
  email: string;
  role: string;
}

// functionalities that the context provides
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded = decodeToken(token);
        const user = {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        };
        setIsAuthenticated(true);
        setUser(user);

        //redirect based on the role
        const path = window.location.pathname;
        if (path === "/" || path === "/login") {
          const defaultRoute = getDefaultRoute(user.role);
          navigate(defaultRoute);
        }
      } catch (error) {
        console.error("Token decode error:", error);
        logout();
      }
    }
  }, [navigate]);

  const getDefaultRoute = (role: string | undefined): string => {
    if (!role) return "/";

    switch (role.toLowerCase()) {
      case "admin":
        return "/admin/dashboard";
      case "employee":
        return "/employee/dashboard";
      case "accountant":
        return "/accountant/dashboard";
      case "hostel":
        return "/hostel/dashboard";
      case "customer":
        return "/customer/dashboard";
      default:
        return "/";
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(email, password);
      const decoded = decodeToken(response.token); //decode token
      const user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      navigate(getDefaultRoute(user.role)); //redirect based on the role after login
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  // makes auth data and functions available to all child components
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
