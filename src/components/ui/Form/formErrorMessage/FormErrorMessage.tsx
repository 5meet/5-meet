// 폼 내부 input에서 사용할 공통 에러 메세지입니다.
// 이메일 형식이 틀리거나 비밀번호 최소 길이가 부족한 경우 등 검증에 실패할 경우 input 밑에 메세지를 보여줍니다.
interface FormErrorMessageProps {
  message?: string;
}

export default function FormErrorMessage({
  message,
}: FormErrorMessageProps) {
  return (
    <div className="mt-1.5 min-h-5 text-[13px]">
      {message && (
        <p className="text-error-100">
          {message}
        </p>
      )}
    </div>
  );
}