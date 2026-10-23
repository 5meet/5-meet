
import { afterEach, describe, expect, it, vi } from "vitest";
import { deleteFavorite } from "./deleteFavorite";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("deleteFavorite", () => {
  it("즐겨찾기 해제 요청을 보낸다", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, { status: 204 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(deleteFavorite(12)).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledWith("/api/favorites/12", {
      method: "DELETE",
    });
  });

  it("실패 응답이면 오류를 발생시킨다", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "해제 실패" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
    ));

    await expect(deleteFavorite(12)).rejects.toThrow("해제 실패");
  });
});