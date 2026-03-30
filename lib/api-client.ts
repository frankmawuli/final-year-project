const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"

// ── Core request ──────────────────────────────────────────────────────────────
type ApiOptions = Omit<RequestInit, "body"> & { body?: unknown }

async function request<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, headers: extra, ...rest } = options

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(extra as Record<string, string>),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }))
    throw new ApiError(res.status, err?.message ?? "Request failed", err?.error)
  }

  const text = await res.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

// ── Custom error class ────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public detail?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// ── Convenience API ───────────────────────────────────────────────────────────
export const api = {
  get<T>(path: string, headers?: Record<string, string>) {
    return request<T>(path, { method: "GET", headers })
  },
  post<T>(path: string, body?: unknown, headers?: Record<string, string>) {
    return request<T>(path, { method: "POST", body, headers })
  },
  patch<T>(path: string, body?: unknown, headers?: Record<string, string>) {
    return request<T>(path, { method: "PATCH", body, headers })
  },
  delete<T>(path: string, headers?: Record<string, string>) {
    return request<T>(path, { method: "DELETE", headers })
  },
  /** Multipart upload — do NOT set Content-Type (browser sets boundary). */
  async upload<T>(path: string, formData: FormData): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      body: formData,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Upload failed" }))
      throw new ApiError(res.status, err?.message ?? "Upload failed")
    }
    return res.json() as Promise<T>
  },
}
