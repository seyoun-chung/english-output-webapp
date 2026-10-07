# Textbook Mastery PRD v1.2

> 교재를 따라 읽게 하는 앱이 아니라, **교재 없이도 말할 수 있게 될 때까지 반복시키는 앱**

- **문서 상태:** 현재 제품 v1 구현·운영 근거 반영 (2026-10-07), 향후 기능·Open Questions는 미확정
- **플랫폼:** PC + Mobile Responsive Web App
- **제품 유형:** 교재 기반 영어 회독·아웃풋 학습 Web App
- **핵심 학습 루프:** Learn → Memorize → Recall → Output → Write → Review → Repeat
- **콘텐츠 정책:** Main Textbook + Supplement Only
- **학습 철학:** Completion > Perfection

---

## 0. 현재 제품 범위와 제출 기준 — 2026-10-07

이 개정은 확정된 제품 원칙을 유지하면서 실제 구현·검증 상태를 반영한다. 파일명은 기존
문서 링크 호환을 위해 유지한다. Chapter 3만 제공하던 초기 Prototype 제약은 과거 단계다.

### 개발 배경과 대상

같은 영어 교재를 공부하는 부트캠프 커뮤니티의 주간 회고에서 혼자 복습하며 아웃풋을
연습하기 어렵다는 의견이 반복됐고, 제작자도 독학 중 같은 문제를 경험해 앱을 개발했다.
교재를 이미 보유하고 적법하게 이용하는 학습자를 중심으로 설계한다. 운영진의 허락을
받아 커뮤니티에 공유할 예정이며, 허락받지 못하면 개인용으로 사용한다.

### 구현된 제품

| 영역 | 현재 동작 |
| --- | --- |
| 플랫폼·범위 | PC·모바일 반응형 웹, Chapter 1–12, 챕터별 Pass 1–3 및 전체 Pass 4+ |
| My Story | 한국어/영어/Both Read, Chunk Recall, Full Recall, Source 기반 힌트·정답, 자기평가 |
| 대화·아웃풋 | Read, A/B 역할·Full Dialogue, Exact/Source Variation/No Hint |
| 작문·선택 학습 | Free/Guided/Template Writing, Grammar Focus, What About You?; 회독별 기록 분리 |
| 복습 | Chapter Review의 전체/어려운 항목, Pass 4+ Mixed/Smart/All Random 및 Multi-Chapter Writing |
| 회독 완료 | Pass 1 Core 4개, Pass 2 Core 5개, Pass 3 Core 7개 충족 후 명시적 Finish; 구체 목록은 24절 |
| 계정·저장 | Google 로그인, 서울 Supabase 계정별 진도·답변·작문, 자동 저장·복원과 로그아웃 후 이어하기 |
| 기록 보호 | 손상 데이터 덮어쓰기 방지, 동시 수정 충돌 보호, 제한된 서버 recovery 사본; 정상 학습 화면에 수동 백업/동기화 설정을 노출하지 않음 |
| 녹음 | 선택형 Record/Playback 자기 점검, 브라우저 임시 사용; 서버 업로드·STT·발음 채점 없음 |
| 디자인 | 도서관/카페 일러스트, 월넛·올리브·종이색 스킨을 12챕터와 Pass 4+에 공통 적용 |
| 운영·측정 | Vercel 고정 HTTPS 앱, 공개 정책 페이지, 동의 기반 GA4 유입/화면 흐름, 별도의 최소 학습 이용 기록 |

로그인의 목적은 사용자별 기록 분리와 PC/모바일 이어하기다. 교재 라이선스 이용자를
중심으로 한 이용 맥락을 지원하지만, 프론트 로그인만으로 교재 JS 자산의 접근권한이나
콘텐츠 재배포 권리를 보장하지 않는다. 커뮤니티 계정 allowlist·가입 승인 기능은 계획에 넣지 않는다.

2026-10-07 main `bb73204`와 Vercel `dpl_8cKo2wQZf1Dbfnsr9J5Lckk6w16G` 기준으로
스킨 배포, Google 로그인과 기록 이어하기를 확인했다. 50파일/435테스트·빌드 및 로컬 전
학습 흐름 검수는 verification·study_village_skin의 근거를 따른다. 이번 운영 검증은 대표
학습 흐름/375px·1196px 확인이며 실제 휴대폰·마이크 재검증 또는 모든 운영 계정/부하 검사는 아니다.

### 향후 고도화와 미구현 영역

1. GA4와 앱 사용 기록을 대시보드로 시각화하여 사용성·중단 구간·반복 이용을 분석하고 개선한다.
   대시보드와 커뮤니티 실사용 성과는 아직 만들어지거나 검증된 결과가 아니다.
2. 교재 Source 범위 안에서 Recall·역할 연습·배운 표현 확인·약한 항목 복습·힌트 조절을
   돕는 AI 에이전트를 연결한다. 현재 AI/STT 자동 평가·작문 교정 기능은 미구현이다.
3. Pronunciation & Intonation Lab, Paragraph Recall 독립 단계, 계절별 배경 전환,
   Native/PWA/알림은 현재 완료 범위에 포함하지 않는다. 미래 요구사항을 구현 완료로 쓰지 않는다.

### 제출·공유 순서

운영 배포·검증 → 주요 문서 최신화 및 main 반영 → 별도 세션의 A4 1~2장 Word
기획서 → 사용자 검토·최종 승인 → PDF 제작·렌더 검증 → PDF/최종 문서
commit·push·PR·merge → 최종 main의 개인정보·비밀정보·교재 원본·Git 이력 검사와
필요 시 정리·재검사 → 별도 공개 승인 → **웹 앱과 PDF가 포함된 GitHub URL 과제 제출**
→ 앱 링크의 운영진/커뮤니티 전달 여부 결정. 고정된 전체 12단계는 current_task.md에 기록한다.

운영진/참여자 추적 링크는 이미 존재하며 같은 앱에 서로 다른 UTM을 붙인 링크다.
별도 권한의 앱으로 설명하거나 삭제하지 않는다. 심사용 GitHub 제출처와 커뮤니티 게시처는 다르다.

---

## 1. Product Summary

### 한 줄 정의

교재와 부교재를 반복적으로 학습하면서 **암기 → 인출 → 활용 → 작문 → 누적 복습 → 재회독**을 통해 배운 영어를 실제로 꺼내 쓸 수 있는 지식으로 만드는 아웃풋 중심 학습 서비스.

### 핵심 가치

> 더 많은 영어를 배우게 하는 것이 아니라, **이미 배운 영어를 내 것으로 만든다.**

### 제품 포지셔닝

> **혼자서도 영어 교재를 끝까지 내 것으로 만드는 회독·아웃풋 학습 Web App**

또는

> **교재를 읽는 공부에서, 써먹는 공부로.**

---

## 2. Problem

혼자 영어 교재를 공부하는 학습자는 콘텐츠 부족보다 **학습 방법의 부재**를 더 크게 겪는다.

주요 문제는 다음과 같다.

- 어디까지 외워야 하는지 모른다.
- 외웠는지 스스로 확인하기 어렵다.
- 아웃풋 연습을 어떻게 해야 하는지 모른다.
- 이전 Chapter를 언제 다시 복습해야 하는지 모른다.
- Chapter가 쌓일수록 복습량 관리가 어렵다.
- 처음부터 모든 내용을 완벽하게 하려다 쉽게 지친다.
- 발음·문법·암기·작문을 한꺼번에 하려다 학습 부담이 커진다.

본 제품은 새로운 영어 콘텐츠를 계속 추가하기보다 **교재를 소화하는 방법을 시스템화**한다.

---

## 3. Product Vision

사용자가 교재의 문장을 다음 단계로 발전시키는 것이 목표다.

1. **읽으면 안다**
2. **한국어를 보면 영어가 나온다**
3. **변형된 상황에서도 사용할 수 있다**
4. **내 이야기로 사용할 수 있다**
5. **어느 Chapter 표현인지 생각하지 않고 사용할 수 있다**

---

## 4. Product Philosophy

### 4.1 완벽주의가 아닌 완성주의

한 번에 100%를 요구하지 않는다.

회독을 거치며 완성도를 높인다.

- 1회독: 핵심 본문 확보
- 2회독: 변형과 인출 강화
- 3회독: Chapter 전체 완성
- 4회독+: Chapter 경계를 넘어 자동화

틀린 것은 실패가 아니라 **다음 회독에서 다시 만날 내용**으로 본다.

### 4.2 학습 지속성이 최우선

서비스는 사용자를 압박하지 않는다.

- 강제 공부 시간 없음
- 하루 최소 공부량 없음
- 자동 종료 없음
- 다음 Chapter 강제 이동 없음
- 밀린 복습 개수 압박 없음
- 회독 속도 제한 없음

### 4.3 1 Chapter = 1주 권장

교재 커리큘럼을 따라 **1 Chapter ≈ 1주**를 권장하지만, 학습 속도는 사용자 자율이다.

### 4.4 Progress, Not Pressure

진행 상황은 보여주되 평가와 압박은 최소화한다.

---

## 5. Content Source Policy

### 5.1 Source Locked Learning

시스템이 제공하는 모든 학습용 Target Content는 **메인 교재 또는 부교재에서만 가져온다.**

#### 허용

- My Story 한국어/영어 본문
- Real Conversations 한국어/영어 본문
- Useful Expressions
- 부교재의 변형 예문
- Grammar Focus
- What About You?
- Beginner Template
- Let’s Have a Talk
- 발음·강세·연음·인토네이션 자료
- 교재에 포함된 질문·작문 소재

#### 금지

AI가 다음과 같이 학습용 문장을 새로 생성하는 것.

- “비슷한 예문 10개”
- 교재에 없는 새로운 Target Expression
- 교재 범위를 벗어난 고급 표현 추천
- 사용자에게 아직 학습시키지 않은 표현을 정답처럼 제시

### 5.2 사용자 개인 Output은 자유

사용자의 자기 경험, 답변, 글은 자유롭게 생성할 수 있다.

단, AI 피드백은 가능한 한 **이미 배운 교재 표현으로 더 잘 말하게 만드는 것**을 우선한다.

---

## 6. Target User

### Primary User

현재 부트캠프 또는 교재 진도를 따라가는 학습자.

주요 Needs:

- 이번 주 Chapter를 제대로 외우고 싶다.
- 혼자서도 아웃풋 연습을 하고 싶다.
- 지난주 내용을 잊지 않도록 복습하고 싶다.
- 무엇을 어떻게 반복해야 할지 안내받고 싶다.

### Secondary User

교재를 한 번 이상 끝내고 2회독, 3회독 이상 반복하는 사용자.

주요 Needs:

- 이미 공부한 Chapter를 다시 강화하고 싶다.
- Chapter를 섞어 랜덤하게 연습하고 싶다.
- 책 전체가 실제 내 영어가 되었는지 확인하고 싶다.

---

## 7. Core Learning Model

### Chapter Mastery Loop

```text
LEARN
교재 이해

↓
MEMORIZE
My Story / Real Conversations 암기

↓
RECALL
보지 않고 꺼내기

↓
OUTPUT
배운 표현을 변형해서 사용

↓
WRITE
배운 표현을 하나의 자기 이야기로 조합

↓
REVIEW
누적 복습

↓
REPEAT
다음 회독
```

---

## 8. Chapter Structure

| 순서 | 영역 | 초기 회독 | 고회차 |
|---|---|---|---|
| ① | My Story 학습·암기 | 필수 | 필수 |
| ② | Real Conversations 학습·암기 | 필수 | 필수 |
| ③ | Output Practice | 필수 | 필수 |
| ④ | Grammar Focus | 권장 | 필수 |
| ⑤ | What About You? | 권장 | 필수 |
| ⑥ | Weekly Writing | 필수 | 필수 |
| ⑦ | Pronunciation & Intonation | 독립 영역 | 독립 영역 |

### Core Learning

초기 회독의 Core는 다음 네 가지다.

- My Story
- Real Conversations
- Output Practice
- Weekly Writing

---

## 9. Feature 01 — My Story Memorization

### 목표

My Story 본문을 책 없이 영어로 재현할 수 있도록 한다.

### 단계

#### A. Read

- 한국어 보기
- 영어 보기
- 한국어 + 영어 함께 보기

이 단계에서는 평가하지 않는다.

#### B. Chunk Memorization

본문을 의미 단위로 1~2문장씩 나눈다.

각 Chunk에서:

1. 한국어 원문 표시
2. 사용자가 영어로 말하거나 떠올림
3. 필요 시 힌트 사용
4. 정답 확인
5. 자기 상태 선택

#### C. Paragraph Recall

여러 Chunk를 묶어 한 번에 말한다.

#### D. Full Recall

한국어 본문 전체를 보고 영어 My Story 전체를 말한다.

### 상태

- **Memorized:** 이번 학습에서 Full Recall 완료
- **Retained:** 이후 Review에서도 다시 꺼낼 수 있음

---

## 10. Recall UX

### 기본 화면

- 한국어 Source
- 🎙 말하기
- 힌트 1
- 힌트 2
- 정답 확인
- 학습 상태 선택

### 힌트 단계

#### Hint 1

교재 Target Expression 또는 첫 구절 일부

#### Hint 2

빈칸 형태 또는 문장 시작 부분

#### Answer

교재 원문 전체

### 자기 판정

- **바로 나왔어요**
- **생각해서 나왔어요**
- **다시 봐야 해요**

### 평가 정책

Recall에서는 발음을 평가하지 않는다.

평가 대상:

- Target Expression 포함 여부
- 핵심 의미
- 주요 문장 구조
- 본문 재현 정도

현재는 자기평가를 기록한다. AI 보조 판정은 향후 계획이며 아직 제공하지 않는다.

---

## 11. Feature 02 — Real Conversations Memorization

### 목표

대화를 책 없이 재현하고 실제 회화처럼 이어 말할 수 있게 한다.

### Training Mode

#### Mode A — 내가 A

앱이 B 대사를 보여주고 사용자가 A를 말한다.

#### Mode B — 내가 B

앱이 A 대사를 보여주고 사용자가 B를 말한다.

#### Mode C — Full Dialogue

한국어 대화만 보고 A/B 전체 대화를 재현한다.

### 완료

- A 역할 완료
- B 역할 완료
- Full Dialogue 1회 수행

---

## 12. Feature 03 — Output Practice

### 목표

본문을 단순 암기한 상태에서 **변형해서 사용할 수 있는 상태**로 이동한다.

### 콘텐츠 원칙

문제와 정답 모두 교재·부교재에 실제 존재하는 콘텐츠를 사용한다.

### 난이도

#### Level 1 — Exact Recall

본문 또는 부교재 문장을 그대로 재현.

#### Level 2 — Controlled Variation

부교재에서 제공한 단어·사람·시간·장소 변경.

#### Level 3 — No Hint Output

Pattern 이름을 알려주지 않고 상황만 보여준다.

### 회독별 변화

회독이 올라갈수록 힌트는 줄고 변형 비중은 늘어난다.

---

## 13. Feature 04 — Grammar Focus

### 초기 회독

Recommended / Optional

사용자가 여유가 있으면 진행한다.

Skip해도 해당 회독 Completion을 막지 않는다.

### 고회차

Required

Chapter 전체 완성도를 높이는 단계에서 필수로 전환한다.

### UX

```text
Grammar Focus

이번 회독에서는 선택 학습이에요.

[공부하기] [다음 회독에 하기]
```

---

## 14. Feature 05 — What About You?

### 역할

교재 영어를 **내 영어**로 연결하는 Bridge.

### 초기 회독

Optional / Recommended

### 고회차

Required

### 활용

- Beginner Template
- What About You 질문
- Let’s Have a Talk 질문

사용자의 답변은 자유롭게 만들 수 있다.

---

## 15. Feature 06 — Weekly Writing / Chapter Wrap-up

### 목표

한 주 동안 배운 개별 표현을 **하나의 완성된 Output**으로 조합한다.

> 이번 Chapter의 영어를 이용해 “내 이야기 하나”를 완성한다.

### Mode A — Free Writing

사용자가 자유롭게 주제를 정한다.

단, 서비스가 추천·표시하는 영어 재료는 현재 학습 범위 안에서만 제공한다.

### Mode B — Guided Writing

What About You / Let’s Have a Talk에 있는 실제 질문 중 하나를 선택한다.

### Mode C — Template Writing

Beginner Template의 빈칸을 채우며 글을 시작한다.

### 회독별 Writing Progression

#### Pass 1

Template 적극 허용.

목표: 배운 표현 몇 개를 직접 써보기.

#### Pass 2

같은 Chapter에서 다른 주제로 다시 작성.

Template 의존 감소.

#### Pass 3

Grammar Focus까지 활용.

#### Pass 4+

여러 Chapter의 이미 학습한 표현을 조합해 자유 작문.

---

## 16. Writing Feedback

일반적인 영어 첨삭처럼 모든 문장을 고급 영어로 다시 쓰지 않는다.

### Feedback Priority

1. 이번 Chapter 표현 사용 여부
2. 이전에 배운 Chapter 표현 활용 여부
3. 의미 전달 여부
4. 필수적인 문법 오류
5. 교재 범위 내 수정 가능 여부

### 결과 예시

```text
이번 글에서 사용했어요

✓ I prefer...
✓ I used to...
✓ I can’t stand...
✓ Over time...

아직 안 써봤어요

- I realized...
- Now that...
- Speaking of...
```

사용자의 글은 저장할 수 있지만, 해당 문장을 공식 Review 정답으로 자동 추가하지 않는다.

---

## 17. Feature 07 — Review

### 목표

공부한 내용을 장기 기억과 실제 인출 능력으로 전환한다.

### Review Principle

한 번의 기본 Review Set은 **약 20~30분 안에서 소화 가능한 분량**을 목표로 한다.

30분은:

- 타이머가 아님
- 강제 종료가 아님
- 필수 공부 시간이 아님

사용자는 언제든 중단하거나 더 진행할 수 있다.

---

## 18. Review Scope

### Early Pass — Chapter Review

초기에는 Chapter를 섞지 않는다.

예:

```text
Review → Chapter 3
```

Chapter 3 안에서만 출제.

### Intermediate — Mixed Review

사용자가 여러 Chapter를 선택한다.

예:

- Chapter 1 + 2 + 3
- Chapter 2~5
- 사용자 지정 조합

### Advanced — All Random

충분히 익숙해진 후 전체 범위 랜덤.

이때:

- Chapter 이름 숨김
- Pattern 이름 숨김
- 힌트 최소화

Hard Lock은 하지 않고 “2~3회독 이상 추천” 정도로 안내한다.

---

## 19. Review Composition

권장 기본값:

아래 비율은 초기 기획 후보이며 현재 코드의 고정 출제 비율을 뜻하지 않는다.
현재 Chapter Review는 해당 챕터·회독에서 실제 자기평가한 항목을 바탕으로 전체/어려운
항목 복습을 제공한다. 과거 12문항 고정 세트와 새 콘텐츠 생성은 사용하지 않는다.

| 회독 | Review 구성 |
|---|---|
| Pass 1 | 본문 Recall 70% / Output 30% |
| Pass 2 | 본문 Recall 50% / Output 50% |
| Pass 3 | Recall + Output + Grammar + What About You |
| Pass 4+ | Mixed / Smart Random / All Random |

---

## 20. Smart Review

### 우선순위

1. Recall 실패
2. 최근 힌트를 사용한 표현
3. 오래 보지 않은 표현
4. 최근 학습 표현
5. 이미 안정적인 표현

### UX 정책

사용자에게 다음과 같은 압박성 메시지를 사용하지 않는다.

```text
복습 83개 밀렸습니다.
```

대신:

```text
오늘 추천 복습
약 20~30분
```

형태로 제공한다.

---

## 21. Review Item State

각 학습 항목은 최소 다음 상태를 가진다.

- **Seen**
- **Practiced**
- **Recalled**
- **Used**
- **Automatic**

Recall 자기판정은 별도로 기록한다.

- 바로 나왔어요
- 생각해서 나왔어요
- 다시 봐야 해요

---

## 22. Feature 08 — Pronunciation & Intonation Lab

Review와 완전히 분리한다.

### 목적

교재·부교재에 포함된 발음·강세·연음·인토네이션을 별도 훈련한다.

### Flow

```text
Listen
↓
Repeat
↓
Record
↓
Playback
↓
Retry
```

### 정책

Pronunciation 결과는 Recall 성공 여부와 연결하지 않는다.

본문을 정확히 기억했다면 발음이 부족해도 Recall은 성공할 수 있다.

---

## 23. Weekly Reflection

교재의 Weekly Reflection은 선택적으로 디지털화한다.

예:

- 이번 주 잘된 점
- 어려웠던 점
- 다음 회독에서 다시 볼 것

MVP에서는 Optional.

---

## 24. Pass System

### Pass 1 — Familiar

목표: 핵심 본문 확보

Required:

- My Story
- Real Conversations
- Basic Output
- Weekly Writing

Recommended:

- Grammar Focus
- What About You?

### Pass 2 — Reinforce

목표: 변형과 인출 강화

- Full Recall 강화
- Supplement Variation
- Chapter Review
- 새로운 Weekly Writing

현재 완료 조건은 Full Recall, A/B/Full Dialogue, Source Variation, Chapter Review
완료 세트, 해당 Pass Writing의 다섯 영역이다. 사용자가 명시적으로 Finish Pass 2를 누른다.

### Pass 3 — Complete

목표: Chapter 전체 학습

Required:

- My Story
- Real Conversations
- Output
- Grammar Focus
- What About You
- Weekly Writing

현재 Pass 3 완료 조건에는 위 여섯 영역과 Chapter Review가 포함된다. Output은 No Hint,
What About You는 Source 질문 최소 한 개 완료를 확인하고 명시적 Finish Pass 3으로 마친다.

### Pass 4+ — Automatic

목표: Chapter 경계 제거

- Mixed Review
- Smart Random
- All Random
- Multi-Chapter Writing

---

## 25. Chapter Completion

### 초기 회독

예:

```text
Chapter 3 · Pass 1 Complete

My Story              ✓
Real Conversations    ✓
Output Practice       ✓
Weekly Writing        ✓
Grammar Focus         → 다음 회독
What About You        → 다음 회독
```

Grammar나 What About You를 건너뛰었다고 80% 완료처럼 실패감을 주지 않는다.

### 고회차 Complete

고회차에서는 Chapter 전체 영역을 Completion 기준으로 포함한다.

---

## 26. Main Information Architecture

### 1. Home

- Continue Learning
- Suggested Review
- Weekly Writing 상태
- Pronunciation 진입
- 현재 Pass / Chapter

### 2. Chapters

- Chapter 1~12
- Pass 상태
- 섹션별 진행 상태

### 3. Review

- Chapter Review
- Mixed Review
- Smart Review
- All Random

### 4. Pronunciation

- Week/Chapter별 Pronunciation Lab

### 5. Progress

- Chapter Pass
- Expression State
- Recall 상태
- Writing 기록

---

## 27. Home UX Principle

홈은 할 일을 강요하는 화면이 아니라 **다음에 무엇을 할 수 있는지 보여주는 화면**이어야 한다.

예:

```text
Continue Learning
Chapter 3 · Pass 1
My Story Recall 이어하기

Suggested Review
Chapter 1–2
약 20~30분

Weekly Writing
Chapter 3
아직 작성하지 않음

Pronunciation
Week 3
선택 학습
```

---

## 28. PC / Mobile UX Principle

같은 계정의 Progress를 공유한다.

### PC

깊은 학습 중심.

- 본문 비교
- Chapter Study
- Grammar
- What About You
- 긴 Writing
- 상세 Progress

### Mobile

짧은 반복 중심.

- Recall
- Review
- 짧은 Output
- 역할극
- Pronunciation

단, 기능 자체를 강제로 PC / Mobile로 분리하지 않는다.

---

## 29. Core User Flow

```text
Chapter 선택

↓
My Story
Read → Chunk Recall → Paragraph Recall → Full Recall

↓
Real Conversations
Read → A 역할 → B 역할 → Full Dialogue

↓
Output Practice
Exact → Variation → No Hint

↓
Grammar Focus
회독에 따라 Optional / Required

↓
What About You
회독에 따라 Optional / Required

↓
Weekly Writing
Free / Guided / Template

↓
Chapter Pass Complete

↓
Review Pool 등록
```

---

## 30. AI 역할 정의

이 절은 향후 AI 연결의 역할 경계다. 현재 운영 앱에 AI/STT 평가가 연결되어 있다는 뜻이 아니다.

### AI가 해야 하는 것

- STT 결과와 교재 원문 비교
- Recall 보조 판정
- Target Expression 포함 여부 분석
- Writing에서 교재 표현 사용 여부 분석
- Smart Review 우선순위 계산
- 현재 학습 범위 내 힌트 제공
- 약한 표현 분류

### AI가 하지 않아야 하는 것

- 새로운 영어 커리큘럼 생성
- 교재 밖 표현을 학습 Target으로 추가
- 사용자가 배우지 않은 고급 문장으로 첨삭
- 새로운 예문을 Review 정답으로 생성
- 발음을 이유로 Recall 실패 처리

---

## 31. Content Data Model

모든 학습 콘텐츠에는 최소 다음 Metadata가 필요하다.

```yaml
content_id:
chapter_id:
week:
section:
source_type: main | supplement
source_page:
korean_text:
english_text:
target_expression:
exercise_type:
required_pass:
difficulty:
pronunciation_tag:
writing_tag:
review_eligibility:
```

### 핵심 원칙

AI가 아니라 **Content DB가 학습 시스템의 중심**이 된다.

AI는 Content DB 안의 자료를 선택·평가·정리·추천하는 역할을 한다.

---

## 32. MVP Definition

현재 제품 v1 범위는 0절을 따른다. 아래 Chapter 3 우선 구현 및 로그인/서버 DB 제외는
초기 Prototype의 역사적 범위이며 현재 운영 제품에 적용하는 제한이 아니다.

### MVP 목적

> 이 학습 Loop가 실제로 혼자 공부하는 데 도움이 되는지 검증한다.

### P0 — MVP 필수

#### Platform

- PC + Mobile Responsive Web
- 우선 Chapter 3으로 프로토타입 검증

#### Chapter Study

- Chapter Overview
- My Story
- Real Conversations

#### Memorization

- Chunk Recall
- Full Recall
- Hint 1 / Hint 2 / 정답 확인
- 자기 상태 기록

#### Output

- 부교재 기반 Output Practice

#### Writing

- Weekly Writing
- Free / Guided / Template

#### Review

- Chapter Review
- 약 20~30분 추천 분량
- Recall 상태 저장

#### Progress

- Pass 기록
- Chapter 상태
- Expression 상태

### MVP 초기 프로토타입에서 제외

- 로그인
- 서버 DB
- 결제
- 관리자 페이지
- 고급 STT 평가
- 정교한 발음 점수
- Push Notification

초기 프로토타입에서는 Browser Local State / localStorage를 사용해도 된다.

---

## 33. P1

Mixed Review와 All Random은 현재 Pass 4+에 구현됐다. 아래 목록 중 아직 구현되지 않은
Lab·고도화·음성 평가만 후속 범위이며 기존 기능을 다시 신규 개발로 분류하지 않는다.

- Mixed Review
- Smart Review 고도화
- All Random
- Grammar Focus Interactive Training
- What About You Training
- Pronunciation Lab
- Weekly Reflection
- Voice Evaluation 개선

---

## 34. P2

- AI Conversation
- 자유 Speaking
- 30초 / 1분 / 2분 Speaking
- OPIc Bridge
- PWA 강화
- Native App
- Push Notification

---

## 35. Success Metrics

체류 시간이 길수록 성공하는 서비스가 아니다.

### North Star 후보

> **주간 Recalled / Used Expression 수**

즉 실제로 꺼내본 표현의 수.

### Learning

- My Story Memorization Completion
- Real Conversations Memorization Completion
- Weekly Writing Completion
- Recall → Automatic 전환률

### Retention

- Weekly Return Rate
- Chapter 2 진입률
- Pass 2 진입률
- Pass 3 진입률

### Review

- Weekly Review Frequency
- Review 시작 → 완료 비율
- Chapter Review 재방문율

---

## 36. UX Principles

### No Shame UX

사용하지 않음:

- 밀린 복습
- 실패한 Chapter
- 이번 주 목표 미달

사용:

- 다시 볼 내용
- 다음 회독
- 이어서 학습
- 오늘 추천 복습

### No Forced Pace

예:

```text
7일이 지났으니 Chapter 2로 이동합니다.
```

같은 시스템을 사용하지 않는다.

### Reduce Help Over Time

회독이 올라갈수록 새로운 콘텐츠를 계속 추가하기보다 **도움 장치를 하나씩 줄인다.**

#### 초기

- 한국어 있음
- Target Expression 힌트 있음
- Chapter 표시
- Template 있음

#### 중간

- 힌트 감소
- Variation 증가

#### 고회차

- Chapter 표시 없음
- Pattern 이름 없음
- All Random
- 여러 Chapter 조합

---

## 37. Chapter 3 Prototype Validation Plan

첫 번째 개발 검증 대상은 **Chapter 3 — Personality Traits**로 한다.

### 구현 범위

1. Chapter 3 Overview
2. My Story 본문 보기
3. Chunk Recall
4. Full Recall
5. Real Conversations A/B 역할극
6. Output Practice
7. Grammar Focus 선택 학습
8. What About You 선택 학습
9. Weekly Writing
10. Chapter Review
11. Pass 1 Complete
12. Pronunciation 진입 버튼만 제공

### 첫 번째 프로토타입에서 우선 구현

전체를 한 번에 만들지 않는다.

#### Phase 1

```text
Chapter 3 Overview
→ My Story 본문 보기
→ Chunk Recall
→ Full Recall
```

이 흐름을 실제로 10~20분 사용해본다.

### 검증 질문

- Chunk 크기가 적당한가?
- 힌트 단계가 실제 암기에 도움이 되는가?
- 정답 확인 타이밍이 자연스러운가?
- 자기판정 3단계가 이해하기 쉬운가?
- Full Recall이 부담스럽지 않은가?
- 모바일에서도 한 손으로 조작 가능한가?
- 실제로 “본문을 외우고 있다”는 느낌이 드는가?

#### Phase 2

Phase 1 수정 후:

```text
Real Conversations
→ Output Practice
→ Weekly Writing
→ Chapter Review
→ Pass Complete
```

확장.

---

## 38. Development Handoff Rule

PRD와 Chapter 3 Prototype Flow가 확정된 후 실제 구현 단계로 이동한다.

### 기획 단계

- Product Rule
- Learning Logic
- Content Structure
- User Flow
- Wireframe

### 구현 단계

- Frontend
- Responsive UI
- Local State / DB
- Audio Input
- STT
- Review Algorithm
- Writing Analysis

---

## 39. Decision Log

| 항목 | 결정 |
|---|---|
| Platform | PC + Mobile Responsive Web App |
| Curriculum Pace | 1 Chapter / Week 권장 |
| Learning Pace | 사용자 자율 |
| Content Source | Main + Supplement Only |
| My Story | Memorization Required |
| Real Conversations | Memorization Required |
| Output Practice | Required |
| Weekly Writing | Required |
| Grammar Focus | 초기 권장 → 고회차 필수 |
| What About You | 초기 권장 → 고회차 필수 |
| Review Quantity | 약 20~30분 이내 소화 가능한 기본 분량 |
| Review Time | 강제 시간 제한 아님 |
| Early Review | Chapter Based |
| Advanced Review | Mixed / Smart / All Random |
| Pronunciation | Review와 별도 |
| Completion | Hard Lock 최소화 |
| Learning Philosophy | Completion > Perfection |
| Prototype Chapter | Chapter 3 — Personality Traits |

---

## 40. Open Questions

향후 실제 프로토타입 테스트를 통해 확정해야 한다.

### Recall

- 본문과 어느 정도 같아야 Memorized인가?
- AI 판정과 사용자 자기판정의 비중은 어떻게 둘 것인가?
- Full Recall은 한 번에 전체를 말하게 할지, 구간별 재도전을 허용할지?

### Review

- 20~30분 세트의 정확한 Item 구성
- 틀린 문제의 재등장 간격
- Smart Review의 점수 계산 방식

### Writing

- 어느 수준까지 문법 오류를 수정할 것인가?
- 교재 밖 표현이 필요한 경우 어떤 메시지를 보여줄 것인가?
- 사용자가 쓴 문장을 개인 아카이브에서 어떻게 다시 활용할 것인가?

### Voice

- 초기 MVP에서 실제 STT를 사용할지
- 자기평가 중심으로 먼저 검증할지

---

## 41. Final Product Statement

> **교재를 읽는 공부가 아니라, 교재가 내 영어가 될 때까지 반복하는 공부.**

제품의 최종 목적은 사용자가 새로운 영어 콘텐츠를 계속 소비하게 만드는 것이 아니라,

> **이미 배운 영어를 기억하고, 꺼내고, 변형하고, 쓰고, 다시 만나는 학습 습관**

을 만들어주는 것이다.
