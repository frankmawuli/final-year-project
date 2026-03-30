import { api } from "@/lib/api-client"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UploadResponse {
  url: string
  publicId: string
  message?: string
}

// ── Service ───────────────────────────────────────────────────────────────────
export const uploadService = {
  /**
   * Upload an image file to Cloudinary via the backend.
   * Returns the Cloudinary URL and public ID.
   */
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append("image", file)
    const raw = await api.upload<unknown>("/upload", formData)
    const r = raw as Record<string, unknown>
    if (r.data && typeof r.data === "object") {
      return r.data as UploadResponse
    }
    return raw as UploadResponse
  },
}
