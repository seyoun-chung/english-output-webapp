# Current Task

## Proposed next increment — Chapter 3 Pass 2 Reinforce (2026-10-01)

Pass 1 실제 학습과 피드백 반영이 끝난 뒤, 사용자가 Chapter 3 Pass 2 설계 작업을 승인했다.
현재 설계안은 [pass2_reinforce_plan.md](./pass2_reinforce_plan.md)에 기록한다.

- 상태: 권장 완료 조건과 Increment 1 범위 승인, 구현 진행
- 권장 첫 구현: 기존 진행 데이터 migration + 명시적 Pass 2 진입 + My Story 세로 흐름
- Pass 2 완료 조건은 설계안의 권장 다섯 Core 항목으로 확정하고, 첫 구현은 Increment 1 범위로 제한
- Chapter 4, 새 Source 콘텐츠, 자동 채점, Smart Review 정책 확정은 범위 밖

---

## Active increment — Chapter 3 pilot (2026-09-23)

Phase 1 구현·피드백 반영·merge 후 사용자가 다음 단계의 자율 구현을 승인했다.
이후 사용자가 범위를 **Chapter 3 전체 학습 흐름과 재사용 가능한 공통 기능의 구현·검증**으로 확대했다.
최신 범위는 [chapter3_pilot_plan.md](./chapter3_pilot_plan.md)를 따른다.
Real Conversations 세부 Source는 [real_conversations_plan.md](./real_conversations_plan.md)에 기록한다.
아래 Phase 1 명세와 6개 Chunk는 기존 기능의 보존·회귀 검증 기준이다.
확인 가능한 계정 사용 한도가 20% 이하로 남으면 개발 중단 후 안전 검사·상태 기록을 거쳐
현재 작업 브랜치에 checkpoint commit·push하라는 추가 승인을 받았다. merge는 승인되지 않았다.
이후 사용자가 STA Track 컴퓨터에서 확인할 수 있도록 현재 구현의 commit·push를 명시적으로 승인했다.
대상은 `feature/chapter-3-real-conversations`이며 main 병합은 별도 승인이다.

## Phase 1 — Chapter 3 Prototype

현재 구현 범위는 **Chapter 3 — Personality Traits의 My Story 학습 Flow 검증**이다.

전체 앱을 한 번에 구현하지 않는다.

화면 표시 용어는 사용자 피드백에 따라 **Chunk**, **Chunk Recall**을 유지한다.
탭의 한국어 부제와 학습에 필요한 안내는 유지한다. Source와 저장된 진행 기록은 변경하지 않는다.
Full Recall 요약 배지는 **Self check**로 표시하고, 평가 분류를 설명하는 문장은 생략한다.
사이드바의 브라우저 저장·기기 간 비공유 안내는 화면에서 생략하되 실제 저장 방식은 유지한다.

### UI 문구 승인 — 2026-09-23

아래 화면 설명보다 최신 사용자 승인 문구를 우선 적용한다.

- Overview, Read, Chunk Recall, Full Recall의 승인된 버튼·표시를 짧은 영어로 변경한다. 미구현 영역은 계속 비활성화하고 `Coming later`로 표시한다.
- `별도 학습`, `나의 속도로` 배지는 생략한다. Read와 Chunk Recall 안내는 영어 한 줄로 줄이고, Full Recall의 제목과 중복되는 안내는 생략한다.
- 왼쪽 메뉴의 한국어 보조 설명 4개는 그대로 유지한다.
- Self-check 영역의 `어땠나요?`, 자기평가 버튼 3개, 선택 후 이동 안내, Full Recall의 `Self check` 배지는 변경하지 않는다. 요약 카테고리만 `Recalled easily` / `To review`로 바꾼다.
- 녹음 영역은 보이는 제목을 생략하고 `Optional`, `Record`, `Stop recording`, `Record again`, `Delete`, `Cancel`을 사용한다. 삭제 버튼은 최신 피드백에 따라 `Delete`로 짧게 표시하며, 녹음 버튼 아래 가운데에 기존 secondary 버튼 스타일과 휴지통 아이콘을 사용해 배치한다. 녹음이 있을 때만 표시하고 삭제 동작은 유지한다.
- `Delete`의 보이는 크기는 `Optional` 배지 수준으로 작게 표시하고, 투명한 버튼 영역은 최소 44px 높이로 유지한다.
- 녹음 상태는 `Waiting for permission…`, `Preparing audio…`, `Recording…`, `Your recording`, `Listen and compare.`로 표시한다. `녹음 없이 진행해도 괜찮아요.`와 별도의 마이크 사용 종료 안내는 중복이므로 생략한다.
- 표에 없는 권한 허용 안내, 녹음 삭제 조건, 오류 안내는 기존 한국어를 유지한다.
- 01~03 화면의 상단 경로는 구분자 `/` 양쪽에 동일한 간격을 사용한다.
- Source 본문·힌트, 녹음 동작, 진행 기록 및 자기평가 분류 기준은 변경하지 않는다.

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

Full Recall 요약 및 재연습 기준 (사용자 피드백 반영):

- `immediate`: 잘 기억난 부분. 약한 부분 재연습에서 제외한다.
- `effort`, `review`: 다시 볼 부분. 두 평가 모두 카운트와 약한 부분 재연습에 포함한다.
- 아직 평가하지 않은 Chunk는 별도로 표시하며 위 두 분류에는 포함하지 않는다.
- 재연습에서 `immediate`로 바꾸면 다음 약한 부분 재연습 대상에서 제외한다.
- 기존에 저장된 자기평가 값은 유지하고 새 분류 기준을 적용한다.

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

사용자 승인에 따라 자기 점검용 **선택형 녹음·재생**을 제공한다.
음성 인식(STT), 텍스트 변환, 자동 채점, 발음 평가는 구현하지 않는다.

적용 화면은 Chunk Recall과 Full Recall 두 곳뿐이다.
Overview와 My Story Read에는 녹음 기능을 넣지 않는다.

기본 UX:

```text
한국어 원문 확인
→ 녹음 시작 (선택)
→ 직접 영어로 말함
→ 녹음 종료
→ 내 목소리 재생
→ 정답 확인 후 원문과 직접 비교
→ 기존 Self Rating 또는 Full Recall 완료
```

- 녹음을 생략하거나 권한을 거부해도 기존 학습을 계속할 수 있다.
- 마이크는 녹음 시작 버튼을 직접 누를 때만 요청하고 종료 즉시 해제한다.
- 정답을 펼쳐도 현재 녹음은 유지하여 비교하면서 다시 들을 수 있다.
- 다시 녹음하면 이전 녹음을 대체한다. 수동 삭제도 지원한다.
- 음성은 브라우저 메모리에만 두며 서버 전송, 파일 자동 저장, localStorage 저장을 하지 않는다.
- 브라우저 기본 재생기의 다운로드 메뉴로 사용자가 직접 저장한 파일은 앱의 자동 삭제 대상이 아니다. MP3 변환은 미구현이다.
- 다른 화면·Chunk로 이동, 탭 이탈, 새로고침 시 마이크·재생을 종료하고 녹음을 정리한다.
- 권한 요청 중 화면을 떠났다가 뒤늦게 허용되어도 마이크를 즉시 해제한다.
- 지원하지 않는 브라우저·마이크 없음·권한 거부·녹음/재생 실패를 안내한다.
- Voice API 또는 STT Provider는 연결하지 않는다. 기존 자기평가 분류 기준도 바꾸지 않는다.
- 녹음 시작 전에는 선택 사항과 앱 안의 녹음 삭제 조건만 짧게 표시한다. 외부 전송·영구 저장을 하지 않는 실제 동작은 유지하되 해당 안내 문구는 화면에서 생략한다.
- 권한 요청·녹음 중·종료 처리·재생 준비 상태에서는 해당 상태 안내만 표시하고 시작 전 안내를 반복하지 않는다.
- 브라우저의 마이크 권한 요청은 유지한다. 위 안내는 서비스 공개 시 필요한 법적 고지 검토를 대체하지 않는다.

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
