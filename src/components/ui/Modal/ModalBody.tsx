interface ModalBodyProps {
  children: React.ReactNode;
}

export const ModalBody = ({ children }: ModalBodyProps) => {
  return (
    <div className="px-8 pt-4 pb-8">
      {children}
    </div>
  );
};