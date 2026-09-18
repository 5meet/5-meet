"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface KebabProps {
  onEdit: () => void;
  onDelete: () => void;
}

const Kebab = ({ onEdit, onDelete }: KebabProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    setIsOpen(false);
    onEdit();
  };

  const handleDelete = () => {
    setIsOpen(false);
    onDelete();
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label="관리 메뉴 열기"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-6 w-6 items-center justify-center rounded-full text-gray-600 hover:bg-gray-50 lg:h-8 lg:w-8"
      >
        <Image src="/ic_meetballs.svg" alt="" width={40} height={40} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute top-10 right-0 z-10 w-32 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-md"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleEdit}
            className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            수정하기
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={handleDelete}
            className="w-full px-4 py-2.5 text-left text-sm font-medium text-error-100 hover:bg-gray-50"
          >
            삭제하기
          </button>
        </div>
      )}
    </div>
  );
};

export default Kebab;
