import { Modal } from "@/components/ui/Modal/Modal";
import { Button } from "@/components/ui/Button/Button";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginRequiredModal = ({ isOpen, onClose }: LoginRequiredModalProps) => {
  return (
    <Modal isOpen={isOpen}>
      <Modal.Header onClose={onClose} />

      <Modal.Body>
        <div className="text-center font-bold text-lg">
          로그인이 필요한 서비스입니다.
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          className="flex-1"
          size="sm"
          onClick={onClose}
        >
          취소
        </Button>
        <Button
          className="flex-1"
          onClick={() => {
            // TODO: 로그인 페이지 이동
            onClose();
          }}
          size="sm"
        >
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginRequiredModal;
