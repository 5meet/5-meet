import http from "node:http";
let state;
const makeMeeting = (id) => ({
  id, teamId: "qa", name: `내가 만든 모임 ${id}`, type: "스터디", region: "강남구",
  capacity: 20, participantCount: id, image: "/meetings-hero.jpg", canceledAt: null,
  confirmedAt: null, hostId: 7, createdBy: 7, host: { id: 7, name: "테스트", image: null },
  isCompleted: false, dateTime: "2099-11-17T08:30:00.000Z", isFavorited: false, role: "host",
});
const reset = (mode = "success") => { state = { mode, requests: [], meetings: Array.from({ length: 6 }, (_, i) => makeMeeting(i + 1)) }; };
reset();
http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  const send = (status, data) => { res.writeHead(status, { "Content-Type": "application/json" }); res.end(data === undefined ? undefined : JSON.stringify(data)); };
  if (url.pathname === "/__qa/reset") { reset(url.searchParams.get("mode") ?? "success"); return send(200, {}); }
  if (url.pathname === "/__qa/state") return send(200, state);
  if (url.pathname === "/__qa/recover") { state.mode = "success"; return send(200, {}); }
  state.requests.push({ path: req.url, method: req.method, authenticated: req.headers.authorization === "Bearer qa-token" });
  if (url.pathname === "/meetings") return send(200, { data: [], hasMore: false, nextCursor: null });
  if (url.pathname === "/auth/refresh") return send(200, { accessToken: "qa-token", refreshToken: null });
  if (req.headers.authorization !== "Bearer qa-token") return send(401, { code: "UNAUTHORIZED", message: "로그인이 필요합니다." });
  if (url.pathname === "/users/me") return send(200, { id: 7, name: "테스트 사용자", email: "qa@example.invalid", image: null, companyName: null, teamId: "qa" });
  if (url.pathname === "/users/me/meetings") {
    if (url.searchParams.get("type") !== "created") return send(400, { message: "created required" });
    if (state.mode === "empty") return send(200, { data: [], hasMore: false, nextCursor: null });
    if (state.mode === "list-error") return send(503, { code: "UNAVAILABLE", message: "테스트 목록 조회 실패" });
    const cursor = url.searchParams.get("cursor");
    if (cursor && state.mode === "next-error") return send(503, { code: "UNAVAILABLE", message: "추가 조회 실패" });
    if (cursor) await new Promise((resolve) => setTimeout(resolve, 500));
    const offset = cursor ? Number(cursor) : 0;
    return send(200, { data: state.meetings.slice(offset, offset + 2), hasMore: offset < 4, nextCursor: offset < 4 ? String(offset + 2) : null });
  }
  if (/^\/meetings\/\d+\/favorites$/.test(url.pathname)) {
    const id = Number(url.pathname.split("/")[2]);
    const delay = state.mode === "favorite-isolated" ? 1500 : state.mode === "favorite-mixed" && id === 2 ? 1500 : 400;
    await new Promise((resolve) => setTimeout(resolve, delay));
    if (state.mode === "favorite-error" || (state.mode === "favorite-mixed" && id === 1)) {
      return send(409, { code: "CONFLICT", message: "찜 변경 테스트 오류" });
    }
    const meeting = state.meetings.find((m) => m.id === id);
    if (!meeting) return send(404, { message: "모임 없음" });
    meeting.isFavorited = req.method === "POST";
    return req.method === "DELETE" ? send(204) : send(201, {});
  }
  return send(404, { message: "테스트 경로 없음" });
}).listen(4011, "127.0.0.1");
