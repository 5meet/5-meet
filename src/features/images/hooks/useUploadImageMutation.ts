import { useMutation } from "@tanstack/react-query";
import {
  getImageUploadUrl,
  uploadFileToPresignedUrl,
} from "../api/image.service";

export function useUploadImageMutation() {
  return useMutation({
    mutationFn: async (file: File) => {
      const { presignedUrl, publicUrl } = await getImageUploadUrl({
        fileName: file.name,
        contentType: file.type,
        folder: "meetings",
      });

      await uploadFileToPresignedUrl(presignedUrl, file);

      return publicUrl;
    },
  });
}
