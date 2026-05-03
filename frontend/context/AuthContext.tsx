import React, { createContext, useContext, useState } from "react";

/**
 * AuthContext — placeholder for future JWT authentication.
 *
 * When authentication is implemented:
 * - Store the JWT token here after login
 * - Expose login() / logout() methods
 * - Pass the token to the API service via axios interceptors
 */

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  const login = (newToken: string) => setToken(newToken);
  const logout = () => setToken(null);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!token, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
