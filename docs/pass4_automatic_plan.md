# Pass 4+ Automatic

## Goal

Pass 1–3에서 실제로 자기평가한 Source 항목을 Chapter 단서에 덜 의존하며 다시 꺼내고,
여러 Chapter의 표현을 한 번에 활용한다. Chapter별 Pass 4 화면을 복제하지 않고 전역 학습
공간으로 제공한다.

## Included

- Mixed Chapters: 학습 기록이 있는 Chapter를 두 개 이상 사용자가 선택한다.
- Smart Review: `다시 봐야 해요` → Hint 2 → Hint 1 → `생각해서 나왔어요` →
  `바로 나왔어요` 순서와 오래된 기록을 사용해 우선순위를 정한다.
- All Random: 학습한 모든 Source 항목을 섞고 정답 공개 전 Chapter·Pattern·Source 단서와
  Hint를 숨긴다.
- Multi-Chapter Writing: 학습 기록이 있는 Chapter 두 개 이상을 고르고 사용자가 자유롭게
  작성한다.
- 기존 Pass 1–3 기록과 Pass 4+ 세션·평가·Writing을 version 6 저장 구조에서 함께 보존한다.

## Source and completion boundaries

- 자동 Review 대상은 기존 Chapter Source 묶음에 있고 사용자가 Recall 자기평가를 남긴
  항목만 허용한다.
- Writing 본문은 사용자 생성 Output이며 공식 학습 Target으로 등록하지 않는다.
- Pass 4+는 반복 공간이므로 Chapter 완료를 다시 잠그거나 실패 상태를 만들지 않는다.
- 고정 문제 수, 시간 제한, 일일 최소량을 두지 않는다.

## Decisions deliberately left open

- Smart Review의 숫자 Weight와 간격
- Spaced Repetition 일정
- 자동 합격 기준과 STT·AI 채점
- 전역 Writing 교정 정책

이 항목은 PRD의 Open Question이며 현재 Prototype에서 임의 확정하지 않는다.

## Acceptance

- version 5 기록이 version 6으로 이전되며 Chapter 기록이 보존된다.
- 학습하지 않은 Source 항목이 전역 Review에 들어오지 않는다.
- Mixed는 두 Chapter 미만에서 시작되지 않는다.
- Smart 우선순위, All Random 단서 제거, 평가 저장, Writing 저장이 동작한다.
- Desktop과 320px 반응형에서 전체 Flow를 사용할 수 있다.
