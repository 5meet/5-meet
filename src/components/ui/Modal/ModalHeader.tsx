import { X } from "lucide-react";

interface ModalHeaderProps {
  children?: React.ReactNode;
  onClose: () => void;
}

// 모달 Header에 닫기 버튼이 있기 때문에 Header에 제목이 없더라도 반드시 Modal.Header는 선언해줘야 합니다.

export const ModalHeader = ({ children, onClose }: ModalHeaderProps) => {
  return (
    <header className="flex items-center justify-between px-8 pt-4 ">
      {children}

      <button
        type="button"
        onClick={onClose}
        aria-label="모달 닫기"
        className="ml-auto flex h-7 w-7 items-center justify-center text-gray-700 cursor-pointer"
      >
        <X size={20} />
      </button>
    </header>
  );
};
