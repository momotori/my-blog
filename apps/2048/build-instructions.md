# Build 서브에이전트 지침

## 목표
`D:/Desktop/my-blog/apps/2048/spec.md`에 작성된 계획대로 2048 게임을 실제로 구현한다.

## 범위 제한 (반드시 준수)
- 오직 `D:/Desktop/my-blog/apps/2048/` 폴더 안의 파일만 생성/수정한다.
- 블로그의 다른 파일(`index.html`, `css/style.css`, `js/main.js`, `posts/` 등 `/apps/2048/` 바깥의 모든 것)은 절대 건드리지 않는다.
- `spec.md`와 `plan-instructions.md`, `build-instructions.md`는 수정하지 않는다.

## 만들 파일
- `apps/2048/index.html`
- `apps/2048/style.css`
- `apps/2048/game.js`

## 구현 요구사항
`spec.md`의 내용을 그대로 따른다. 요약:
- 4x4 보드, 방향키(←↑→↓)로 타일 밀기/합치기, 새 타일(90% 확률 2, 10% 확률 4) 자동 생성
- 같은 턴에 이미 합쳐진 타일은 다시 합치지 않음
- 현재 점수 + 최고 점수(localStorage 키 `game2048-best`) 점수판
- 게임 오버 판정(빈칸 없음 + 인접 동일값 없음) 및 오버레이
- 2048 타일 첫 등장 시 승리 오버레이("계속하기"/"새 게임")
- "새로하기" 버튼
- 다크모드 대응: 블로그와 동일한 CSS 변수명(`--bg`, `--bg-secondary`, `--text`, `--text-secondary`, `--accent`, `--border`)과 `localStorage`의 `theme` 키, `prefers-color-scheme`를 사용해 `apps/2048/` 안에서 자체 구현 (다른 파일을 import하지 않음)
- 반응형 레이아웃 (360px~ 모바일 대응) + 터치 스와이프 지원 (키보드와 동일한 `handleMove(direction)` 함수로 합류)
- 순수 HTML/CSS/JS만 사용, 프레임워크/번들러/npm 의존성 금지, 외부 라이브러리 사용 금지 (CDN도 이 게임에는 불필요하므로 사용하지 않는다)
- 코드에 불필요한 주석을 달지 않는다. 변수/함수명으로 의도가 드러나게 작성한다.

## 완료 조건
세 파일(`index.html`, `style.css`, `game.js`)을 모두 작성하고, 브라우저에서 열었을 때 문법 오류 없이 동작할 수 있는 상태로 완성한다. (실제 브라우저 검증은 다음 Review 단계에서 별도로 수행하므로, 이 단계에서는 코드 작성에 집중한다.) 완료 후 작성한 파일 목록과 각 파일의 역할을 간단히 보고한다.
