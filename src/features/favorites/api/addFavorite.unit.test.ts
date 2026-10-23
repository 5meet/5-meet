
import { afterEach, describe, expect, it, vi } from "vitest";
import { addFavorite } from "./addFavorite";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("addFavorite", () => {
  it("즐겨찾기 추가 요청을 보내고 응답 데이터를 반환한다", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ meetingId: 12 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(addFavorite(12)).resolves.toEqual({
      meetingId: 12,
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meetingId: 12 }),
    });
  });

  it("204 응답이면 null을 반환한다", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(null, { status: 204 }),
    ));

    await expect(addFavorite(12)).resolves.toBeNull();
  });

  it("실패 응답이면 오류를 발생시킨다", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "요청 실패" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
    ));

    await expect(addFavorite(12)).rejects.toThrow("요청 실패");
  });
});
