const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://specforge-api.up.railway.app/api/v1"
    : "http://localhost:8000/api/v1");

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function parseErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const detail = (body as { detail?: unknown }).detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg ?? String(d)).join(", ");
  return fallback;
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return null;

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refresh }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { access_token: string; refresh_token: string };
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  return data.access_token;
}

export async function apiClient<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && retry && typeof window !== "undefined") {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiClient<T>(path, options, false);
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, parseErrorMessage(body, res.statusText));
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function authFetch(path: string, options: RequestInit = {}, retry = true): Promise<Response> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && retry && typeof window !== "undefined") {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return authFetch(path, options, false);
    }
  }

  return res;
}

export { API_URL };
