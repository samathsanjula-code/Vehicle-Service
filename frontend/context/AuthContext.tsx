import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { API } from "../constants/api";

type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isAdmin?: boolean;
  loyaltyPoints?: number;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const router = useRouter();

  // Load session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          // Add a 5s timeout to prevent infinite loading if backend is unreachable
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          const res = await fetch(`${API.auth}/me`, {
            headers: { Authorization: `Bearer ${storedToken}` },
            signal: controller.signal
          }).finally(() => clearTimeout(timeoutId));

          if (res.ok) {
            const data = await res.json();
            setToken(storedToken);
            setUser(data.user); // Take the nested user object
          } else {
            console.warn("Session invalid, clearing token");
            await AsyncStorage.removeItem("token");
          }
        }
      } catch (e: any) {
        if (e.name === 'AbortError') {
          console.error("Auth request timed out. Check if backend is running and IP is correct.");
        } else {
          console.error("Session load error:", e);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  const login = async (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    await AsyncStorage.setItem("token", newToken);
  };

  const logout = async () => {
    // Clear state first to stop background fetches
    setToken(null);
    setUser(null);
    
    // Clear storage
    await AsyncStorage.removeItem("token");
    
    // Redirect to login immediately
    router.replace("/(auth)/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
