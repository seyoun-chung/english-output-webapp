# Chapter 3 Pass 2 — Reinforce 설계안

## 문서 상태

- 작성일: 2026-10-01
- 상태: **권장안 승인 / Increment 1~3 구현·검증 완료(로컬, Git 반영 전)**
- 대상: Chapter 3 — Personality Traits
- 전제: Pass 1 실제 학습과 사용자 피드백 반영이 완료된 현재 앱
- Source of Truth: `AGENTS.md` → PRD → `docs/codex_handoff.md` → Chapter 3 Source

이 문서는 Pass 2 구현 범위와 제품 결정을 기록한 설계안이다.
사용자는 권장 완료 조건과 Increment 1~3 구현을 승인했다. commit, push, PR, merge는
각 Git 작업에 대한 별도 승인 범위를 따른다.

---

## 1. 현재 위치와 근거

Pass 1에서는 Chapter 3의 전체 기본 흐름을 실제로 한 번 학습할 수 있다.

- My Story
- Real Conversations
- Output Practice
- Grammar Focus — Recommended
- What About You — Recommended
- Weekly Writing
- Chapter Review
- Pass 1 완료 상태

실제 사용자 학습 중 발견된 모바일 녹음과 완료 상태 문제도 수정·검증되었다.
따라서 다음 개발 단계는 Chapter 4 확장이 아니라, 같은 Chapter 3를 다시 꺼내 쓰는
`Pass 2 — Reinforce`가 적절하다.

PRD와 handoff가 정한 Pass 2의 방향은 다음과 같다.

- 목표: 변형과 인출 강화
- Full Recall 강화
- Supplement Variation
- Chapter Review
- 새로운 Weekly Writing
- 권장 Review 구성: Recall 50% / Output 50%

---

## 2. 목표

사용자가 Pass 1에서 학습한 Chapter 3 영어를 더 적은 도움으로 다시 인출하고,
교재에 이미 존재하는 Variation에 적용할 수 있게 한다.

Pass 2의 핵심 경험은 다음과 같다.

```text
Pass 1 완료
→ 사용자가 직접 Pass 2 시작
→ Full Recall 중심 재인출
→ Source Variation 중심 Output
→ Chapter Review
→ 같은 Chapter의 새로운 Weekly Writing
→ Pass 2 완료
```

`Completion > Perfection` 원칙에 따라 발음, 자동 정답 판정, 모든 답변의 완벽한 일치를
완료 조건으로 사용하지 않는다.

---

## 3. 범위 밖

이번 Pass 2 설계와 첫 구현에는 다음을 포함하지 않는다.

- Chapter 4 또는 다른 Chapter 콘텐츠
- Source에 없는 영어 문장·힌트·문제 생성
- AI 자동 채점 또는 자동 합격 판정
- STT 기반 Recall 평가
- Pronunciation 점수와 Recall 완료의 연결
- Smart Review 간격·가중치 확정
- Auth, 서버 DB, 기기 간 동기화
- 강제 학습 순서, 타이머, Streak, Backlog 압박
- Pass 3 이상 기능

---

## 4. 권장 사용자 흐름

### 4.1 Pass 2 진입

Pass 1 완료 화면에 아래 두 선택지를 제공한다.

- `Review Pass 1`
- `Start Pass 2`

Pass 2는 자동으로 시작하지 않는다. 사용자가 `Start Pass 2`를 선택한 시점에만
별도의 Pass 2 진행 기록을 만든다. Pass 1 결과와 작성물은 그대로 보존한다.

### 4.2 Pass 2 Overview

화면에는 `Chapter 3 · Pass 2 · Reinforce`를 명확히 표시한다.

권장 영역:

| 영역 | Pass 2 역할 | 권장 상태 |
| --- | --- | --- |
| My Story | Full Recall 중심 재인출 | Core |
| Real Conversations | 역할별·전체 대화 재인출 | Core |
| Output Practice | Supplement Variation 적용 | Core |
| Chapter Review | Recall / Output 균형 복습 | Core 후보 |
| Weekly Writing | 같은 Chapter의 새 글 작성 | Core |
| Grammar Focus | 다시 볼 수 있으나 완료를 막지 않음 | Recommended |
| What About You | 다시 답할 수 있으나 완료를 막지 않음 | Recommended |
| Pronunciation | 별도 학습 | Separate |

Pass 2에서는 Grammar Focus와 What About You를 Required로 바꾸지 않는다.
PRD는 Pass 3에서 이 두 영역을 포함하는 방향을 제시하고 있으며, 정확한 필수 전환 시점은
아직 Open Question이다.

### 4.3 My Story

- 기본 진입점을 Read가 아니라 Full Recall로 둔다.
- 한국어 Source를 먼저 보여주고 영어 정답은 사용자가 요청한 뒤에만 표시한다.
- Hint 1, Hint 2는 계속 사용할 수 있으며 Source 안의 텍스트만 사용한다.
- Pass 1에서 `다시 봐야 해요`로 표시한 Chunk는 보조 복습 목록으로 보여줄 수 있다.
- Pass 1 평가는 참고 이력으로만 사용하고 Pass 2 완료로 자동 인정하지 않는다.
- Read와 Chunk Recall은 사용자가 필요할 때 돌아갈 수 있는 보조 경로로 유지한다.

### 4.4 Real Conversations

- User = A, User = B, Full Dialogue를 다시 제공한다.
- 상대방 대사를 Prompt로 보여주고 다음 대사를 인출하는 현재 원칙을 유지한다.
- Pass 1 자기평가는 보존하지만 Pass 2 자기평가는 새로 기록한다.
- 발음 결과를 대화 Recall 완료 조건으로 사용하지 않는다.

### 4.5 Output Practice

- Pass 2의 기본 모드는 `Variation`으로 둔다.
- 현재 Source 데이터에 포함된 Supplement Variation 6개만 사용한다.
- `Exact Recall`은 필요할 때 돌아보는 보조 모드로 유지한다.
- `No Hint`는 도움을 더 줄이는 선택형 도전 모드로 유지한다.
- 새 Variation을 AI로 생성하지 않는다.

### 4.6 Chapter Review

- 이미 학습한 Chapter 3 항목만 사용한다.
- PRD 권장 비율인 Recall 50% / Output 50%를 첫 기준으로 사용한다.
- 정확한 문제 수, 시간, 반복 간격, Smart Review 가중치는 이번 단계에서 확정하지 않는다.
- 사용자가 직접 시작하며 시간 제한이나 밀린 항목 수를 표시하지 않는다.
- 모든 평가는 자기평가이며 실패로 학습 진행을 막지 않는다.

### 4.7 Weekly Writing

- Pass 1 글을 덮어쓰지 않고 Pass 2용 새 글을 작성한다.
- 같은 Chapter의 Source 질문과 Beginner Template만 사용한다.
- Pass 2에서는 Pass 1보다 Template 의존을 낮추는 방향을 권장한다.
- Free / Guided / Template Writing은 모두 접근 가능하게 유지한다.
- 사용자 글을 새 공식 학습 Sentence로 등록하지 않는다.

---

## 5. 도움 장치 감소 원칙

Pass 2는 기능을 없애는 것이 아니라 기본 경로에서 도움을 한 단계 늦게 제공한다.

| 항목 | Pass 1 | Pass 2 권장 기본값 |
| --- | --- | --- |
| My Story 시작 | Read | Full Recall |
| Hint | 즉시 선택 가능 | 동일하게 선택 가능하되 먼저 인출 유도 |
| Output 기본 모드 | Exact Recall | Variation |
| No Hint | 추가 연습 | 선택형 도전 |
| Writing | Template 활용 가능 | 새 주제, Template 의존 감소 |
| 이전 평가 | 현재 회독 기록 | 이력만 보존, 새 회독 완료로 복사하지 않음 |

사용자가 막혔을 때 Read, Chunk Recall, Exact Recall, Template으로 돌아갈 수 있어야 한다.
도움 사용은 실패가 아니다.

---

## 6. 진행 데이터 설계

현재 저장 형식은 Pass 1 하나만 허용하므로 Pass 2 구현 전에 저장 구조 확장이 필요하다.

권장 저장 원칙:

```text
Chapter 3 progress
├── activePass
├── Pass 1 progress  ← 기존 기록 완전 보존
└── Pass 2 progress  ← 별도 ratings, cursor, completion, writing
```

- 저장 버전을 올리고 기존 Pass 1 데이터를 손실 없이 새 구조로 migration한다.
- migration 실패 시 기존 저장값을 덮어쓰지 않고 안전한 초기 화면으로 복구한다.
- My Story, Conversation, Output, Review, Writing의 진행 상태를 회독별로 분리한다.
- Pass 1의 자기평가는 Pass 2 문제 순서 추천에 참고할 수 있지만 Pass 2 평가로 복사하지 않는다.
- Pass 1 Writing draft와 Pass 2 Writing draft를 별도로 보존한다.
- 새 구조도 prototype 범위에서는 localStorage를 사용한다.
- 기기 간 자동 동기화가 되지 않는 현재 제약은 유지한다.

---

## 7. Pass 2 완료 조건 — 승인됨

Pass 완료 기준은 Product Decision이므로 코드 구현 전에 사용자의 명시적 승인이 필요하다.

### 권장안

다음 다섯 항목을 한 번씩 끝내면 `Chapter 3 · Pass 2 Complete`로 표시한다.

1. My Story Full Recall 완료
2. Real Conversations User = A, User = B, Full Dialogue 완료
3. Output Practice Variation 6개 자기평가 완료
4. Chapter Review 1세트 완료
5. Pass 2용 Weekly Writing 새 draft 1개 완료

다음은 완료 조건에 포함하지 않는다.

- Exact Recall 재학습
- No Hint 도전
- Grammar Focus
- What About You
- Pronunciation
- 특정 자기평가 등급 또는 정답률

이 권장안은 Pass 2의 네 구성 요소를 모두 실제로 거치면서도 완벽주의나 자동 채점으로
진행을 막지 않는 가장 단순한 기준이다.

### 대안

Chapter Review를 완료 조건에서 제외하고 Recommended로 둘 수 있다.
다만 PRD가 Chapter Review를 Pass 2의 주요 구성으로 명시하므로 권장안은 Core에 포함한다.

---

## 8. 화면 상태와 문구 원칙

- 진행 중: `Chapter 3 · Pass 2 · Reinforce`
- 완료: `Chapter 3 · Pass 2 Complete`
- 선택 영역 미실행을 `미완료`, `실패`, `% 부족`으로 표현하지 않는다.
- Pass 2 완료 후 Chapter 4 또는 Pass 3로 자동 이동하지 않는다.
- Pass 1 결과는 언제든 확인할 수 있어야 한다.
- Mobile에서는 주요 CTA, Hint, Answer, 다음 항목 이동이 한 손 범위에 머물러야 한다.
- Desktop에서는 한국어 Prompt와 영어 Answer 비교, Writing 공간, 회독 상태의 가독성을 우선한다.

---

## 9. 구현 순서 제안

전체 Pass 2를 한 번에 구현하지 않는다.

### Increment 1 — 진행 모델 + My Story 세로 흐름

- 기존 Pass 1 저장 데이터 migration
- 명시적 `Start Pass 2`
- Pass 2 Overview
- My Story Full Recall 중심 흐름
- Pass 1 / Pass 2 진행 기록 분리와 새로고침 복원

### Increment 2 — Real Conversations + Output Variation

- 회독별 Conversation 기록
- Variation 기본 진입
- Exact / No Hint 보조 경로 유지

### Increment 3 — Chapter Review + Weekly Writing + 완료 상태

- Recall 50% / Output 50% Review
- Pass 2 새 Writing draft
- 승인된 완료 조건 적용
- Pass 2 완료 요약

각 Increment는 구현 후 Desktop과 Mobile에서 실제 흐름을 확인하고 다음 단계로 넘어간다.

---

## 10. 구현 Acceptance Criteria

### 데이터 보존

- 기존 사용자의 Pass 1 진행 기록과 Writing이 migration 후 동일하게 남는다.
- Pass 2 시작·평가·작성으로 Pass 1 기록이 바뀌지 않는다.
- 새로고침 후 active pass, 현재 위치, 자기평가, 완료 상태가 복원된다.

### Source

- 앱이 제시하는 모든 영어 문장·힌트·질문이 기존 Chapter 3 Source에 존재한다.
- Variation은 현재 검증된 Supplement 6개만 사용한다.
- Source provenance를 유지한다.

### Flow

- Pass 1 완료 후 사용자가 직접 Pass 2를 시작할 수 있다.
- Pass 2의 시작부터 완료 요약까지 막힘 없이 진행할 수 있다.
- 보조 경로로 돌아가도 진행 기록이 손실되지 않는다.
- 선택 영역을 건너뛰어도 부정적인 미완료 UX를 표시하지 않는다.

### Responsive / Regression

- Desktop과 Mobile 주요 흐름을 모두 확인한다.
- 390×844와 320×740에서 긴 Prompt와 CTA가 잘리지 않는다.
- 녹음, Hint, Answer, Self Rating, 이어하기가 기존 Pass 1에서 회귀하지 않는다.
- 관련 unit test, build, 화면 상태별 UX 검증을 통과한다.

---

## 11. 승인된 구현 기준

다음 권장 묶음을 기준으로 Increment 1~3을 구현했다.

- Chapter 3만 대상으로 Pass 2를 구현한다.
- Pass 2는 사용자가 명시적으로 시작하며 Pass 1 기록을 보존한다.
- My Story는 Full Recall, Output은 Variation을 기본 경로로 한다.
- Pass 2 자기평가는 새로 시작하고 Pass 1 평가는 이력으로만 사용한다.
- Grammar Focus와 What About You는 Pass 2 완료를 막지 않는다.
- 권장 완료 조건의 다섯 Core 항목을 사용한다.
- Increment 1은 진행 모델 migration·Pass 2 진입·My Story, Increment 2는 Conversation·Variation, Increment 3은 Chapter Review·Writing·완료 상태로 나누어 구현했다.
- Increment 3 Review는 이 Pilot에서만 Source 기반 12문항(Recall 6 + Output 6) 고정 세트를 사용하며, 전역 Review 문제 수·간격·Smart Review 정책은 계속 Open 상태다.
