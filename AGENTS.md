# AGENTS.md

## 1. Project Overview

이 프로젝트는 영어 교재 기반의 **회독·아웃풋 중심 학습 Web App**이다.

이 제품의 목적은 새로운 영어 콘텐츠를 계속 제공하는 것이 아니다.

사용자가 이미 가지고 있는 메인 교재와 부교재를 반복하여:

Learn
→ Memorize
→ Recall
→ Output
→ Write
→ Review
→ Repeat

의 과정을 거치면서 최종적으로 **교재 없이도 배운 영어를 꺼내 쓸 수 있게 만드는 것**이 핵심이다.

제품의 기본 철학:

> Completion > Perfection

한 번에 완벽하게 학습하는 것이 아니라,
반복 회독을 통해 점진적으로 학습 완성도를 높인다.

---

## 2. Read Before Working

코드 수정 또는 기능 구현 전 반드시 다음 문서를 확인한다.

우선순위:

1. `AGENTS.md`
2. `docs/textbook_mastery_prd_v1_1.md`
3. `docs/codex_handoff.md`
4. 현재 작업 요청 또는 `docs/current_task.md`
5. `docs/sources/` 안의 관련 교재 및 부교재

기능 구현에 필요한 학습 콘텐츠가 있다면
추측하거나 새로 만들지 말고 반드시 원본 Source를 확인한다.

---

## 3. Source of Truth

충돌이 발생할 경우 아래 우선순위를 따른다.

1. 사용자의 현재 명시적 요청
2. `AGENTS.md`의 Non-Negotiable Rules
3. PRD의 확정 Decision
4. `codex_handoff.md`
5. Source 교재/부교재
6. 기존 구현

단, 학습 콘텐츠 자체의 문장과 표현은
항상 원본 교재/부교재를 Source of Truth로 한다.

기존 코드와 PRD가 다르면 기존 코드를 기준으로 기능을 확대하지 않는다.
먼저 PRD의 의도를 확인한다.

---

## 4. Non-Negotiable Content Rule

# SOURCE LOCKED LEARNING

이 프로젝트에서 가장 중요한 규칙이다.

앱이 학습 Target으로 제시하는 모든 영어 콘텐츠는
반드시 제공된 메인 교재 또는 부교재에 존재해야 한다.

허용 Source:

- Main Textbook
- My Story
- Real Conversations
- Useful Expressions
- Grammar Focus
- What About You?
- Beginner Template
- Let’s Have a Talk
- Supplementary My Story Notes
- Supplementary Real Conversations Notes
- Pronunciation / Intonation Notes
- Source에 포함된 Writing Prompt 또는 Practice Sentence

---

## 5. Never Generate New Learning Content

다음 행동은 금지한다.

- 교재에 없는 영어 예문 생성
- 새로운 Target Sentence 생성
- 새로운 Target Expression 추가
- “비슷한 예문 10개” 생성
- 교재에 없는 Pattern Drill 생성
- 교재 밖 고급 표현을 학습 항목으로 추천
- AI가 새로 만든 문장을 Review 정답으로 등록
- 사용자 Writing을 새로운 공식 학습 Sentence로 자동 등록

예:

BAD:

> `I prefer` 문형을 연습하기 위해 새로운 예문 10개를 생성한다.

GOOD:

> Source 자료 안에 있는 `I prefer` Variation을 찾아 문제로 사용한다.

새 학습 콘텐츠가 필요하지만 Source에 없다면
임의 생성하지 말고 해당 콘텐츠가 없음을 명시한다.

---

## 6. User-Generated Output Exception

사용자가 직접 작성하거나 말하는 내용은 자유롭게 생성 가능하다.

예:

- 자기 경험
- 자기소개
- 자유 작문
- What About You 답변
- Weekly Writing

단, 앱이 피드백으로 새로운 영어를 가르칠 때는
가능한 한 이미 학습한 Source 표현 안에서 해결한다.

우선순위:

1. 현재 Chapter 표현
2. 이전에 학습한 Chapter 표현
3. Source 안의 다른 표현

Source 밖 표현이 꼭 필요하다면
새 학습 Target으로 추가하지 않는다.

---

## 7. Product Learning Structure

각 Chapter는 기본적으로 다음 구조를 가진다.

1. My Story
2. Real Conversations
3. Output Practice
4. Grammar Focus
5. What About You?
6. Weekly Writing
7. Pronunciation & Intonation

초기 회독 Core Learning:

- My Story
- Real Conversations
- Output Practice
- Weekly Writing

Grammar Focus와 What About You는 초기에는 Recommended,
고회차에서는 Required로 확장한다.

Pronunciation & Intonation은 별도의 학습 영역이다.

---

## 8. My Story Rules

My Story의 핵심 목적은 **본문 암기와 Recall**이다.

기본 Flow:

Read
→ Chunk Recall
→ Paragraph Recall
→ Full Recall

Read 단계에서는 자유롭게:

- Korean
- English
- Korean + English

전환할 수 있어야 한다.

Recall에서는 한국어 Source를 먼저 보여주고
사용자가 영어를 직접 꺼내도록 한다.

영어 정답을 먼저 노출하지 않는다.

---

## 9. Recall Rules

Recall UI의 기본 구조:

- Korean Source
- Speak / Think
- Hint 1
- Hint 2
- Show Answer
- Self Rating

Self Rating:

- 바로 나왔어요
- 생각해서 나왔어요
- 다시 봐야 해요

Hint 역시 Source Text 안에서만 구성한다.

### Recall에서 평가하지 않는 것

Pronunciation accuracy.

Recall과 Pronunciation은 서로 다른 학습 목표이다.

발음이 부족하다는 이유만으로 Recall 실패로 처리하지 않는다.

---

## 10. Memorization Philosophy

정답 문장과 단어 하나까지 100% 일치해야만 성공으로 만드는
과도한 Hard Grading을 기본값으로 사용하지 않는다.

핵심은:

- Target Expression
- 핵심 구조
- 의미 보존
- 본문 Recall 수준

이다.

자동 판정은 사용자 자기판정을 보조하는 역할로 설계한다.

사용자의 학습 진행을 불필요하게 차단하지 않는다.

---

## 11. Real Conversations Rules

Real Conversations는 일반 문장 암기보다
Dialogue 특성을 활용한다.

지원 구조:

- User = A
- User = B
- Full Dialogue

상대방 대사를 Prompt로 보여주고
사용자가 다음 대사를 Recall할 수 있어야 한다.

Full Dialogue에서는 전체 Conversation을 재현할 수 있게 한다.

---

## 12. Output Practice Rules

Output Practice의 목적:

> 외운 문장을 다른 상황에서도 꺼내 사용할 수 있게 만든다.

문제 Source는 반드시 부교재 또는 메인 교재에 존재해야 한다.

권장 Difficulty:

- Level 1: Exact Recall
- Level 2: Controlled Variation
- Level 3: No Hint / Situation Recall

AI가 Variation을 새로 생성하지 않는다.

Source에 존재하는 Variation만 사용한다.

---

## 13. Grammar Focus Rules

초기 회독:

Recommended / Optional

고회차:

Required

초기 회독에서 Grammar Focus를 Skip했다고
Chapter Pass를 실패 처리하지 않는다.

Grammar를 지나치게 깊게 파고들도록 강제하지 않는다.

---

## 14. What About You Rules

What About You는:

> Textbook English → My English

로 이동하는 Bridge이다.

Source:

- What About You
- Beginner Template
- Let’s Have a Talk

사용자 답변은 자유롭게 만들 수 있다.

초기 회독에서는 Recommended,
고회차에서는 Required.

---

## 15. Weekly Writing Rules

각 Chapter 종료 시 Weekly Writing을 제공한다.

목적:

> 그 Chapter에서 학습한 표현들을 조합해 하나의 자기 이야기를 완성한다.

지원 Mode:

1. Free Writing
2. Guided Writing
3. Template Writing

Guided Writing은 교재의 질문을 사용한다.

Template Writing은 교재의 Beginner Template을 사용한다.

AI가 새로운 Writing Prompt를 기본 학습 콘텐츠로 생성하지 않는다.

---

## 16. Writing Feedback Rules

이 서비스는 일반적인 AI Writing Rewriter가 아니다.

사용자 문장을 고급 영어로 전면 재작성하는 것을 기본 행동으로 하지 않는다.

Feedback Priority:

1. 현재 Chapter 표현을 사용했는가
2. 이미 배운 표현을 사용했는가
3. 의미가 전달되는가
4. 필수적인 문법 오류가 있는가
5. Source 안의 표현으로 개선할 수 있는가

결과는 가능하면 다음처럼 보여준다.

- 이번 글에서 사용한 표현
- 아직 사용하지 않은 표현
- 다시 활용해볼 표현

새로운 표현을 많이 추천하는 방향으로 가지 않는다.

---

## 17. Review Rules

Review는 새로운 콘텐츠 학습이 아니라
이미 학습한 내용을 다시 꺼내는 영역이다.

초기:

Chapter Review

중간:

Mixed Chapters

고회차:

Smart Review / All Random

초기 회독에서 학습하지 않은 Chapter의 문장을 섞지 않는다.

---

## 18. Review Workload

기본 Review Set은 약 20~30분 안에 소화 가능한 분량을 목표로 한다.

하지만 이는:

- Timer가 아니다.
- 강제 시간 제한이 아니다.
- 하루 최소 학습 시간이 아니다.

사용자는 언제든 중단하거나 계속할 수 있다.

---

## 19. Review UX

사용자에게 압박감을 주는 Backlog UX를 사용하지 않는다.

BAD:

> 복습 83개 밀렸습니다.

GOOD:

> 오늘 추천 복습  
> 약 20~30분

Review 상태는 실패보다
“다시 만날 시점”을 결정하는 데이터로 사용한다.

---

## 20. Smart Review Priority

기본 우선순위:

1. 다시 봐야 해요
2. Hint 사용이 많은 항목
3. 오래 보지 않은 항목
4. 최근 학습 항목
5. 안정적으로 Recall되는 항목

세부 알고리즘은 PRD 또는 이후 테스트 결과에 따라 조정한다.

임의로 Spaced Repetition 정책을 확정하지 않는다.

---

## 21. Pronunciation Rules

Pronunciation & Intonation은 별도 Lab으로 취급한다.

기본 구조:

Listen
→ Repeat
→ Record
→ Playback
→ Retry

Pronunciation 결과를 Recall Completion에 직접 연결하지 않는다.

---

## 22. Pass System

기본 Pass Model:

- Pass 1 — Familiar
- Pass 2 — Reinforce
- Pass 3 — Complete
- Pass 4+ — Automatic

회독이 올라갈수록 새로운 콘텐츠를 계속 추가하기보다
**도움 장치를 점진적으로 줄이는 것**을 우선한다.

예:

Pass 1:
- Korean prompt
- Target hint
- Template

Later Pass:
- Hint 감소
- Chapter 표시 감소
- Pattern 이름 제거
- Mixed / Random 증가

---

## 23. No Forced Pace

다음 행동은 금지한다.

- 일정 시간이 지나면 자동 Chapter 이동
- 특정 회독 완료 전 다음 Chapter Hard Lock
- 하루 최소 문제 강제
- 강제 Study Streak
- Timer 기반 학습 실패 처리

서비스는 학습 경로를 추천하지만
최종 학습 속도는 사용자에게 맡긴다.

---

## 24. Completion UX

Grammar 또는 Optional 영역을 하지 않았다고
초기 Pass를 불완전하게 표현하지 않는다.

GOOD:

```text
Chapter 3 · Pass 1 Complete

My Story            ✓
Real Conversations  ✓
Output Practice     ✓
Weekly Writing      ✓

Grammar Focus       Next Pass
What About You      Next Pass
```

BAD:

```text
Chapter 3
80% Complete
2 sections missing
```

---

## 25. Main Platform

기본 플랫폼:

> PC + Mobile Responsive Web App

모든 주요 기능은 PC와 Mobile 모두에서 접근 가능해야 한다.

기능 자체를 디바이스별로 강제 분리하지 않는다.

PC는 깊은 학습에 적합하게,
Mobile은 Recall / Review에 편하게 설계한다.

---

## 26. Responsive UX Requirements

모바일에서 다음을 특히 확인한다.

- 주요 CTA가 한 손으로 접근 가능한가
- Recall 버튼이 화면 밖으로 지나치게 밀리지 않는가
- 긴 Korean Prompt가 읽기 편한가
- Hint / Answer 버튼이 명확한가
- 다음 문제 이동이 빠른가

Desktop에서는:

- 본문 비교 가독성
- Korean / English 병렬 View
- Writing 공간
- Progress 확인

을 중요하게 본다.

---

## 27. Development Principle

전체 제품을 한 번에 구현하지 않는다.

기본 개발 방식:

Implement Small
→ Run
→ Test
→ Get Feedback
→ Revise
→ Expand

하나의 학습 Flow가 실제로 작동하는 것을 확인한 뒤
다음 기능으로 넘어간다.

---

## 28. Current Task Scope

`AGENTS.md`에는 특정 Phase의 구현 범위를 고정하지 않는다.

예:

- Chapter 3만 구현
- My Story까지만 구현

같은 내용은 현재 작업 Prompt 또는:

`docs/current_task.md`

에 기록한다.

AGENTS.md는 프로젝트 전체에서 계속 유지될 규칙만 포함한다.

---

## 29. Do Not Overbuild

Prototype 단계에서는 필요하지 않은 인프라를 미리 만들지 않는다.

명시적 요구가 없다면 우선 추가하지 않는다.

예:

- Auth
- Payments
- Admin
- Complex backend
- Cloud database
- Push Notification
- Production analytics
- Native App
- Complex AI orchestration

현재 학습 UX 검증에 필요한 최소 구현을 우선한다.

---

## 30. Local Prototype State

Prototype에서 서버 DB가 요구되지 않았다면
localStorage 또는 간단한 Client State를 사용할 수 있다.

저장 대상 예:

- currentChapter
- currentPass
- currentSection
- chunkProgress
- recallState
- hintUsage
- fullRecallCompleted
- lastStudiedAt

향후 DB로 이전할 수 있도록
UI와 저장 로직을 과도하게 결합하지 않는다.

---

## 31. Content Provenance

가능하면 모든 학습 Item에는 Source 정보를 유지한다.

권장 Metadata:

- contentId
- chapterId
- week
- section
- sourceType
- sourceFile
- sourcePage
- koreanText
- englishText
- targetExpression
- exerciseType
- reviewEligibility

Source 확인이 어려운 문장은
학습 데이터에 추가하지 않는다.

---

## 32. Repository Structure

권장 구조:

```text
.
├── AGENTS.md
├── docs/
│   ├── textbook_mastery_prd_v1_1.md
│   ├── codex_handoff.md
│   ├── current_task.md
│   └── sources/
├── src/
├── public/
└── README.md
```

기존 프로젝트 구조가 있다면
불필요하게 전면 재구성하지 않는다.

---

## 33. Content vs UI Separation

학습 Source Data를 UI Component 안에 직접 길게 Hard-code하지 않는 것을 권장한다.

가능하면:

content data
↓
learning logic
↓
UI

를 분리한다.

목적:

- 다른 Chapter 확장
- Source 검증
- Review 재사용
- Pass별 Difficulty 조절

을 쉽게 하기 위함이다.

---

## 34. Reusable Learning Components

가능하면 Chapter마다 별도 페이지를 복제하지 않는다.

재사용 가능한 구조를 선호한다.

예:

- ChapterOverview
- SourceReader
- RecallCard
- HintPanel
- RecallRating
- DialoguePractice
- OutputCard
- WritingEditor
- ReviewSession
- ProgressSummary

단, 지나친 추상화는 피한다.

현재 Prototype에 필요한 수준보다 복잡한 Framework를 만들지 않는다.

---

## 35. Testing Requirements

기능 구현 후 최소 다음을 확인한다.

### Content

- Source에 없는 영어 문장이 추가되지 않았는가?
- Korean / English Pair가 올바른가?
- Target Expression이 Source와 일치하는가?

### Flow

- 처음 화면부터 마지막 화면까지 진행 가능한가?
- 뒤로가기 / 이어하기가 가능한가?
- 상태가 정상적으로 저장되는가?

### Recall

- Hint 1이 작동하는가?
- Hint 2가 작동하는가?
- Answer Reveal이 작동하는가?
- Self Rating이 저장되는가?

### Responsive

- Desktop 동작
- Mobile 동작
- 긴 텍스트 Overflow 없음
- 핵심 CTA 접근 가능

### Regression

기존 학습 Flow를 깨뜨리지 않았는가?

화면 간 이동·하단 버튼·필수/선택 표시를 수정할 때는
[`skills/ux-flow-qa/SKILL.md`](skills/ux-flow-qa/SKILL.md)의 화면 상태별 검증 절차도 적용한다.

사용자가 보고한 오류와 테스트에서 발견한 문제는
[`docs/issue_log.md`](docs/issue_log.md)에 문제 정의, 확인된 사실과 원인 가설,
해결 액션 아이템, 해결 여부 및 검증 결과를 기록한다. 실제 기기에서 검증하지 않은
수정은 `해결 확인`으로 표시하지 않는다. 미해결 항목도 누락하지 않는다.

### Verification Execution and User Checklist

녹음 기능 검증 또는 무음 문제 진단 시에는 `docs/verification.md`의
`Microphone preflight` 절차를 반드시 먼저 수행한다. 장치의 `OK` 표시나
녹음 파일 생성만으로 통과 처리하지 않는다. 내장·외장 입력을 구분하고,
Windows 기본 입력 장치, 해당 장치의 음소거와 입력 볼륨, 브라우저의 실제
사용 입력 장치를 확인한다. 확인할 수 없는 항목은 미확인으로 기록한다.
운영체제에서 음소거가 다시 켜지는 원인은 별도로 추적하며, 검증을 위해
사용자의 음소거를 무조건 해제하거나 앱 실행 때 자동 해제하지 않는다.

점검 항목은 처음부터 사용자에게 넘기지 않는다. Codex가 직접 확인할 수 있는 항목은
자동 검사, 코드·상태 확인, 데스크톱·모바일 폭의 브라우저 점검 순서로 먼저 실행한다.

웹 기능 검증이 필요할 때는 다음 순서를 따른다.

1. 로컬 앱이 실행 중인지 확인하고, 필요하면 현재 요청 범위 안에서 개발 서버를 실행한다.
2. Aside를 사용할 수 있지만 꺼져 있다면 먼저 실행과 연결을 시도한다.
3. Aside를 사용할 수 없거나 연결에 실패하면 computer use 또는 Codex 내장 브라우저로
   자동 점검 가능한 웹 기능을 계속 확인한다.
4. 실패 항목은 재현 조건과 원인을 확인한다. 현재 요청이 수정까지 포함하면 범위 안에서
   해결한 뒤 해당 항목과 관련 회귀 검사를 다시 실행한다. 상태 확인만 요청받았다면 파일을
   수정하지 않고 확인된 실패로 보고한다.
5. 한 도구의 실패만으로 사용자 점검 항목으로 넘기지 않는다. 사용할 수 있는 다른 자동
   점검 방법을 시도하고, 재검증 후에도 사람이 직접 확인해야 하는 항목만 남긴다.

검증 결과는 다음처럼 분리한다.

- Codex가 확인한 항목: `[x]`로 표시하고 사용한 방법과 실제 결과를 짧게 적는다.
- 실패 또는 미해결 항목: `[ ]`로 표시하고 원인, 시도한 해결, 남은 이유를 적는다.
- 사용자 확인이 꼭 필요한 항목: 실제 기기 감각, 실제 마이크·스피커, 브라우저 권한 결정처럼
  자동화가 대신할 수 없는 것만 `[ ]` 체크박스로 제시한다.
- 실행하지 않은 항목은 통과로 표시하지 않고 `미실행`으로 명시한다.

Aside, computer use, 내장 브라우저의 시뮬레이션 결과를 실제 모바일 기기나 실제 마이크
검증으로 표현하지 않는다. 상세 절차와 보고 형식은
[`docs/verification.md`](docs/verification.md) 및
[`skills/ux-flow-qa/SKILL.md`](skills/ux-flow-qa/SKILL.md)를 따른다.

---

## 36. Acceptance Before Moving to Next Phase

현재 Phase가 다음 조건을 만족하기 전
다음 Phase 기능을 대규모로 구현하지 않는다.

- 실행 가능
- 사용자가 실제로 테스트 가능
- Source Rule 위반 없음
- 기본 Responsive 동작
- Progress 저장
- 주요 Flow 완료 가능

---

## 37. Ambiguity Handling

요구사항이 애매할 경우:

1. PRD 확인
2. Handoff 확인
3. Source 확인
4. 현재 Task 확인

그래도 결정할 수 없다면
제품 정책을 임의로 새로 만들지 않는다.

작은 구현 세부사항은 합리적으로 결정할 수 있지만,
다음과 같은 Product Decision은 임의로 확정하지 않는다.

- Pass Completion 기준
- Recall 자동 합격 기준
- Review 간격
- 새로운 AI 기능
- Source 범위 확대
- Grammar 필수 전환 시점
- Writing 교정 정책

---

## 38. Open Questions

PRD에서 아직 Open 상태인 항목은
코드 구현 편의를 위해 임의 확정하지 않는다.

특히:

- Recall 자동 판정 기준
- AI 평가와 Self Rating 비중
- Spaced Review 간격
- Smart Review Weight
- Writing Correction 범위
- STT Provider
- Pronunciation Scoring

은 테스트 후 결정한다.

---

## 39. Definition of Done

하나의 기능은 코드가 존재한다고 완료된 것이 아니다.

Done의 최소 조건:

1. 실제 실행 가능
2. 사용자 Flow에서 접근 가능
3. Desktop과 Mobile에서 기본 사용 가능
4. 상태가 필요한 경우 저장 가능
5. Source Rule 위반 없음
6. 기존 Flow를 깨뜨리지 않음
7. 사용자가 직접 테스트할 수 있음

---

## 40. Final Decision Filter

기능 또는 구현 방향이 애매할 때 다음 질문을 사용한다.

> 이 기능이 사용자가 이미 배운 영어를
> 더 잘 기억하고,
> 더 잘 꺼내고,
> 더 잘 활용하도록 돕는가?

YES:
검토 후 유지.

NO:
우선순위를 낮춘다.

단순히 새로운 콘텐츠 양을 늘리는 기능은
이 제품의 핵심 가치가 아니다.

---

## 41. Git Workflow Notifications and Approval

모든 Git 상태 변경은 사용자의 명시적 승인을 받은 뒤 실행한다.

### Before Starting Work

작업을 시작하기 전에 다음 내용을 먼저 알린다.

```text
작업 시작 전 확인:
origin/main의 최신 변경사항을 확인합니다.
필요한 경우 사용자가 지시한 뒤에만 pull합니다.
```

확인 항목:

- 현재 브랜치
- 로컬 작업 트리 상태
- 로컬 HEAD와 GitHub `origin/main`의 동기화 상태

이 단계에서는 사용자의 명시적 지시 없이 다음 작업을 실행하지 않는다.

- `git pull`
- 브랜치 생성 또는 전환
- 파일 수정

### Required Branch Recommendation Before Each Work Session

매번 작업 시작 전에 요청한 작업의 성격과 현재 브랜치의 병합 상태를 확인하고,
어느 브랜치에서 진행하는 것이 좋은지 이유와 함께 사용자에게 먼저 제안한다.
사용자가 브랜치 생성 시점을 직접 판단하도록 맡기지 않는다.

판단 기준:

| 작업 상황 | 기본 제안 |
| --- | --- |
| 아직 main에 머지하지 않은 기능의 수정·보완 | 기존 작업 브랜치에서 계속 |
| 새 기능 또는 기존 작업과 독립적인 변경 | 최신 main 기준으로 새 작업 브랜치 |
| 이미 main에 머지한 기능의 추가 수정·버그 수정·문서 변경 | 최신 main 기준으로 새 수정 브랜치 |
| 독립적인 여러 작업을 동시에 진행할 필요가 있음 | 필요할 때만 브랜치·워크트리를 분리하고 서브에이전트로 병렬 진행 제안 |

같은 기능을 수정하더라도 기존 브랜치가 이미 머지됐다면 계속 재사용하는 것을 기본으로 삼지 않는다.
집 컴퓨터와 STA Track 컴퓨터에서 번갈아 작업하므로 최신 원격 상태를 확인하고,
다른 컴퓨터에서 반영한 변경을 빠뜨리지 않도록 한다. 원격 확인이 불가능하면 최신이라고 단정하지 않는다.
미커밋 변경과 기존 worktree를 먼저 확인하며, 사용자 작업을 덮어쓰거나 임의로 stash·삭제하지 않는다.

작업 시작 시 제시할 내용:

1. 현재 브랜치, 미커밋 변경 유무, 원격 main과의 차이, 관련 PR의 병합 여부
2. 이번 작업의 성격과 추천 방식: 기존 브랜치 계속 / 최신 main 기준 새 브랜치 / 필요한 병렬 작업 공간
3. 추천 이유, 필요한 pull·브랜치 생성·전환 등과 승인 요청

예시:

> 이번 작업은 main에 머지된 Chapter 3의 UI 수정입니다. 최신 main을 기준으로 새 수정 브랜치에서 진행하는 것이 좋겠습니다. 최신 내용 반영과 브랜치 생성을 진행할까요?

제안은 자동 실행 승인이 아니다. pull, 브랜치 생성·전환, worktree 생성,
commit, push, PR 생성, merge는 해당 작업에 대한 사용자의 명시적 승인 범위 안에서만 실행한다.
이미 해당 범위를 명시적으로 승인받았다면 승인 사실과 진행 방식을 안내하고 진행한다.
단순 설명·조회 요청만으로 브랜치를 전환하거나 만들지 않는다.

### Cross-Computer Pull Safety

집 컴퓨터와 STA Track 컴퓨터 사이에서 변경사항을 동기화할 때:

1. Pull 전에 현재 브랜치와 모든 로컬 변경사항을 확인한다.
2. 작업 트리가 깨끗하면 사용자 승인 후 `git pull --ff-only`를 사용한다.
3. 로컬 변경이 있으면 자동으로 Pull하거나 파일을 덮어쓰지 않는다.
4. 변경 내용을 보고하고, 사용자가 승인한 경우에만 이름 있는 stash를 만든다.
5. Pull 후 원격 변경과 stash가 중복되는지 확인한다.
6. 중복이면 stash를 적용하지 않고 보관한다.
7. 중복이 아니면 `git stash apply`만 사용하고, 충돌 시 즉시 중단한다.
8. 검증이 끝날 때까지 stash를 삭제하지 않는다.
9. Commit과 Push는 별도의 명시적 승인을 받은 뒤 수행한다.
10. 검증이 끝난 stash도 사용자의 명시적 승인 없이 삭제하지 않는다.

### After Finishing Work

작업을 마친 뒤 다음 내용을 먼저 알린다.

```text
작업 완료 후 확인:
현재 변경사항을 확인합니다.
사용자가 지시한 뒤에만 commit하고 origin/main 또는 승인된 작업 브랜치에 push합니다.
```

보고 항목:

- 변경된 파일
- 주요 diff 요약
- 실행한 테스트와 결과
- 현재 브랜치와 원격 저장소의 동기화 상태

사용자의 명시적 지시 없이 다음 작업을 실행하지 않는다.

- `git add`
- `git commit`
- `git push`
- Pull Request 생성 또는 수정
- Pull Request merge
- 브랜치 삭제

### Required Safety Check Before Every Commit and Push

사용자가 커밋·푸시를 승인했더라도 아래 검사는 매번 생략하지 않는다.

1. 현재 브랜치, 원격 저장소와 대상 브랜치, 변경·신규·삭제 파일 및 기존 staged 파일을 확인한다. 승인된 작업에 해당하는 파일만 명시적으로 stage한다. 무관한 사용자 파일을 함께 올리지 않는다.
2. `.gitignore`뿐 아니라 실제 staged 파일 목록을 검사한다. 교재 PDF, `node_modules/`, `.env` 및 비밀 환경설정, `.DS_Store`, `build/`, `dist/`, `.next/`, 녹음·로그·임시 산출물이 포함되지 않았는지 확인한다. 이미 추적 중인 파일은 ignore만으로 제외되지 않음을 유의한다.
3. 업로드할 파일과 staged diff에서 API 키, GitHub OAuth/PAT, 비밀번호, 개인 키, 인증정보가 포함된 URL, 불필요한 개인정보·개인 컴퓨터 경로를 검사한다. 탐지한 비밀값을 출력·채팅·커밋 메시지에 노출하지 않는다.
4. 실제 적용되는 Git 작성자 이메일이 승인된 noreply 주소인지 확인하고, 원격 URL에 토큰이나 비밀번호가 포함되지 않았는지 확인한다. 인증 토큰 저장소를 불필요하게 열거나 출력하지 않는다.
5. 최종 staged diff와 파일 목록을 다시 검토하고, 관련 테스트·빌드 결과 및 제외 파일을 보고한 뒤 승인된 브랜치에만 commit·push한다. 민감정보나 범위 밖 파일이 발견되면 업로드를 중단하고 정리·확인 후 재검사한다.
6. push 후 로컬 HEAD와 원격 브랜치의 커밋이 같은지, 남은 변경사항은 무엇인지 확인한다. 검사 범위와 한계를 사실대로 설명하며 민감정보가 절대 없다고 단정하지 않는다.

수정 완료 안내에는 사용자가 바로 확인할 수 있는 앱 링크를 항상 포함한다. GitHub에 push했다면 해당 브랜치 또는 커밋 링크도 함께 제공한다.
