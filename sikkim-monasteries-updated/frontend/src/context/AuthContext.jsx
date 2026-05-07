// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, register as apiRegister } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // { username, email, role }
  const [loading, setLoading] = useState(true);  // true while restoring session

  // ── Restore session from localStorage on page reload ──────────
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  // ── Register → auto-login ──────────────────────────────────────
  const register = async ({ username, email, password }) => {
    const data = await apiRegister({ username, email, password });
    localStorage.setItem("token", data.token);
    const userInfo = { username: data.username, email: data.email, role: data.role };
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
    return data;
  };

  // ── Login ──────────────────────────────────────────────────────
  const login = async ({ email, password }) => {
    const data = await apiLogin({ email, password });
    localStorage.setItem("token", data.token);
    const userInfo = { username: data.username, email: data.email, role: data.role };
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
    return data;
  };

  // ── Logout ─────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Custom hook ────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
