# PR #101 실행 검증

기존 공통 컴포넌트와 기본 Storybook 설정을 변경하지 않고 이 PR의 범위를 별도로 검증한다.

## 실행

```sh
npm ci
npx playwright install chromium
npx eslint src/components/ui/DetailCard src/features/mypage/my-meetings src/app/api/mypage src/app/mypage/meetings/page.tsx .storybook-my-meetings tests/my-meetings
npx storybook build --config-dir .storybook-my-meetings --output-dir /tmp/5-meet-storybook-101
QA_STORYBOOK_DIR=/tmp/5-meet-storybook-101 QA_OUTPUT=/tmp/5-meet-qa-101 node tests/my-meetings/verify.mjs
node tests/my-meetings/verify.mjs --build
```

검증 스크립트는 포트 3002(Next), 4010(가짜 upstream), 6007(빌드된 Storybook)을 사용한다. 실행 중인 Next 개발 서버가 있으면 먼저 종료한다. 스크립트는 테스트 서버와 브라우저를 실행하고 종료한다. 기본 출력 위치는 `.qa-my-meetings`이며 `QA_OUTPUT`으로 저장소 밖 경로를 지정할 수 있다. 별도로 설치된 Chromium은 `QA_CHROMIUM_EXECUTABLE`로 지정한다.

## 검증 범위

- 실제 Next Route Handler와 인증 fetch 래퍼를 통과하는 로컬 upstream 테스트
- 인증 없는 요청의 401, 잘못된 페이지 크기·모임 번호의 400
- HttpOnly 인증 쿠키 전달, 커서 다음 페이지, 완료·취소·주최자 취소 버튼 제한
- 확인창 거절 시 DELETE 미발생, 204 취소 성공, 처리 중 버튼 비활성화, 목록 재조회
- 취소 실패 시 목록 유지 및 서버 오류 표시
- 취소 성공 이후 재조회 실패 시 취소한 모임을 다시 표시하지 않음
- 추가 조회 실패 시 기존 목록 유지 및 재시도
- 빈 목록, 최초 조회 실패 및 재시도 성공
- PC 1920×1080, 태블릿 744×1133, 모바일 375×812 실제 앱 캡처와 가로 넘침 검사
- PR 스토리 14개 렌더링 및 카드 기준 크기 958×236, 696×236, 343×390 검사

가짜 upstream 결과는 실제 서비스 API의 로그인·예약 취소 성공 증거가 아니다. 실서버 검증에서는 `NEXT_PUBLIC_API_MOCKING=disabled`와 팀 경로를 포함한 API 환경변수를 사용해야 한다. 계정·토큰·개인 디자인 주소는 저장소에 기록하지 않는다.
