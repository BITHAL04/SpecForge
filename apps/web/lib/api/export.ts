import { authFetch, ApiError } from "./client";

function parseFilename(disposition: string | null, fallback: string): string {
  const match = disposition?.match(/filename="([^"]+)"/);
  return match?.[1] ?? fallback;
}

export async function downloadProjectExport(
  projectId: string,
  format: "zip" | "markdown" | "pdf" = "zip",
): Promise<void> {
  const res = await authFetch(`/projects/${projectId}/export?format=${format}`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = (body as { detail?: string }).detail;
    throw new ApiError(res.status, typeof detail === "string" ? detail : res.statusText);
  }

  const blob = await res.blob();
  const ext = format === "markdown" ? "md" : format;
  const filename = parseFilename(res.headers.get("Content-Disposition"), `export.${ext}`);

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
