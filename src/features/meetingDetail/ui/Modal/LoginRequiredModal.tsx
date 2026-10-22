"use client";

import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal/Modal";
import { Button } from "@/components/ui/Button/Button";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginRequiredModal = ({ isOpen, onClose }: LoginRequiredModalProps) => {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push("/login");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header onClose={onClose} />

      <Modal.Body>
        <div className="text-center font-bold text-lg md:text-2xl">
          로그인이 필요한 서비스입니다.
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          className="flex-1"
          size="md"
          onClick={onClose}
        >
          취소
        </Button>
        <Button className="flex-1" onClick={handleLogin} size="md">
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginRequiredModal;
