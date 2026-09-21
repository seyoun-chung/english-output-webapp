# Current Task

## Phase 1 — Chapter 3 Prototype

현재 구현 범위는 **Chapter 3 — Personality Traits의 My Story 학습 Flow 검증**이다.

전체 앱을 한 번에 구현하지 않는다.

---

## 1. Goal

사용자가 실제로 다음 Flow를 클릭하고 공부해볼 수 있는 반응형 Prototype을 만든다.

```text
Chapter 3 Overview
→ My Story Read
→ Chunk Recall
→ Full Recall
```

목표는 완제품 개발이 아니라 **학습 UX 검증**이다.

---

## 2. Required Screens

### Screen 1 — Chapter 3 Overview

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

### Screen 2 — My Story Read

지원 보기 방식:

```text
한국어
영어
함께 보기
```

CTA:

```text
[암기 시작하기]
```

Read 단계에서는 점수나 성공/실패 판정을 하지 않는다.

---

### Screen 3 — Chunk Recall

기본 구조:

```text
Chapter 3 · My Story

현재 Chunk / 전체 Chunk

한국어 원문

[🎙 말하기]
[힌트 1]
[힌트 2]
[정답 확인]
```

정답 확인 후 Self Rating:

```text
[바로 나왔어요]
[생각해서 나왔어요]
[다시 봐야 해요]
```

상태는 localStorage에 저장한다.

---

### Screen 4 — Full Recall

한국어 Step 1 전체를 보여준다.

사용자가 전체 My Story를 영어로 말한다.

완료 후:

```text
잘 기억난 부분
다시 볼 부분

[약한 부분만 다시 연습]
[완료]
```

Full Recall을 한 번 실패했다고 처음부터 강제하지 않는다.

---

## 3. Chapter 3 My Story — 6 Chunks

아래 Chunk는 Prototype 초기값이다.

학습용 영어를 새로 생성하지 않는다.

---

### Chunk 1

Korean:

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

### Chunk 2

Korean:

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

### Chunk 3

Korean:

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

### Chunk 4

Korean:

```text
최근에는 내가 너무 익숙한 곳에만 머물러 있다는 걸 깨달았어.
```

Target:

```text
Recently, I realized I was staying in my comfort zone too much.
```

---

### Chunk 5

Korean:

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

### Chunk 6

Korean:

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

## 4. Hint Rules

힌트는 반드시 Source Text 안에서만 만든다.

### Hint 1

문장 시작 또는 Target Expression 일부.

예:

```text
When I was younger...
```

### Hint 2

더 많은 구조 또는 빈칸 형태.

예:

```text
When I was younger, I was more ______.
Over time, I became more ______.
```

### Answer

교재 영어 원문 전체 표시.

새로운 예문 생성 금지.

---

## 5. Self Rating

각 Chunk 정답 확인 후 다음 중 하나를 선택한다.

```text
immediate = 바로 나왔어요
effort    = 생각해서 나왔어요
review    = 다시 봐야 해요
```

각 값은 저장되어야 한다.

---

## 6. Local State

로그인 / 서버 DB는 구현하지 않는다.

초기 Prototype은 `localStorage` 또는 간단한 Client State를 사용한다.

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

새로고침 후에도 Progress가 유지되어야 한다.

---

## 7. Responsive Requirements

PC + Mobile Responsive Web으로 구현한다.

### Mobile

확인:

- 긴 한국어 Prompt 가독성
- CTA 접근성
- Hint / Answer 버튼 크기
- Self Rating 버튼 터치 편의성
- 다음 Chunk 이동 편의성

### Desktop

확인:

- Korean / English 병렬 보기
- Read 화면 가독성
- 진행 상황 확인
- Recall Card 집중도

---

## 8. Out of Scope

Phase 1에서는 구현하지 않는다.

- Authentication
- 회원가입
- Server DB
- Cloud Sync
- Payments
- Admin
- Real Conversations
- Output Practice
- Grammar Focus 상세 기능
- What About You 상세 기능
- Weekly Writing
- Chapter Review
- Pronunciation 상세 기능
- Full STT grading
- AI 자동 Recall 합격 판정
- Push Notification
- Native App
- Production analytics

Pronunciation은 필요하다면 향후 진입 버튼 정도만 둘 수 있지만,
상세 기능은 만들지 않는다.

---

## 9. Voice Input

Phase 1에서는 실제 STT가 필수 아님.

최소 UX:

```text
사용자가 말하기 버튼을 누름
→ 직접 소리 내어 말함
→ 정답 확인
→ Self Rating
```

Voice API 또는 STT Provider를 임의로 선택하지 않는다.

---

## 10. Acceptance Criteria

Phase 1 완료 조건:

- Chapter 3 Overview에서 My Story로 이동 가능
- Korean / English / Together 전환 가능
- 6개 Chunk 진행 가능
- Hint 1 동작
- Hint 2 동작
- Answer Reveal 동작
- Self Rating 저장
- 새로고침 후 진행 상태 유지
- Full Recall 진입 가능
- 약한 Chunk만 다시 연습 가능
- Desktop 사용 가능
- Mobile 사용 가능
- Source 밖 학습 문장 없음
- 처음부터 끝까지 실제로 테스트 가능

---

## 11. Validation Questions

사용자가 10~20분 실제 학습 후 확인할 항목:

1. Chunk 크기가 적당한가?
2. 한국어 Prompt가 Recall하기 좋은가?
3. Hint 1이 너무 많이 알려주지는 않는가?
4. Hint 2가 도움이 되는가?
5. 정답 확인 타이밍이 자연스러운가?
6. Self Rating 3단계가 이해하기 쉬운가?
7. Full Recall이 부담스럽지 않은가?
8. Mobile에서 버튼 배치가 편한가?
9. 실제로 본문을 외우고 있다는 느낌이 드는가?
10. 다음 학습 단계로 이어가고 싶은 흐름인가?

---

## 12. Do Not Expand Yet

Phase 1 사용성 검증 전에는 아래로 대규모 확장하지 않는다.

```text
Real Conversations
→ Output Practice
→ Grammar Focus
→ What About You
→ Weekly Writing
→ Chapter Review
→ Pass Complete
```

Phase 1 피드백을 반영한 뒤 Phase 2 범위를 다시 정의한다.
