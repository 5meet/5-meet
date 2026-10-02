/**프로젝트 전반에 사용할 basemodal 컴포넌트 입니다. */

import { ModalHeader } from "./ModalHeader";
import { ModalTitle } from "./ModalTitle";
import { ModalBody } from "./ModalBody";
import { ModalFooter } from "./ModalFooter";

export type ModalSize = "md" | "lg" | "xl";

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  size?: ModalSize;
}

const sizeStyles: Record<ModalSize, string> = {
  md: "max-w-sm",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export const ModalRoot = ({ isOpen, children, size = "md" }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/50" />

      {/* 모달 영역 */}
      <section
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full rounded-3xl bg-gray-50 pt-6
        ${sizeStyles[size]}`}
      >
        {children}
      </section>
    </div>
  );
};

export const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Title: ModalTitle,
  Body: ModalBody,
  Footer: ModalFooter,
});
