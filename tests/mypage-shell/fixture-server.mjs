import http from "node:http";
let state;
const initialUser = { id: 7, teamId: "qa", name: "조회한 사용자", email: "layout@example.invalid", companyName: null, image: null, createdAt: "2026-10-01T00:00:00Z", updatedAt: "2026-10-01T00:00:00Z" };
const reset = (mode = "success") => { state = { mode, requests: [], user: { ...initialUser }, deleted: [], liked: [] }; };
reset();
const meeting = (id, created = false) => ({ id, teamId: "qa", name: `레이아웃 확인 모임 ${id}`, type: "스터디", region: "강남구", dateTime: "2099-11-17T08:30:00Z", capacity: 20, participantCount: id, image: "/meetings-hero.jpg", hostId: created ? 7 : 99, createdBy: created ? 7 : 99, host: { id: created ? 7 : 99, name: "주최자", image: null }, isCompleted: id === 2, isReviewed: false, canceledAt: null, confirmedAt: id === 1 ? "2099-11-01" : null, isFavorited: state.liked.includes(id), role: created ? "host" : "participant" });
http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  const send = (status, data) => { res.writeHead(status, { "Content-Type": "application/json" }); res.end(data === undefined ? undefined : JSON.stringify(data)); };
  if (url.pathname === "/__qa/reset") { reset(url.searchParams.get("mode") ?? "success"); return send(200, {}); }
  if (url.pathname === "/__qa/state") return send(200, state);
  if (url.pathname === "/__qa/user") { state.mode = url.searchParams.get("mode") ?? "success"; if (url.searchParams.has("name")) state.user.name = url.searchParams.get("name"); if (url.searchParams.has("image")) state.user.image = url.searchParams.get("image") || null; return send(200, {}); }
  state.requests.push({ path: req.url, method: req.method });
  if (url.pathname === "/meetings") return send(200, { data: [], nextCursor: null, hasMore: false });
  if (req.headers.authorization !== "Bearer qa-token") return send(401, { code: "UNAUTHORIZED", message: "로그인이 필요합니다." });
  if (state.mode === "signed-out") return send(401, { code: "UNAUTHORIZED", message: "로그인이 필요합니다." });
  if (url.pathname === "/users/me") {
    if (state.mode === "user-error") return send(503, { code: "UNAVAILABLE", message: "사용자 정보 조회 실패" });
    if (state.mode === "delayed") await new Promise((r) => setTimeout(r, 700));
    return send(200, state.user);
  }
  if (["/meetings/joined", "/users/me/meetings"].includes(url.pathname)) {
    const created = url.pathname === "/users/me/meetings";
    const all = [1, 2, 3, 4].filter((id) => !state.deleted.includes(id)).map((id) => meeting(id, created));
    const cursor = url.searchParams.get("cursor");
    return send(200, { data: cursor ? all.slice(2) : all.slice(0, 2), nextCursor: !cursor && all.length > 2 ? "next" : null, hasMore: !cursor && all.length > 2 });
  }
  if (/^\/meetings\/\d+\/favorites$/.test(url.pathname)) {
    const id = Number(url.pathname.split("/")[2]); state.liked = req.method === "POST" ? [...state.liked, id] : state.liked.filter((n) => n !== id);
    return req.method === "POST" ? send(201, {}) : send(204);
  }
  if (/^\/meetings\/\d+\/join$/.test(url.pathname) && req.method === "DELETE") { state.deleted.push(Number(url.pathname.split("/")[2])); return send(204); }
  return send(404, { message: "테스트 경로 없음" });
}).listen(4012, "127.0.0.1");
