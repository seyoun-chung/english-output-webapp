# English Output Web App

영어 교재를 반복해서 학습하며 암기, 인출, 아웃풋, 작문, 복습으로 이어지도록 돕는 반응형 웹 앱 프로젝트입니다.

## Product Goal

새로운 영어 콘텐츠를 계속 제공하는 대신, 사용자가 이미 가지고 있는 교재의 내용을 반복해 익히고 실제로 꺼내 쓸 수 있게 만드는 것을 목표로 합니다.

```text
Learn → Memorize → Recall → Output → Write → Review → Repeat
```

## Core Principles

- **Completion > Perfection**: 한 번에 완벽하게 외우기보다 반복 회독으로 완성도를 높입니다.
- **Source Locked Learning**: 학습용 영어 문장과 표현은 제공된 교재와 부교재에서만 가져옵니다.
- **Learner-Paced**: 강제 타이머나 진도 잠금 없이 사용자가 자신의 속도로 학습합니다.
- **Responsive Web App**: PC와 모바일에서 주요 학습 기능을 사용할 수 있도록 설계합니다.

## Current Scope

현재 작업 범위는 **Chapter 3 — Personality Traits**를 시범 챕터로 사용하는 로컬 프로토타입입니다. 다른 챕터로 확장하기 전에 공통 학습·저장·복습 기능을 검증합니다.

```text
Chapter 3 Overview
→ My Story Read
→ Chunk Recall
→ Full Recall
→ Real Conversations / Output Practice
→ Weekly Writing / Chapter Review
→ Pass 1 completion
```

## Documentation

- [`AGENTS.md`](./AGENTS.md): 프로젝트 전체 규칙과 개발 원칙
- [`docs/textbook_mastery_prd_v1_1.md`](./docs/textbook_mastery_prd_v1_1.md): 제품 요구사항 문서
- [`docs/codex_handoff.md`](./docs/codex_handoff.md): 기획 맥락과 구현 인수인계
- [`docs/current_task.md`](./docs/current_task.md): 현재 Phase의 작업 범위와 완료 조건
- [`docs/chapter3_pilot_plan.md`](./docs/chapter3_pilot_plan.md): Chapter 3 시범 챕터 범위와 제외 사항
- [`docs/verification.md`](./docs/verification.md): 자동 검사 및 수동 검증 방법
- [`docs/chapter3_pilot_handoff.md`](./docs/chapter3_pilot_handoff.md): 이번 구현과 검증 결과

## Development Status

React + TypeScript + Vite + 일반 CSS를 유지하며 다음 기능을 구현했습니다.

- 본문 한국어 / 영어 / 함께 보기, 원문 기반 힌트, 정답 확인, 6개 Chunk 자기평가
- Full Recall과 `생각해서 나왔어요` 또는 `다시 봐야 해요`로 평가한 Chunk 재연습 (`바로 나왔어요`와 미평가 Chunk는 제외)
- Real Conversations: 7개 원문 대화 읽기, A/B 역할 연습, 전체 대화 인출
- Output Practice: 기본 6개 Chunk와 출처를 확인한 변형 6개, No hint 모드. 부교재 전체 문제를 전산화한 것은 아닙니다.
- Weekly Writing: 자유 작문, 원문 질문 10개, 원문 템플릿 7개와 독립적인 로컬 초안
- Grammar Focus: 원문 5쌍의 예문 / What About You?: 원문 질문에 개인 답안 작성 (선택 학습)
- Chapter Review: 이미 자기평가한 원문 항목만 선택하여 복습. 작문 초안은 대상에서 제외
- My Story, Real Conversations, 기본 Output Practice, Weekly Writing 완료 후 Pass 1 완료 가능
- Pronunciation은 비활성화하고 `Coming later`로 표시
- 말하기 연습에서 선택형 녹음·재생으로 내 목소리를 점검할 수 있습니다. STT·텍스트 변환·자동 채점은 하지 않습니다.
- Paragraph Recall, 로그인, 서버 DB, 기기 간 동기화는 구현하지 않습니다.

## Local Development

Node.js 22.12 이상이 필요합니다. 터미널에서 프로젝트 폴더로 이동한 뒤 실행합니다.

```bash
cd /path/to/english-output-webapp
npm ci
npm run dev
```

브라우저에서 터미널에 표시된 주소(기본 `http://127.0.0.1:5173`)를 엽니다.
서버 종료는 터미널에서 `Control + C`입니다. 다른 컴퓨터에서는 해당 컴퓨터의 프로젝트 경로를 사용합니다.

```bash
npm test         # 상태 전이, 저장 복원, Source 일치 및 힌트 규칙 검증
npm run build   # TypeScript 검사 + 배포용 빌드
npm run verify  # 민감정보·제외 파일 검사 + 테스트 + 빌드
npm run preview # 빌드 결과 로컬 확인
```

별도의 `.env`, API 키, GitHub 접근 토큰은 필요하지 않습니다.

## Optional Voice Practice

화면 용어는 **Chunk**, **Chunk Recall**을 사용하며 Full Recall 요약 배지는 **Self check**로 표시합니다.
말하기 연습에서 `Record` → 마이크 권한 허용 → 직접 말하기 →
`Stop recording` → `Your recording`의 재생 버튼을 사용합니다.
정답을 펼쳐도 녹음이 유지되므로 원문과 비교하면서 다시 들을 수 있습니다.
`Record again`은 이전 녹음을 대체하고, 그 아래의 휴지통 아이콘이 있는 `Delete` 버튼으로 바로 지울 수 있습니다.
녹음하지 않거나 권한을 거부해도 정답 확인·자기평가·완료는 그대로 가능합니다.
승인된 학습 버튼·표시는 영어로 제공하며, 왼쪽 메뉴의 한국어 보조 설명과 자기평가 문구는 유지합니다.
녹음 버튼·주요 상태도 영어로 표시합니다. `Optional`과 중복되는 녹음 생략 안내와 별도의 마이크 사용 종료 문구는 생략합니다.
권한 허용 안내·녹음 삭제 조건·오류 안내는 기존 한국어를 유지합니다.

음성은 `getUserMedia` + `MediaRecorder`로 브라우저 메모리에서만 처리합니다.
음성 서버 전송, 파일 자동 저장, localStorage 저장, STT 서비스 호출은 하지 않습니다.
다른 화면·Chunk·탭으로 이동하거나 새로고침하면 녹음과 재생을 정리합니다.
마이크는 녹음 종료 및 화면 이탈 시 해제합니다. 브라우저에 부여한 사이트 권한 자체는
브라우저 설정에서 별도로 변경할 수 있습니다.

시작 전에는 `Optional` 배지와 삭제 조건을 안내하고, 녹음 중에는 삭제 안내를 반복하지 않습니다.
사이드바의 저장 위치 안내와 Full Recall의 평가 분류 설명은 생략했으며 실제 처리 방식은 그대로입니다.
브라우저 기본 재생기에서 사용자가 직접 다운로드한 파일은 기기에 남으며 앱에서 삭제하지 않습니다.
파일 형식은 브라우저가 지원하는 녹음 형식(WebM/Opus, MP4 등)을 사용합니다. MP3 변환 기능은 없습니다.
공개 서비스의 법적 고지·동의 요건은 실제 운영 지역과 개인정보 처리 방식에 따라 별도 검토해야 합니다.

녹음은 localhost/127.0.0.1 또는 HTTPS와 브라우저의 녹음 API 지원이 필요합니다.
일반 HTTP의 LAN 주소로 모바일 접속하면 마이크가 제한될 수 있습니다.
미지원 환경에서는 안내를 표시하며 기존 학습 흐름은 유지합니다.

수동 검증: 짧게 녹음·재생한 뒤 원문 표시, 재녹음, 권한 거부, 녹음 중 화면 전환,
다음 Chunk 이동과 새로고침 후 녹음이 남지 않는지 확인해주세요.
자동 테스트에서는 실제 마이크 대신 가짜 미디어 장치로 데이터 수집·권한 경합·리소스 해제를 검증합니다.

## Progress Storage

진행 위치·본문 보기 방식·자기평가·힌트 사용·Full Recall 완료 여부·마지막 학습 시각은
`english-output-webapp:progress` 키 하나에 `version: 2` 구조로 저장합니다.
대화·Output·복습·선택 학습·작문 초안·Pass 1 완료 상태도 같은 구조에 저장합니다.
기존 version 1의 My Story 기록은 유지하며 새 구조로 이전합니다.
새로고침하면 학습 위치와 평가를 복원하며, 정답과 힌트는 다시 숨깁니다.
손상되었거나 지원하지 않는 버전의 데이터는 초기 상태로 복구합니다.

기록은 해당 브라우저와 주소에만 저장됩니다. 집 컴퓨터와 다른 컴퓨터 사이에는 공유되지 않습니다.
`localhost`와 `127.0.0.1`, 서로 다른 포트도 별도 기록이므로 같은 주소로 접속해주세요.
브라우저 사이트 데이터를 삭제하면 학습 기록도 삭제됩니다.

## Content Privacy

원본 교재 PDF는 `.gitignore`의 `docs/sources/*.pdf` 규칙으로 Git 추적에서 제외됩니다.
프로토타입의 My Story 본문은 `docs/current_task.md`의 승인된 6개 Chunk와 동일하며,
메인 교재 `eBook_Bookcamp_Oct8.pdf` p.50–51을 출처로 기록합니다.
이 본문은 앱 코드와 빌드에 포함되므로 PDF 제외 규칙이 본문 코드까지 숨겨주지는 않습니다.
추가 학습 자료의 출처는 각 화면과 데이터 파일에 기록합니다. 원문 PDF를 Git에 넣지 않아도
발췌한 학습 문장은 코드에 포함됩니다. 공개 배포 전에는 콘텐츠 사용 권한을 별도로 확인해야 합니다.
작문·개인 답안에 민감정보를 입력하지 마세요. 초안은 서버로 전송하지 않지만 이 브라우저를 사용하는 사람이 볼 수 있습니다.
