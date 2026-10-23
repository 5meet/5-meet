"use client";

import { usePathname } from "next/navigation";
import { GlobalCreateFAB } from "@/components/layout/GlabalCreateFAB/GlobalCreateFAB";

export default function ConditionalLayoutUI() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return null;
  }

  return (
    <>
      <GlobalCreateFAB />
    </>
  );
}
