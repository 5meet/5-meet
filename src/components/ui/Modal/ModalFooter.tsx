interface ModalFooterProps {
  children: React.ReactNode;
}

export const ModalFooter = ({ children }: ModalFooterProps) => {
  return (
    <footer className="flex gap-3 px-8 pb-8">
      {children}
    </footer>
  );
};