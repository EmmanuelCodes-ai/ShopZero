"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN" | "SUPPORT";
  storeName?: string;
  storeSlug?: string;
  membership?: string;
  walletBalance?: string;
  ordersCount?: number;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string, role?: "CUSTOMER" | "VENDOR") => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    phone: string,
    pass: string,
    role: "CUSTOMER" | "VENDOR",
    storeName?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load authenticated session on mount from HttpOnly server cookie
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();
        if (data.authenticated && data.user) {
          const u: UserProfile = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            role: data.user.role,
            storeName: data.user.storeName,
            storeSlug: data.user.storeSlug,
            membership: data.user.role === "VENDOR" ? "Verified Merchant" : "Gold Member",
            walletBalance: data.user.role === "VENDOR" ? "₦158,000.00" : "₦24,500.00",
            ordersCount: data.user.role === "VENDOR" ? 34 : 12,
          };
          setUser(u);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to check auth session:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkSession();
  }, []);

  const login = async (
    email: string,
    pass: string,
    role: "CUSTOMER" | "VENDOR" = "CUSTOMER"
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password: pass, role }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        const u: UserProfile = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          role: data.user.role,
          storeName: data.user.storeName,
          storeSlug: data.user.storeSlug,
          membership: data.user.role === "VENDOR" ? "Verified Merchant" : "Gold Member",
          walletBalance: data.user.role === "VENDOR" ? "₦158,000.00" : "₦24,500.00",
          ordersCount: data.user.role === "VENDOR" ? 34 : 12,
        };
        setUser(u);
        return { success: true };
      }

      return { success: false, error: data.error || "Login failed" };
    } catch (err: any) {
      return { success: false, error: "Network error during login." };
    }
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    pass: string,
    role: "CUSTOMER" | "VENDOR",
    storeName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          email,
          password: pass,
          phone,
          displayName: name,
          role,
          storeName,
        }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        const u: UserProfile = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          role: data.user.role,
          storeName: data.user.storeName,
          storeSlug: data.user.storeSlug,
          membership: data.user.role === "VENDOR" ? "Verified Merchant" : "Silver Member",
          walletBalance: data.user.role === "VENDOR" ? "₦0.00" : "₦2,000.00",
          ordersCount: 0,
        };
        setUser(u);
        return { success: true };
      }

      return { success: false, error: data.error || "Registration failed" };
    } catch (err: any) {
      return { success: false, error: "Network error during registration." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
