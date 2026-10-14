export interface ImageUploadRequest {
  fileName: string;
  contentType: string;
  folder: string;
}

export interface ImageUploadResponse {
  presignedUrl: string;
  publicUrl: string;
}
