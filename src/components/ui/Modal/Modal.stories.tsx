import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "../Button/Button";

const meta = {
  title: "components/Modal",
  component: Modal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    isOpen: true,
    children: null,
  },
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "모달의 열림/닫힘 상태",
    },
    children: {
      control: false,
      description: "모달 내부 콘텐츠",
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex min-h-125 items-center justify-center">
        <Button onClick={() => setIsOpen(true)}>모달 열기</Button>

        <Modal isOpen={isOpen}>
          <Modal.Header onClose={() => setIsOpen(false)}>
            <Modal.Title>제목입니다.</Modal.Title>
          </Modal.Header>

          <Modal.Body>본문 내용이 들어갑니다.</Modal.Body>

          <Modal.Footer>
            <Button className="flex-1" onClick={() => setIsOpen(false)}>
              확인
            </Button>

            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              취소
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  },
};

export const OneButton: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex min-h-125 items-center justify-center">
        <Button onClick={() => setIsOpen(true)}>모달 열기</Button>

        <Modal isOpen={isOpen}>
          <Modal.Header onClose={() => setIsOpen(false)}>
            <Modal.Title>제목입니다.</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="text-center">본문이 들어갑니다</div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              className="flex-1"
              onClick={() => setIsOpen(false)}
              size="sm"
            >
              확인
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  },
};

export const WithoutHeader: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex min-h-125 items-center justify-center">
        <Button onClick={() => setIsOpen(true)}>모달 열기</Button>

        <Modal isOpen={isOpen}>
          <Modal.Header onClose={() => setIsOpen(false)} />
          <Modal.Body>
            <div className="text-center text-bold text-lg">헤더가 없는 모달입니다.</div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              className="flex-1"
              onClick={() => setIsOpen(false)}
              size="sm"
            >
              확인
            </Button>

            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsOpen(false)}
              size="sm"
            >
              취소
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  },
};

// Footer 없음
export const WithoutFooter: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex min-h-125 items-center justify-center">
        <Button onClick={() => setIsOpen(true)}>모달 열기</Button>

        <Modal isOpen={isOpen}>
          <Modal.Header onClose={() => setIsOpen(false)}>
            <Modal.Title>제목입니다.</Modal.Title>
          </Modal.Header>

          <Modal.Body>푸터가 없는 모달입니다.</Modal.Body>
        </Modal>
      </div>
    );
  },
};
