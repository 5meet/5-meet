// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { addFavorite } from "../api/addFavorite";
import { deleteFavorite } from "../api/deleteFavorite";
import { useAddFavoriteMutation } from "./useAddFavoriteMutation";
import { useDeleteFavoriteMutation } from "./useDeleteFavoriteMutation";

vi.mock("../api/addFavorite", () => ({
  addFavorite: vi.fn(),
}));

vi.mock("../api/deleteFavorite", () => ({
  deleteFavorite: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

  function wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return { wrapper, invalidateSpy };
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("favorite mutation hooks", () => {
  it("즐겨찾기 추가 성공 시 관련 쿼리를 무효화한다", async () => {
    vi.mocked(addFavorite).mockResolvedValue({ meetingId: 12 });

    const { wrapper, invalidateSpy } = createWrapper();
    const { result } = renderHook(() => useAddFavoriteMutation(), {
      wrapper,
    });

    await result.current.mutateAsync(12);

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["favorites"],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["mypage", "reviews", "available"],
      });
    });
  });

  it("즐겨찾기 해제 성공 시 관련 쿼리를 무효화한다", async () => {
    vi.mocked(deleteFavorite).mockResolvedValue(undefined);

    const { wrapper, invalidateSpy } = createWrapper();
    const { result } = renderHook(() => useDeleteFavoriteMutation(), {
      wrapper,
    });

    await result.current.mutateAsync(12);

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["favorites"],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["mypage", "reviews", "available"],
      });
    });
  });
});
