import { api } from "@/lib/api-client"

export interface DocumentUploadData {
  url:      string
  publicId: string
  name:     string
  size:     number
  mimetype: string
}

export interface ImageUploadData {
  url:      string
  publicId: string
}

export const uploadService = {
  /** POST /upload/document — field name: "file" */
  document: async (file: File, token: string) => {
    const fd = new FormData()
    fd.append("file", file)
    return api
      .upload<{ success: boolean; data: DocumentUploadData }>("/upload/document", fd, {
        Authorization: `Bearer ${token}`,
      })
      .then((res) => res.data)
  },

  /** POST /upload/image — field name: "image" */
  image: async (file: File, token: string) => {
    const fd = new FormData()
    fd.append("image", file)
    return api
      .upload<{ success: boolean; data: ImageUploadData }>("/upload/image", fd, {
        Authorization: `Bearer ${token}`,
      })
      .then((res) => res.data)
  },
}
