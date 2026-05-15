import { apiClient } from "./client";
import { clearTokens, setTokens } from "@/lib/auth/session";
import type { User } from "@specforge/shared";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export async function register(email: string, password: string, name: string) {
  const data = await apiClient<TokenResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function login(email: string, password: string) {
  const data = await apiClient<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function clerkAuth(email: string, clerkId: string, name: string) {
  const data = await apiClient<TokenResponse>("/auth/clerk", {
    method: "POST",
    body: JSON.stringify({ email, clerk_id: clerkId, name }),
  });
  setTokens(data.access_token, data.refresh_token);
  return data;
}


export async function getMe(): Promise<User> {
  return apiClient<User>("/auth/me");
}

export function logout() {
  clearTokens();
}
