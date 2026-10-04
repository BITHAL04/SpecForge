import { API_URL } from "@/lib/api/client";

async function proxyRequest(request: Request, pathSegments: string[]) {
  if (API_URL.startsWith("/")) {
    return new Response(
      JSON.stringify({
        detail: "Backend URL is not configured. Set API_URL or NEXT_PUBLIC_API_URL in Vercel before deploying.",
      }),
      {
        status: 503,
        headers: { "content-type": "application/json" },
      },
    );
  }

  const targetUrl = new URL(pathSegments.join("/"), `${API_URL.replace(/\/$/, "")}/`);
  const incomingUrl = new URL(request.url);
  targetUrl.search = incomingUrl.search;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");

  const method = request.method.toUpperCase();
  const body = method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();

  const upstreamResponse = await fetch(targetUrl, {
    method,
    headers,
    body,
  });

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("transfer-encoding");
  responseHeaders.delete("connection");

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function POST(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function PUT(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function PATCH(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function DELETE(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function OPTIONS(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}