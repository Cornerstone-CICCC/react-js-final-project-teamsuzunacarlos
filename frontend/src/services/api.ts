// API service (axios instance)
// Should:
// - Create axios instance with base URL
// - Setup interceptors for auth tokens
// - Handle errors globally
// - Setup cookie handling

import { User, AuthResponse } from "../types/index";

const BASE_URL =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:5000/api";

const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

export const authService = {
  register: (data: Record<string, unknown>): Promise<AuthResponse> =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: Record<string, unknown>): Promise<AuthResponse> =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: (): Promise<{ message: string }> =>
    request<{ message: string }>("/auth/logout", {
      method: "POST",
    }),

  getMe: (): Promise<User> =>
    request<User>("/auth/me", {
      method: "GET",
    }),
};
