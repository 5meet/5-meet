"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import AlertModal from "@/components/ui/Modal/AlertModal";

interface AlertOptions {
  message: string;
  onClose?: () => void;
}

// Context를 사용하는 컴포넌트에게 무엇을 제공할지 정의하는 타입
interface ModalContextValue {
  openAlert: (options: AlertOptions) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertOptions | null>(null);

  const openAlert = (options: AlertOptions) => {
    setAlert(options);
  };
  const closeAlert = () => {
    const onClose = alert?.onClose;
    setAlert(null);
    onClose?.();
  };

  return (
    <ModalContext.Provider value={{ openAlert }}>
      {children}
      <AlertModal
        isOpen={!!alert}
        message={alert?.message ?? ""}
        onClose={closeAlert}
      />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal은 ModalProvider 내부에서 사용해야 합니다.");
  }

  return context;
}
