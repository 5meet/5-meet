import http from "node:http";
let state;
const initialUser = { id: 7, teamId: "qa", name: "기존 이름", email: "profile@example.invalid", companyName: null, image: "https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/users/original.jpg", createdAt: "2026-10-01T00:00:00Z", updatedAt: "2026-10-01T00:00:00Z" };
const reset = () => { state = { user: { ...initialUser }, mode: "success", patches: [], uploads: [], refreshes: 0 }; };
reset();
http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  const send = (status, data) => { res.writeHead(status, { "Content-Type": "application/json" }); res.end(JSON.stringify(data)); };
  if (url.pathname === "/__qa/reset") { reset(); return send(200, {}); }
  if (url.pathname === "/__qa/state") return send(200, state);
  if (url.pathname === "/__qa/mode") { state.mode = url.searchParams.get("value"); return send(200, {}); }
  if (url.pathname === "/meetings") return send(200, { data: [], hasMore: false, nextCursor: null });
  if (url.pathname === "/auth/refresh") { state.refreshes++; return send(200, { accessToken: "qa-refreshed", refreshToken: "qa-refresh-next" }); }
  if (!["Bearer qa-token", "Bearer qa-refreshed"].includes(req.headers.authorization)) return send(401, { code: "UNAUTHORIZED", message: "로그인 필요" });
  if (url.pathname === "/images" && req.method === "POST") {
    let raw = ""; for await (const chunk of req) raw += chunk;
    const body = JSON.parse(raw); state.uploads.push({ body, authorization: req.headers.authorization });
    if (state.mode === "presign-error") return send(503, { code: "UNAVAILABLE" });
    if (state.mode === "presign-unauthorized" || (state.mode === "presign-refresh" && req.headers.authorization !== "Bearer qa-refreshed")) return send(401, { code: "UNAUTHORIZED" });
    return send(200, { presignedUrl: `https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/upload/${state.uploads.length}`, publicUrl: `https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/users/${state.uploads.length}.jpg` });
  }
  if (url.pathname === "/users/me" && req.method === "GET") return send(200, state.user);
  if (url.pathname === "/users/me" && req.method === "PATCH") {
    let raw = ""; for await (const chunk of req) raw += chunk;
    const body = JSON.parse(raw);
    state.patches.push({ body, authorization: req.headers.authorization });
    if (state.mode === "delay") await new Promise((resolve) => setTimeout(resolve, 900));
    if (state.mode === "error") return send(503, { code: "UNAVAILABLE", message: "테스트 실패" });
    if (state.mode === "unauthorized" || (state.mode === "refresh" && req.headers.authorization !== "Bearer qa-refreshed")) return send(401, { code: "UNAUTHORIZED", message: "로그인 필요" });
    state.user = { ...state.user, ...body }; return send(200, state.user);
  }
  return send(200, { data: [], hasMore: false, nextCursor: null });
}).listen(4014, "127.0.0.1");
