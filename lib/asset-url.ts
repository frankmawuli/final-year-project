import { BASE_URL } from "@/lib/api-client"

export function resolveAssetUrl(value: string | null | undefined): string | null {
  if (!value) return null

  try {
    const url = new URL(value, BASE_URL)
    const apiOrigin = new URL(BASE_URL).origin

    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      url.protocol = new URL(apiOrigin).protocol
      url.host = new URL(apiOrigin).host
    }

    return url.toString()
  } catch {
    return value
  }
}