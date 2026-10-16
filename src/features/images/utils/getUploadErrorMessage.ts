export const getUploadErrorMessage = (error: Error) => {
  const { code, status } = error as { code?: string; status?: number };

  if (status === 401) return "인증이 필요합니다."; // 로그인 안전장치가 별도로 있으므로 안내 생략
  if (code === "INVALID_FILE_TYPE") return "지원하지 않는 파일 형식입니다.";
  return "이미지 업로드에 실패했습니다. 다시 시도해주세요.";
};
