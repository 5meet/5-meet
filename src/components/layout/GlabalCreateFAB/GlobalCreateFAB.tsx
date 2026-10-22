"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { UserPlus } from "lucide-react";

import { FloatingActionButton } from "@/components/ui/FloatingActionButton/FloatingActionButton";
import { CreateMeetingModal } from "@/features/meetings/components/create/CreateMeetingModal";

export function GlobalCreateFAB() {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isHiddenPage =
    pathName === "/login" ||
    pathName === "/signup" ||
    pathName === "/talk" ||
    pathName.startsWith("/talk/");

  if (isHiddenPage) {
    return null;
  }

  return (
    <>
      <div className="fixed right-4 bottom-25 z-50 md:right-8 md:bottom-8">
        <FloatingActionButton
          icon={UserPlus}
          label="모임 만들기"
          onClick={() => setIsOpen(true)}
        />
      </div>

      <CreateMeetingModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}