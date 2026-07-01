"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  provider: "email" | "google";
  planStatus?: "free" | "pro";
  freeScansUsed?: number;
  freeScanLimit?: number;
};

type AuthResponse = {
  token: string;
  user: AuthUser;
};

type AuthContextValue = {
  isReady: boolean;
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  completeOAuthLogin: (token: string, user: Pick<AuthUser, "name" | "email">) => void;
  logout: () => void;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const AUTH_TOKEN_KEY = "skinorai_auth_token";
const AUTH_USER_KEY = "skinorai_auth_user";
const SERVER_AUTH_SNAPSHOT = "__server__";

const AuthContext = createContext<AuthContextValue | null>(null);
const authStoreListeners = new Set<() => void>();

async function postAuth(path: string, body: unknown): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = "Authentification impossible pour le moment.";

    try {
      const errorBody = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(errorBody.message)) {
        message = errorBody.message.join(" ");
      } else if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // Keep the friendly default when the backend does not return JSON.
    }

    throw new Error(message);
  }

  return response.json() as Promise<AuthResponse>;
}

function notifyAuthStoreListeners() {
  authStoreListeners.forEach((listener) => listener());
}

function subscribeAuthStore(listener: () => void) {
  authStoreListeners.add(listener);

  const handleStorage = () => listener();
  window.addEventListener("storage", handleStorage);

  return () => {
    authStoreListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function getAuthStoreSnapshot() {
  if (typeof window === "undefined") {
    return SERVER_AUTH_SNAPSHOT;
  }

  return JSON.stringify({
    token: localStorage.getItem(AUTH_TOKEN_KEY),
    user: localStorage.getItem(AUTH_USER_KEY),
  });
}

function parseAuthStoreSnapshot(snapshot: string) {
  if (snapshot === SERVER_AUTH_SNAPSHOT) {
    return { isReady: false, token: null, user: null };
  }

  try {
    const parsed = JSON.parse(snapshot) as { token?: string | null; user?: string | null };

    if (!parsed.token || !parsed.user) {
      return { isReady: true, token: null, user: null };
    }

    return {
      isReady: true,
      token: parsed.token,
      user: JSON.parse(parsed.user) as AuthUser,
    };
  } catch {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    return { isReady: true, token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authSnapshot = useSyncExternalStore(
    subscribeAuthStore,
    getAuthStoreSnapshot,
    () => SERVER_AUTH_SNAPSHOT
  );
  const { isReady, token, user } = useMemo(() => parseAuthStoreSnapshot(authSnapshot), [authSnapshot]);

  const persistAuth = useCallback((nextToken: string, nextUser: AuthUser) => {
    localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    notifyAuthStoreListeners();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await postAuth("/api/auth/login", { email, password });
      persistAuth(response.token, response.user);
    },
    [persistAuth]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const response = await postAuth("/api/auth/register", { name, email, password });
      persistAuth(response.token, response.user);
    },
    [persistAuth]
  );

  const completeOAuthLogin = useCallback(
    (nextToken: string, nextUser: Pick<AuthUser, "name" | "email">) => {
      persistAuth(nextToken, {
        id: "google",
        name: nextUser.name,
        email: nextUser.email,
        provider: "google",
      });
    },
    [persistAuth]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    notifyAuthStoreListeners();
  }, []);

  const value = useMemo(
    () => ({
      isReady,
      token,
      user,
      login,
      register,
      completeOAuthLogin,
      logout,
    }),
    [completeOAuthLogin, isReady, login, logout, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

export function getStoredAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export { API_BASE_URL };

