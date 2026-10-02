# Codex Handoff — Textbook Mastery Web App

## Latest state — 2026-10-02

- Chapter 5 `Catching up With Friends` Source 묶음이 구현·검증됐고 현재 작업 브랜치에서 Git 반영 전이다.
- Chapter 5는 My Story 6, Conversation 9, Exact 6, Source Variation 6,
  What About You / Let’s Have a Talk 12, Beginner Template 8 및 main textbook Grammar를 포함한다.
- 최신 검증은 24개 테스트 파일 / 301개 테스트, production build와 브라우저 주요 화면,
  390×844·320×740 반응형 점검이다. 다음 Source 적용 단위는 Chapter 6이다.
- Chapter 4 `How Was Your Day?` Source 묶음은 PR #19, merge commit `15a8baf`로 main에 반영됐다.
- Chapter 4는 My Story 6, Conversation 10, Exact 6, Source Variation 6,
  What About You / Let’s Have a Talk 13, Beginner Template 6 및 main textbook Grammar를 포함한다.
- 최신 검증은 23개 테스트 파일 / 298개 테스트, production build와 숨김 브라우저 주요 화면,
  390×844·320×740 반응형 점검이다. 다음 Source 적용 단위는 Chapter 5다.
- Chapter 2 `Introducing Yourself` Source 묶음이 구현·검증됐다.
- Chapter 2는 My Story 6, Conversation 9, Exact 6, Source Variation 6,
  What About You 11, Beginner Template 6 및 main textbook Grammar를 포함한다.
- 최신 검증은 22개 테스트 파일 / 295개 테스트, production build와 숨김 브라우저 Chapter 2 Overview·Read·Grammar다.
- 다음 작업은 Chapter 4부터 원본 PDF 확인과 Source 묶음 등록을 이어가는 것이다. Chapter 3은 이미 완료돼 있다.
- Chapter 1 `Work, English, and Dreams` Source 묶음과 공통 화면 주입이 구현·검증됐다.
- Chapter 1은 My Story 6, Conversation 8, Exact 6, Source Variation 6,
  What About You 11, Beginner Template 8 및 main textbook Grammar를 포함한다.
- 학습 화면은 `ChapterContentContext`를 통해 현재 Chapter Source를 읽으며 Chapter 1과 Chapter 3 진행 기록을 독립 저장한다.
- 최신 검증은 21개 테스트 파일 / 292개 테스트, production build와 숨김 브라우저 Chapter 1 주요 화면·390px·Chapter 3 전환이다.
- 다음 작업은 Chapter 2 원본 PDF 확인과 Source 묶음 등록이다.
- version 5 앱 저장 container와 Chapter Library 구현·검증이 완료됐다.
- 기존 version 1–4 값은 Chapter 3 entry로 이전되고 Chapter별 기록은 `chapters` 아래 독립적으로 저장된다.
- Library는 12개 Chapter 목차를 보여주지만 `chapterContentById`에 Source 묶음이 있는 Chapter만 시작/재개할 수 있다.
- 현재 등록된 Source 묶음은 Chapter 3뿐이며 나머지는 `Source setup in progress`다.
- 최신 검증은 20개 테스트 파일 / 288개 테스트와 production build, 숨김 브라우저 desktop/390px Library·재개 흐름이다.
- `ChapterContent`가 Chapter metadata, My Story, Conversation, Output/Review, Writing, Grammar Source 묶음의 공통 경계다.
- 진행 초기화·복원·리듀서와 각 영역 완료 판정은 선택한 Chapter Source 묶음을 받을 수 있다.
- 인자를 생략한 기존 호출은 Chapter 3을 사용하므로 기존 version 1–4 저장 기록과 UI 동작을 보존한다.
- 대체 Chapter 데이터가 Chapter 3 ID나 저장 기록을 섞지 않는지 자동 검사하며 최신 검증은 19개 파일 / 284개 테스트다.
- 공통화 foundation에서 Chapter 1–12의 제목과 main textbook 섹션 페이지를 `src/data/chapters.ts`로 분리했다.
- 현재 화면은 계속 Chapter 3만 제공하지만 Chapter 표시와 provenance가 catalog 기반으로 바뀌었다.
- 다음 구현은 version 5 Chapter별 저장 container와 Chapter 선택 shell이다. Source 검증 전 Chapter는 활성화하지 않는다.
- Chapter 3 Pass 1, Pass 2, Pass 3의 처음부터 명시적 완료까지 구현됐다.
- localStorage schema는 version 4이며 version 1–3을 안전하게 이전한다.
- Pass 3은 Full Recall, A/B/Full Dialogue, No Hint, Grammar, What About You,
  새 Weekly Writing, Chapter Review를 모두 요구한다.
- `Finish Pass 3` 후 `Chapter 3 · Pass 3 complete`를 저장하고 새로고침 후 복원한다.
- Pass 1·2·3 기록은 서로 분리되고 이전 회독 기록을 덮어쓰지 않는다.
- 현재 다음 작업은 Chapter 3에 결합된 데이터·표시·저장을 공통 Chapter 엔진으로 일반화하는 것이다.
- 그 뒤 로컬 `docs/sources/` 원본을 확인하여 Chapter 1–12 데이터를 적용한다.
- Pass 4+는 삭제되지 않았고 전체 Chapter Pass 1–3 적용 직후 Mixed/Smart/All Random 단계로 진행한다.
- 실제 모바일 기기 검증 대신 이번 빠른 개발 단계에서는 반응형 브라우저 검증을 사용한다.
  이를 실제 모바일 터치감 검증으로 표현하지 않는다.

> 이 문서는 ChatGPT에서 진행한 제품 기획의 **맥락, 의사결정, 학습 철학, 구현 우선순위**를 Codex가 이어받기 위한 handoff 문서다.  
> 개발 전 반드시 `textbook_mastery_prd_v1_1.md`와 함께 읽는다.

---

## 0. Read First

Codex는 개발을 시작하기 전에 최소 다음 순서로 문서를 읽는다.

1. `textbook_mastery_prd_v1_1.md`
2. `codex_handoff.md`
3. `docs/sources/` 또는 프로젝트에 포함된 메인 교재/부교재 원본
4. Chapter 3 관련 메인 교재 + Week 3 My Story + Week 3 Real Conversations 자료

**중요:**  
이 프로젝트는 일반적인 AI 영어 튜터가 아니다.

> **새로운 영어를 계속 만들어 주는 앱이 아니라, 이미 정해진 교재를 반복해서 완전히 내 것으로 만드는 학습 시스템이다.**

---

# 1. Project Goal

## 제품 한 줄 정의

> **혼자서도 영어 교재를 끝까지 내 것으로 만들 수 있게 도와주는 회독·아웃풋 학습 Web App**

핵심은 학습자가 교재를 단순히 읽는 데서 끝나지 않고 다음 과정을 반복하도록 만드는 것이다.

```text
LEARN
↓
MEMORIZE
↓
RECALL
↓
OUTPUT
↓
WRITE
↓
REVIEW
↓
REPEAT
```

최종 목표는:

```text
읽으면 안다
→ 한국어를 보면 영어가 나온다
→ 변형해서 사용할 수 있다
→ 내 이야기로 사용할 수 있다
→ Chapter를 의식하지 않고 자연스럽게 꺼낸다
```

---

# 2. Product Philosophy

## 2.1 Completion > Perfection

이 서비스는 처음부터 100% 완벽하게 외우게 하는 앱이 아니다.

회독을 거치면서 완성도를 높인다.

- 1회독: 핵심 본문 확보
- 2회독: 변형·인출 강화
- 3회독: Chapter 전체 학습
- 4회독+: Chapter 경계를 없애고 자동화

틀린 것은 실패가 아니라:

> **다음 회독에서 다시 만날 내용**

으로 본다.

---

## 2.2 No Shame UX

사용자에게 부담을 주는 메시지를 피한다.

피해야 할 표현:

```text
복습 83개 밀렸습니다.
이번 주 목표 실패
Chapter 미완료
```

권장 표현:

```text
오늘 추천 복습
다시 볼 내용
이어서 학습
다음 회독에서 만나기
```

---

## 2.3 Learner-Paced

교재 구조상:

> **1 Chapter ≈ 1주**

를 권장하지만 강제하지 않는다.

금지:

- 7일이 지나면 자동으로 다음 Chapter 이동
- 하루 최소 공부 시간 강제
- 강제 타이머
- 미완료 상태 때문에 다음 Chapter 접근 차단

---

# 3. Non-Negotiable Content Rule

# SOURCE LOCKED LEARNING

이 프로젝트에서 가장 중요한 규칙이다.

## 모든 학습용 Target Content는 반드시 아래에서만 가져온다.

- 메인 교재
- 해당 Week My Story 부교재
- 해당 Week Real Conversations 부교재
- 교재의 Grammar Focus
- What About You?
- Beginner Template
- Let’s Have a Talk
- 교재/부교재 Pronunciation & Intonation 자료

---

## AI가 해서는 안 되는 것

AI가 학습용 문장을 임의로 새로 만들면 안 된다.

금지 예:

```text
비슷한 예문 10개 만들어주기
교재에 없는 영어 표현 추천
더 자연스러운 고급 문장 추가
새로운 Target Expression 생성
```

사용자가 직접 말하거나 쓰는 자기 이야기는 자유롭게 생성 가능하다.

하지만 **앱이 정답으로 제시하거나 학습시키는 영어는 반드시 Source 자료에 존재해야 한다.**

---

# 4. AI Role

AI는 **Content Creator가 아니라 Learning Engine 보조 역할**이다.

## AI가 할 수 있는 것

- STT 결과와 교재 원문 비교
- Recall 보조 판정
- Target Expression 포함 여부 확인
- Writing에서 배운 표현 사용 여부 분석
- Review 우선순위 계산
- 학습 상태 분류
- 현재 학습 범위 안에서 힌트 제공

## AI가 하면 안 되는 것

- 새로운 영어 예문 생성
- 새로운 커리큘럼 생성
- 아직 배우지 않은 고급 표현 추천
- 사용자 Writing을 교재 밖 표현으로 전면 재작성
- 발음 오류 때문에 Recall 실패 처리

---

# 5. Platform Decision

확정:

> **PC + Mobile Responsive Web App**

초기에는 Native App을 만들지 않는다.

이유:

- PC에서 깊은 학습
- Mobile에서 짧은 Recall / Review
- 빠른 MVP 검증
- 동일 Progress 공유
- 이후 필요 시 PWA / Native 확장 가능

---

# 6. Chapter Learning Structure

각 Chapter의 기본 구조:

| 순서 | 영역 | 초기 회독 | 고회차 |
|---|---|---|---|
| 1 | My Story | 필수 | 필수 |
| 2 | Real Conversations | 필수 | 필수 |
| 3 | Output Practice | 필수 | 필수 |
| 4 | Grammar Focus | 권장 | 필수 |
| 5 | What About You? | 권장 | 필수 |
| 6 | Weekly Writing | 필수 | 필수 |
| 7 | Pronunciation & Intonation | 별도 | 별도 |

초기 Core:

```text
My Story
+ Real Conversations
+ Output Practice
+ Weekly Writing
```

---

# 7. My Story Learning Flow

My Story는 반드시 **본문 암기**가 핵심이다.

## Flow

```text
Read
→ Chunk Recall
→ Paragraph Recall
→ Full Recall
```

---

## 7.1 Read

사용자는 자유롭게 전환할 수 있다.

- 한국어만
- 영어만
- 한국어 + 영어 함께

이 단계는 평가하지 않는다.

---

## 7.2 Chunk Recall

본문을 의미 단위로 나눈다.

권장:

- 약 1~2문장
- 지나치게 길거나 짧지 않게
- 의미 흐름이 끊기지 않게

화면:

```text
한국어 원문

[🎙 말하기]

[힌트 1]
[힌트 2]
[정답 확인]
```

---

## 7.3 Hint Logic

### Hint 1

Target Expression 또는 문장 시작 일부.

### Hint 2

빈칸 형태 또는 더 많은 문장 시작 부분.

### Answer

교재 영어 원문 전체.

힌트 자체도 Source Text 안에서만 만든다.

---

## 7.4 Recall Self Rating

정답 확인 후 사용자가 선택한다.

```text
바로 나왔어요
생각해서 나왔어요
다시 봐야 해요
```

이 값은 Review Priority에 반영한다.

---

## 7.5 Full Recall

Chunk 학습 후 한국어 Step 1 전체를 보고 영어 전체를 말한다.

중요:

- 한 번 실패했다고 처음부터 강제하지 않는다.
- 약한 Chunk만 다시 연습할 수 있어야 한다.
- Full Recall은 완료 신호이지 영구 숙련 판정이 아니다.

상태:

```text
Memorized
Retained
```

- Memorized = 이번 학습에서 Full Recall 완료
- Retained = 이후 Review에서도 다시 꺼냄

---

# 8. Real Conversations Learning Flow

대화형 콘텐츠이므로 My Story와 다르게 역할극을 활용한다.

## Mode A — 내가 A

앱이 B 대사를 제공하고 사용자가 A 대사를 말한다.

## Mode B — 내가 B

앱이 A 대사를 제공하고 사용자가 B 대사를 말한다.

## Mode C — Full Dialogue

한국어 대화만 보고 전체 Conversation을 재현한다.

---

# 9. Output Practice

목적:

> 외운 문장을 **조금 다른 상황에서도 사용할 수 있게 만드는 것**

문제와 정답은 모두 부교재 Source에서 가져온다.

## Level 1 — Exact

본문 / 부교재 문장 그대로.

## Level 2 — Controlled Variation

부교재에 실제 존재하는 변형.

예:

- 사람
- 장소
- 시간
- 대상
- 비교
- 긍정/부정

## Level 3 — No Hint

Pattern 이름을 보여주지 않고 Source의 한국어 상황만 제시.

---

# 10. Grammar Focus

초기 회독:

```text
Recommended / Optional
```

고회차:

```text
Required
```

초기 회독에서 Grammar를 하지 않아도 해당 Pass는 정상 완료할 수 있다.

UI 예:

```text
Grammar Focus

이번 회독에서는 선택 학습이에요.

[공부하기]
[다음 회독에 하기]
```

---

# 11. What About You?

역할:

> 교재 영어 → 나의 영어

초기 회독:

```text
Recommended
```

고회차:

```text
Required
```

Source:

- What About You 질문
- Beginner Template
- Let’s Have a Talk

---

# 12. Weekly Writing

각 Chapter 마지막에 반드시 들어가는 주요 Output 기능.

사용자가 한 주 동안 배운 표현을 조합해 **하나의 글**을 완성한다.

## Mode 1 — Free Writing

사용자가 자유롭게 주제 선택.

## Mode 2 — Guided Writing

What About You / Let’s Have a Talk의 실제 질문 중 선택.

## Mode 3 — Template Writing

Beginner Template을 이용해 작성.

---

## Writing Rule

사용자의 내용은 자유지만 앱이 추천하는 영어는 Source 범위 내에서만 제공한다.

Writing Feedback은 일반 첨삭 서비스처럼 모든 문장을 고급 표현으로 바꾸지 않는다.

우선순위:

1. 이번 Chapter 표현 사용 여부
2. 이전 Chapter 표현 사용 여부
3. 의미 전달
4. 필수 문법 오류
5. 교재 범위 내 수정 가능 여부

결과 UI 예:

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

---

# 13. Review System

Review는 Chapter Study와 별도의 핵심 영역이다.

## 13.1 Early Pass

Chapter 단위.

예:

```text
Chapter 3 Review
```

다른 Chapter를 섞지 않는다.

---

## 13.2 Intermediate

여러 Chapter 선택.

```text
Ch 1 + 2 + 3
Ch 2~5
사용자 지정
```

---

## 13.3 Advanced

All Random.

이때:

- Chapter 이름 숨김
- Pattern 이름 숨김
- Hint 최소화

Hard Lock하지 않는다.

대신:

```text
2~3회독 이상 추천
```

처럼 안내한다.

---

# 14. Review Time Rule

기본 Review Set은:

> **약 20~30분 안에서 소화 가능한 분량**

을 목표로 한다.

중요:

- Timer 아님
- 자동 종료 아님
- 필수 시간 아님

사용자는 더 짧게 또는 더 길게 공부할 수 있다.

---

# 15. Review Composition by Pass

권장 기본값:

| Pass | 구성 |
|---|---|
| Pass 1 | Recall 70% / Output 30% |
| Pass 2 | Recall 50% / Output 50% |
| Pass 3 | Recall + Output + Grammar + What About You |
| Pass 4+ | Mixed / Smart Random / All Random |

---

# 16. Smart Review Priority

우선순위:

1. 다시 봐야 해요
2. 힌트를 많이 사용한 항목
3. 오래 보지 않은 항목
4. 최근 학습 항목
5. 안정적으로 Recall되는 항목

UI는 복습 backlog 숫자를 압박 방식으로 노출하지 않는다.

권장:

```text
오늘 추천 복습
약 20~30분
```

---

# 17. Pronunciation & Intonation

Review와 분리한다.

별도 Lab:

```text
Listen
→ Repeat
→ Record
→ Playback
→ Retry
```

Pronunciation이 부족해도 Recall은 성공 가능하다.

첫 MVP에서는:

> Pronunciation 메뉴 / 진입 버튼만 제공

상세 기능은 나중에 구현.

---

# 18. Pass Model

## Pass 1 — Familiar

Required:

- My Story
- Real Conversations
- Basic Output
- Weekly Writing

Recommended:

- Grammar
- What About You

---

## Pass 2 — Reinforce

- Full Recall 강화
- Supplement Variation
- Chapter Review
- 새로운 Weekly Writing

---

## Pass 3 — Complete

Required:

- My Story
- Real Conversations
- Output
- Grammar
- What About You
- Weekly Writing

---

## Pass 4+ — Automatic

- Mixed Review
- Smart Random
- All Random
- Multi-Chapter Writing

---

# 19. Chapter Completion Rule

## Pass 1 Example

```text
Chapter 3 · Pass 1 Complete

My Story              ✓
Real Conversations    ✓
Output Practice       ✓
Weekly Writing        ✓
Grammar Focus         → Next Pass
What About You        → Next Pass
```

Grammar/What About You를 안 했다고 실패 또는 80% 완료처럼 보여주지 않는다.

---

# 20. Main IA

```text
Home
Chapters
Review
Pronunciation
Progress
```

---

# 21. Home UX

홈은 “해야 할 것”보다 “이어갈 수 있는 것”을 보여준다.

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

# 22. Current Validation Chapter

첫 번째 Prototype 대상:

> **Chapter 3 — Personality Traits**

이 Chapter로 전체 학습 흐름을 검증한다.

---

# 23. Chapter 3 Source Content

## Main Textbook

Chapter 3:

```text
3-1 My Story
3-2 Grammar Focus
3-3 Real Conversations
3-4 What About You?
```

---

## Chapter 3 — My Story Core

주요 Target Expressions:

```text
Have you taken the MBTI test?
I’m not really social.
When I’m around many people, I get tired and overwhelmed easily.
I prefer to just have a few close friends.
I wasn’t always like this, though.
When I was younger, I was more outgoing and fearless.
Over time, I became more reserved and cautious.
Recently, I realized...
Now that I’m learning English...
It’s exciting just to think about it.
```

---

## Week 3 My Story Supplement 주요 Variation

실제 부교재에 포함된 연습:

```text
Have you tried bossam?
Have you heard of BTS?
Have you talked to mom recently?
Have you seen my phone?

I’m definitely social.
I’m not really social.

I prefer to shower at night.
I prefer to shower in the morning.
I prefer to cook on weekends.
I prefer to eat out on weekends.
I prefer Saturday to Sunday.

She’s always like this.
She’s not always like this.
Is she always like this?
Why are you always like this?

When I was younger, I was more stubborn.
Over time, I became more easygoing.

I realized I’m not really social.
I just realized I left my phone at the restaurant.

Now that I can speak English, I want to travel to America.

It’s exciting to make new friends from around the world.
```

이 목록을 새로 확장하지 않는다.

---

# 24. Chapter 3 — Real Conversations Core

주요 Target Expressions:

```text
is so annoying
can’t stand
feel bad
Speaking of
meet up
brush it off
frustrated / frustrating
big deal
get annoyed
bump into
I don’t understand...
```

---

## Week 3 Real Conversations Supplement 주요 Variation

Source에 실제 존재:

```text
I can’t stand her.
I can’t stand the humidity.
I can’t stand it when people walk slowly.
I can’t stand it when people cut in line.

I feel bad for my parents.
I feel bad about what I said.
Don’t feel bad.

Speaking of MBTI, are you an introvert or an extrovert?
Speaking of English, have you heard of Koham?

I met up with Koham the other day.

I’m going to be ten minutes late.

It was frustrating because I can’t speak English.

It’s a big deal for me.
It’s not a big deal.

I get really annoyed when people walk slowly.
I get really annoyed when people talk loudly on the phone.

I bumped into ______ last year.
I ran into my ex at a cafe.

I don’t understand what you mean.
I don’t understand why you’re being so defensive.
```

이 Source 밖으로 학습 예문을 생성하지 않는다.

---

# 25. Chapter 3 Grammar Focus

핵심:

```text
-ed vs -ing 감정 형용사
```

예:

```text
I’m interested.
It’s interesting.

I’m tired.
It’s tiring.

I’m frustrated.
It’s frustrating.

I’m annoyed.
It’s annoying.
```

초기 회독에서는 Optional.

---

# 26. Chapter 3 What About You

Source Beginner Template:

```text
I’m an (your MBTI)
I think I’m more of an (introvert or extrovert)
I tend to be
I prefer
I used to be more ___, but I’ve grown more ___
I can’t stand
I hate it when
```

Source 질문 예:

```text
How do your friends usually describe you?
What are some of your best personality traits?
Do you think your personality has changed since childhood? How?
What personality traits do you admire?
What personality traits do you dislike?
Are you more of a leader or a follower?
```

Weekly Writing Guided Mode에서 활용한다.

---

# 27. Chapter 3 Pronunciation

상세 기능은 MVP 이후.

Source에 포함된 주요 포인트:

```text
V / F
L / R / V / B / F
overwhelmed
reserved
prefer
friends
rude
frustrated
brushed it off
bump into
annoying
unaware
```

MVP에서는 진입 버튼만.

---

# 28. Chapter 3 Prototype — Phase 1

## 지금 Codex가 가장 먼저 만들어야 하는 범위

**전체 앱을 만들지 않는다.**

Phase 1:

```text
Chapter 3 Overview
→ My Story Read
→ Chunk Recall
→ Full Recall
```

이 네 단계만 먼저 작동시킨다.

---

# 29. Phase 1 Required Screens

## Screen 1 — Chapter 3 Overview

표시:

```text
Chapter 3
Personality Traits

Pass 1

My Story             Required
Real Conversations   Required
Output Practice      Required
Grammar Focus        Recommended
What About You       Recommended
Weekly Writing       Required
Pronunciation        Separate
```

CTA:

```text
[Chapter 3 시작하기]
```

---

## Screen 2 — My Story Read

Toggle:

```text
한국어
영어
함께 보기
```

CTA:

```text
[암기 시작하기]
```

---

## Screen 3 — Chunk Recall

표시:

```text
Chapter 3 · My Story
3 / 6

한국어 원문
```

Controls:

```text
[🎙 말하기]
[힌트 1]
[힌트 2]
[정답 확인]
```

정답 확인 후:

```text
[바로 나왔어요]
[생각해서 나왔어요]
[다시 봐야 해요]
```

---

## Screen 4 — Full Recall

한국어 Step 1 전체를 제공.

사용자가 전체 My Story를 말한다.

완료 후:

```text
잘 기억난 부분
다시 볼 부분

[약한 부분만 다시 연습]
[완료]
```

---

# 30. Chapter 3 My Story Suggested Chunking

초기 Prototype에서는 아래 6개 Chunk로 시작한다.

## Chunk 1

```text
너 MBTI 검사해 본 적 있어?
당연하지! 난 INFP야.
나는 그닥 사람들과 어울리는 편은 아니야.
```

Target:

```text
Have you taken the MBTI test?
Of course! I’m an INFP.
I’m not really social.
```

---

## Chunk 2

```text
사람들이 많은 곳에 있으면 쉽게 지치고 부담스러워져.
난 친한 친구 몇 명만 두는 걸 선호해.
```

Target:

```text
When I’m around many people, I get tired and overwhelmed easily.
I prefer to just have a few close friends.
```

---

## Chunk 3

```text
근데 항상 이랬던 건 아니야.
어렸을 땐 훨씬 외향적이고 두려움도 없었거든.
시간이 지나면서 점점 더 내성적이고 겁이 많아졌어.
```

Target:

```text
I wasn’t always like this, though.
When I was younger, I was more outgoing and fearless.
Over time, I became more reserved and cautious.
```

---

## Chunk 4

```text
최근에는 내가 너무 익숙한 곳에만 머물러 있다는 걸 깨달았어.
```

Target:

```text
Recently, I realized I was staying in my comfort zone too much.
```

---

## Chunk 5

```text
지금은 영어를 배우고 있으니까 더 도전해 보고 싶고,
전 세계에서 새로운 친구들도 사귀고 싶어.
```

Target:

```text
Now that I’m learning English,
I want to challenge myself more and make new friends from around the world.
```

---

## Chunk 6

```text
생각만 해도 설렌다.
너는 어때?
넌 내향형이야, 아니면 외향형이야?
```

Target:

```text
It’s exciting just to think about it.
What about you?
Are you an introvert or an extrovert?
```

---

# 31. Phase 1 State Model

로그인 / 서버 DB 없음.

Browser Local State 또는 `localStorage` 사용.

최소 저장값:

```text
currentChapter
currentPass
currentSection
chunkProgress
chunkRecallState
hintUsage
fullRecallCompleted
lastStudiedAt
```

예:

```json
{
  "chapter": 3,
  "pass": 1,
  "myStory": {
    "chunks": {
      "1": "immediate",
      "2": "effort",
      "3": "review",
      "4": "immediate",
      "5": "effort",
      "6": "review"
    },
    "fullRecallCompleted": false
  }
}
```

---

# 32. Phase 1 Technical Constraints

초기 Prototype 목적은 **학습 UX 검증**이다.

따라서 지금 만들지 않는다:

```text
Auth
Cloud DB
Payments
Admin
Complex AI orchestration
Production analytics
Full STT grading
Pronunciation scoring
Push notifications
```

---

# 33. Voice Input for Prototype

초기에는 실제 STT가 없어도 된다.

우선:

```text
사용자가 마이크 버튼 누름
→ 직접 말함
→ 정답 확인
→ 자기 평가
```

만으로 UX를 검증할 수 있다.

STT는 Phase 1 UX 확인 후 추가해도 된다.

---

# 34. Phase 1 Acceptance Criteria

Prototype은 다음 조건을 만족하면 성공.

- PC에서 사용 가능
- Mobile에서도 자연스럽게 사용 가능
- Chapter 3 Overview에서 My Story로 이동 가능
- 한국어 / 영어 / 함께 보기 전환 가능
- 6개 Chunk Recall 진행 가능
- Hint 1 / Hint 2 / Answer 작동
- 자기평가 3단계 저장
- 새로고침해도 Progress 유지
- Full Recall 진입 가능
- 약한 Chunk를 다시 연습 가능
- Source 밖 학습 문장이 없음

---

# 35. Validation Questions

사용자가 실제 10~20분 공부한 뒤 확인해야 할 것.

1. Chunk 크기가 적당한가?
2. 한국어 Prompt가 Recall하기 좋은가?
3. Hint 1이 너무 많이 알려주지는 않는가?
4. Hint 2가 실질적으로 도움이 되는가?
5. 정답 확인 시점이 자연스러운가?
6. 자기평가 3단계가 이해하기 쉬운가?
7. Full Recall이 부담스럽지 않은가?
8. Mobile에서 버튼 위치가 편한가?
9. 실제로 “본문을 외우는 느낌”이 드는가?
10. 다음 단계로 가고 싶은 흐름이 자연스러운가?

---

# 36. Phase 2 — Phase 1 검증 후

Phase 1 수정 후 아래를 추가한다.

```text
Real Conversations Role Play
→ Output Practice
→ Grammar Focus
→ What About You
→ Weekly Writing
→ Chapter Review
→ Pass 1 Complete
```

Phase 1 피드백 전에 Phase 2 전체를 미리 만들지 않는다.

---

# 37. Future Product Scope

MVP 이후 가능 기능:

```text
Mixed Review
Smart Review
All Random
Pronunciation Lab
Voice STT Comparison
Writing Analysis
Multi-Chapter Writing
AI Conversation
30 sec / 1 min / 2 min Speaking
OPIc Bridge
PWA
Native App
Push Notification
```

---

# 38. Important Decisions Already Made

Codex가 다시 질문할 필요가 없는 결정.

| 항목 | 결정 |
|---|---|
| Platform | PC + Mobile Responsive Web |
| Prototype | Chapter 3 first |
| Content | Main + Supplement Only |
| AI-generated target sentences | 금지 |
| My Story memorization | 필수 |
| Real Conversations memorization | 필수 |
| Output Practice | 필수 |
| Weekly Writing | 필수 |
| Grammar | 초기 권장 / 고회차 필수 |
| What About You | 초기 권장 / 고회차 필수 |
| Pronunciation | Review와 분리 |
| Early Review | Chapter based |
| Advanced Review | Mixed / Smart / All Random |
| Review default | 약 20~30분 분량 |
| Review timer | 없음 |
| Forced pace | 없음 |
| Hard lock | 최소화 |
| Learning philosophy | Completion > Perfection |
| Prototype storage | localStorage 가능 |
| Initial backend | 불필요 |
| Initial auth | 불필요 |

---

# 39. Open Questions — Do Not Invent Answers

아래는 아직 Prototype 사용 후 결정해야 한다.

## Recall

- 원문과 어느 정도 같아야 자동으로 Memorized인지
- AI 평가와 자기평가 비중
- Full Recall 재도전 방식

## Review

- 20~30분 Set의 정확한 문제 수
- Spaced Review 간격
- Smart Review 가중치

## Writing

- 문법 오류를 어느 정도까지 수정할지
- 교재 밖 표현이 꼭 필요한 경우 UX
- 사용자 Writing의 장기 활용 방식

## Voice

- STT를 언제 도입할지
- 어떤 Speech API를 사용할지

Codex는 위 내용을 임의로 확정하지 말고 Prototype 후 의사결정을 남겨둔다.

---

# 40. Development Working Principle

Codex는 한 번에 완제품을 만들지 않는다.

권장 사이클:

```text
Implement small
→ Run
→ User tests
→ Collect feedback
→ Revise
→ Expand
```

첫 사이클:

```text
Chapter 3 Overview
→ My Story Read
→ Chunk Recall
→ Full Recall
```

---

# 41. First Codex Instruction

프로젝트를 처음 열었을 때 다음 방식으로 진행한다.

```text
1. textbook_mastery_prd_v1_1.md를 읽는다.
2. codex_handoff.md를 읽는다.
3. Chapter 3 관련 source PDF를 확인한다.
4. Source Locked 원칙을 확인한다.
5. 코딩 전에:
   - 제품 목적
   - 금지사항
   - 이번 구현 범위
   를 짧게 요약한다.
6. 그 뒤 Phase 1만 구현한다.
```

---

# 42. Recommended First Prompt to Codex

```text
이 프로젝트의 PRD와 handoff 문서를 먼저 읽어줘.

필수 읽기:
- textbook_mastery_prd_v1_1.md
- codex_handoff.md
- Chapter 3 메인 교재
- Week 3 My Story 강의노트
- Week 3 Real Conversations 강의노트

중요:
이 앱은 새로운 영어 예문을 생성하는 AI 튜터가 아니다.
학습용 Target Sentence와 문제는 반드시 제공된 교재/부교재에서만 사용한다.

이번에는 전체 앱을 만들지 말고 Phase 1만 구현해줘.

범위:
Chapter 3 Overview
→ My Story Read
→ Chunk Recall
→ Full Recall

요구사항:
- PC + 모바일 반응형
- localStorage로 진행 상태 저장
- 한국어 / 영어 / 함께 보기
- 6개 Chunk
- Hint 1 / Hint 2 / 정답 확인
- 바로 나왔어요 / 생각해서 나왔어요 / 다시 봐야 해요
- Full Recall
- 약한 Chunk 재연습
- 로그인/결제/서버 DB 없음
- 학습용 새 영어 문장 생성 금지

개발하기 전에 먼저
1. 네가 이해한 제품의 핵심 목적
2. 절대 어기면 안 되는 콘텐츠 규칙
3. 이번 Phase 1 구현 범위
를 요약해서 보여줘.

내 확인 후 구현을 시작해.
```

---

# 43. Final Reminder

이 프로젝트의 차별점은 AI가 많은 영어를 만들어주는 것이 아니다.

> **같은 좋은 교재를 여러 방식으로 다시 만나게 만들어, 결국 책 없이도 꺼내 쓰게 만드는 것**

이다.

개발 중 기능 선택이 애매할 경우 다음 질문을 기준으로 판단한다.

> **“이 기능이 사용자가 이미 배운 영어를 더 잘 기억하고, 꺼내고, 활용하게 만드는가?”**

Yes이면 유지.

단순히 콘텐츠 양을 늘리는 기능이라면 우선순위를 낮춘다.
