// Local upstream fixture. Never points to or modifies real user reservations.
import http from "node:http";
let state;
const meeting = (id, overrides = {}) => ({
  id,
  teamId: "qa",
  name: id === 1 ? "작은 독서 습관 만들기" : `테스트 모임 ${id}`,
  type: "스터디",
  region: "중구",
  dateTime: "2099-11-17T08:30:00.000Z",
  participantCount: 20,
  capacity: 20,
  image: "/meetings-hero.jpg",
  hostId: 99,
  confirmedAt: null,
  canceledAt: null,
  isCompleted: false,
  isReviewed: false,
  isFavorited: false,
  ...overrides,
});
function reset(mode = "success") {
  state = {
    mode,
    deleted: [],
    requests: [],
    meetings: [
      meeting(1, { confirmedAt: "2099-11-01" }),
      meeting(2, { isCompleted: true, isReviewed: mode === "reviewed" }),
      meeting(3, { canceledAt: "2026-10-01" }),
      meeting(4, { hostId: 7 }),
    ],
  };
}
reset();
http
  .createServer(async (req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");
    const send = (status, data) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(data === undefined ? undefined : JSON.stringify(data));
    };
    if (url.pathname === "/__qa/reset") {
      reset(url.searchParams.get("mode") || "success");
      return send(200, { ok: true });
    }
    if (url.pathname === "/__qa/state") return send(200, state);
    state.requests.push({
      path: req.url,
      method: req.method,
      authenticated: req.headers.authorization === "Bearer qa-token",
    });
    if (url.pathname === "/meetings")
      return send(200, { data: [], hasMore: false, nextCursor: null });
    if (req.headers.authorization !== "Bearer qa-token")
      return send(401, {
        code: "UNAUTHORIZED",
        message: "로그인이 필요합니다.",
      });
    if (url.pathname === "/users/me")
      return send(200, {
        id: 7,
        name: "테스트 사용자",
        email: "qa@example.invalid",
        teamId: "qa",
        companyName: null,
        image: null,
      });
    if (
      /^\/meetings\/\d+\/favorites$/.test(url.pathname) &&
      ["POST", "DELETE"].includes(req.method)
    ) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (state.mode === "favorite-error")
        return send(409, {
          code: "QA_FAVORITE_ERROR",
          message: "찜 변경 테스트 오류",
        });
      const item = state.meetings.find(
        (m) => m.id === Number(url.pathname.split("/")[2]),
      );
      if (!item) return send(404, { message: "모임 없음" });
      item.isFavorited = req.method === "POST";
      return req.method === "DELETE" ? send(204) : send(201, { meeting: item });
    }
    if (url.pathname === "/meetings/joined") {
      if (
        state.mode === "list-error" ||
        (state.mode === "refetch-error" && state.deleted.length)
      )
        return send(500, { code: "QA_ERROR", message: "목록 조회 실패" });
      if (state.mode === "empty-delayed") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return send(200, { data: [], hasMore: false, nextCursor: null });
      }
      if (state.mode === "empty")
        return send(200, { data: [], hasMore: false, nextCursor: null });
      const cursor = url.searchParams.get("cursor");
      if (cursor && state.mode === "next-error")
        return send(500, { code: "QA_ERROR", message: "추가 조회 실패" });
      const available = state.meetings.filter(
        (m) => !state.deleted.includes(m.id),
      );
      return send(200, {
        data: cursor ? available.slice(2) : available.slice(0, 2),
        hasMore: !cursor && available.length > 2,
        nextCursor: !cursor && available.length > 2 ? "next" : null,
      });
    }
    if (
      /^\/meetings\/\d+\/join$/.test(url.pathname) &&
      req.method === "DELETE"
    ) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (state.mode === "cancel-error")
        return send(409, {
          code: "QA_CANCEL_ERROR",
          message: "예약 취소 테스트 오류",
        });
      state.deleted.push(Number(url.pathname.split("/")[2]));
      return send(204);
    }
    return send(404, { message: "테스트 경로 없음" });
  })
  .listen(4010, "127.0.0.1", () => console.log("QA upstream ready on 4010"));
