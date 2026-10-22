import { useMutation } from "@tanstack/react-query";
import {
  getImageUploadUrl,
  uploadFileToPresignedUrl,
} from "../api/image.service";
import type { UploadImageVariables } from "@/features/images/types";

export function useUploadImageMutation() {
  return useMutation({
    mutationFn: async ({ file, folder = "meetings" }: UploadImageVariables) => {
      const { presignedUrl, publicUrl } = await getImageUploadUrl({
        fileName: file.name,
        contentType: file.type,
        folder,
      });

      await uploadFileToPresignedUrl(presignedUrl, file);

      return publicUrl;
    },
  });
}
