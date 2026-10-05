import { api } from "@/lib/api/api";
import { ImageUploadRequest, ImageUploadResponse } from "../types";

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

export const getImageUploadUrl = async (
  payload: ImageUploadRequest,
): Promise<ImageUploadResponse> => {
  return api
    .post(`${TEAM_ID}/images`, { json: payload })
    .json<ImageUploadResponse>();
};

// presignedUrl은 우리 백엔드가 아니라 스토리지(S3 등)로 직접 요청해야 하므로
// prefix가 우리 서버로 고정된 ky 인스턴스(api)를 쓰지 않고 순수 fetch를 사용합니다.
export const uploadFileToPresignedUrl = async (
  presignedUrl: string,
  file: File,
): Promise<void> => {
  const res = await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!res.ok) {
    throw new Error("이미지 업로드에 실패했습니다.");
  }
};
