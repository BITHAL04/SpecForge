import { apiClient } from "./client";
import { clearTokens, getAccessToken, setTokens } from "@/lib/auth/session";
import type { User } from "@specforge/shared";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

const DEMO_EMAIL = "demo@specforge.io";
const DEMO_PASSWORD = "SpecForge123!";
const DEMO_NAME = "SpecForge Demo";

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

let demoSessionPromise: Promise<void> | null = null;

export async function ensureDemoSession() {
  if (typeof window === "undefined") return;
  if (getAccessToken()) return;

  if (!demoSessionPromise) {
    demoSessionPromise = (async () => {
      try {
        await login(DEMO_EMAIL, DEMO_PASSWORD);
        return;
      } catch {
        // Fall through to registration on first run or after a reset.
      }

      try {
        await register(DEMO_EMAIL, DEMO_PASSWORD, DEMO_NAME);
        return;
      } catch {
        // Account already exists or registration failed; try one last login.
      }

      await login(DEMO_EMAIL, DEMO_PASSWORD);
    })().finally(() => {
      demoSessionPromise = null;
    });
  }

  await demoSessionPromise;
}


export async function getMe(): Promise<User> {
  return apiClient<User>("/auth/me");
}

export function logout() {
  clearTokens();
}
