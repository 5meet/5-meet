export type ImageUploadFolder = "meetings" | "users" | "posts";

export interface ImageUploadRequest {
  fileName: string;
  contentType: string;
  folder: ImageUploadFolder;
}

export interface ImageUploadResponse {
  presignedUrl: string;
  publicUrl: string;
}
