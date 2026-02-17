import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../services/api.jsx";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      setUser(JSON.parse(saved));
      setIsAuthenticated(true);
    }
    setReady(true);
  }, []);

  const login = async (credentials) => {
    console.log("Login called with credentials:", credentials);
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: credentials,
    });

    const authData = {
      auth_key: data?.auth_key,
      role: data?.role,
      userId: data?.userId,
    };

    setUser(authData);
    setIsAuthenticated(true);
    localStorage.setItem("auth", JSON.stringify(authData));
  };

  const register = async (userData) => {
    console.log("Register called with data:", userData);
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: userData,
    });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, ready, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}