"use client";

import { useState, type SubmitEventHandler } from "react";
import { useRouter } from "next/navigation";

import { SearchBar } from "./SearchBar";

export function SearchSection() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) return;

    router.push(
      `/meetings/list?keyword=${encodeURIComponent(trimmedKeyword)}`,
    );
  };

  return (
    <section aria-label="모임 검색">
      <form onSubmit={handleSubmit}>
        <SearchBar value={keyword} onChange={setKeyword} />
      </form>
    </section>
  );
}