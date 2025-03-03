import React, { createContext, useContext, useState, useEffect } from "react";

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (token) {
      setIsAuthenticated(true);
      setUser(userData ? JSON.parse(userData) : null);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:5162/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      const loggedInUser = {
        userId: data.userId,
        email: data.email,
        role: data.role,
      };

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setIsAuthenticated(true);
      setUser(loggedInUser);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
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
