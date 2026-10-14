import { useMutation } from "@tanstack/react-query";
import {
  getImageUploadUrl,
  uploadFileToPresignedUrl,
} from "../api/image.service";
import { showToast } from "@/components/ui/Sonner";
import { AppError } from "@/lib/api/type";

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
    onError: (error) => {
      const code = (error as AppError).code;
      if (code === "INVALID_FILE_TYPE") {
        showToast({ kind: "error", message: "지원하지 않는 파일 형식입니다." });
        return;
      }
      showToast({ kind: "error", message: (error as Error).message });
    },
  });
}
