import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../../src/features/mypage/validators/profile.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { validateProfileUpdate } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("이름·이미지를 개별 또는 동시 변경하고 생략한 필드를 추가하지 않는다", () => {
  const image = "https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/together-dallaem/v2/tmp/users/avatar.jpg";
  for (const [input, expected] of [
    [{ name: " 새 이름 " }, { name: "새 이름" }],
    [{ image }, { image }],
    [{ name: " 새 이름 ", image }, { name: "새 이름", image }],
  ]) {
    assert.deepEqual(validateProfileUpdate(input), { success: true, data: expected });
  }
});

test("빈 요청·배열·알 수 없는 필드를 거부한다", () => {
  for (const input of [null, undefined, "name", [], {}, { companyName: "회사" }, { name: "이름", extra: true }]) {
    assert.deepEqual(validateProfileUpdate(input), {
      success: false, message: "올바른 프로필 정보를 입력해주세요.",
    });
  }
});

test("이름은 공백 제거 후 1~20자를 허용한다", () => {
  for (const name of ["가", "가".repeat(20)]) {
    assert.deepEqual(validateProfileUpdate({ name: ` ${name} ` }), { success: true, data: { name } });
  }
  for (const name of [null, 123, "", "   ", "가".repeat(21)]) {
    assert.deepEqual(validateProfileUpdate({ name }), {
      success: false, message: "이름은 1자 이상 20자 이하로 입력해주세요.",
    });
  }
});

test("잘못된 이미지 형식·프로토콜·URL 계정 정보를 거부한다", () => {
  for (const image of [null, 123, "", "/avatar.jpg", "blob:https://local/id", "http://example.invalid/a.jpg", "data:image/png;base64,AA", "https://user@example.invalid/a.jpg", "https://user:password@example.invalid/a.jpg"]) {
    assert.deepEqual(validateProfileUpdate({ image }), {
      success: false, message: "올바른 이미지 URL이 필요합니다.",
    });
  }
});

test("동시 변경 중 한 필드가 잘못되면 전체 요청을 거부한다", () => {
  assert.equal(validateProfileUpdate({ name: "이름", image: "blob:preview" }).success, false);
  assert.equal(validateProfileUpdate({ name: " ", image: "https://example.invalid/a.jpg" }).success, false);
});

test("실제 저장소만 허용하고 유사 도메인·외부 호스트·임의 포트를 차단한다", () => {
  const host = "sprint-fe-project.s3.ap-northeast-2.amazonaws.com";
  for (const image of [
    "https://outside.example/avatar.jpg",
    "https://example.com/avatar.jpg",
    `https://${host}.outside.example/avatar.jpg`,
    `https://outside.example/${host}/avatar.jpg`,
    `https://${host}@outside.example/avatar.jpg`,
    `https://${host}:8443/users/avatar.jpg`,
  ]) {
    assert.deepEqual(validateProfileUpdate({ image }), {
      success: false, message: "올바른 이미지 URL이 필요합니다.",
    });
  }
});
