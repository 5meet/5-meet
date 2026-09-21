// 단순 alert 내용을 보여주는 공통 컴포넌트입니다.

import { Button } from "@/components/ui/Button/Button";
import { Modal } from "@/components/ui/Modal/Modal";

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function AlertModal({
  isOpen,
  message,
  onClose,
}: AlertModalProps) {
  return (
    <Modal isOpen={isOpen}>
      <Modal.Header onClose={onClose} />

      <Modal.Body>
        <p className="text-center text-gray-800 font-bold">{message}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button type="button" fullWidth onClick={onClose}>
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
