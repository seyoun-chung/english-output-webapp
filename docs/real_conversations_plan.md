# Chapter 3 — Real Conversations increment

## Authorization and boundary

2026-09-23: 사용자가 다음 개발 작업을 자는 동안 자율적으로 구현·검증하도록 승인했다.
필요한 worktree·subagent와 작은 검증 환경 개선을 허용했다.
이번 묶음은 PRD §11, §29의 **Real Conversations**만 구현한다.
기존 Phase 1을 보존하며 Output Practice, Writing, Review, Pass Complete,
로그인·클라우드·STT·유료 서비스는 추가하지 않는다.
commit, push, PR 생성, merge는 별도 승인 전에는 하지 않는다.

## Source decision

- Main: `eBook_Bookcamp_Oct8.pdf` p.56 한국어 / p.57 영어, Chapter 3 / 3-3.
- Supplement: `Week 3 — Real Conversations 강의노트.pdf` p.1–7 본문 설명 대조.
- PDF 원본을 렌더링하여 화자, 문장 순서, 강조 문구를 확인했다.
- Main의 A/B/A/B/A/B/A **7개 발화**를 그대로 사용한다. A 4개, B 3개.
- Supplement의 `(hate it)`, 발화 구분 `/`, 변형 예문은 Main 정답에 섞지 않는다.
- 인쇄 줄바꿈/중복 공백은 문장 공백으로 정리한다. 내용과 문장부호는 유지한다.
- Hint 1은 해당 원문 시작 부분, Hint 2는 원문 단어를 빈칸으로 가린 것만 사용한다.
- A의 첫 발화는 앞선 B 대사가 없다. 가상의 상대 대사를 만들지 않고 `You start the conversation.`이라는 UI 안내만 사용한다.

## Flow and acceptance

1. Overview의 Real Conversations를 활성화한다. My Story는 그대로 유지한다.
2. Read: Korean / English / Both로 전체 7개 발화를 읽는다. 녹음·평가 없음.
3. Play A / Play B: 바로 앞 상대의 영어 대사와 내 한국어 대사를 표시한다.
   내 영어는 Hint / Show answer를 누르기 전에는 숨긴다.
4. 정답 확인 후 기존 한국어 자기평가 세 가지 중 하나를 선택한다.
   역할별 모든 발화를 평가하면 해당 역할을 한 번 연습한 것으로 기록한다.
   평가가 낮아도 실패·잠금을 만들지 않는다.
5. Full Dialogue: 한국어 대화 전체를 보고 말하기. Show English는 수동이다.
   Done speaking으로 전체 대화 수행을 기록한다.
6. A 완료 + B 완료 + Full Dialogue 수행을 모두 만족할 때만 Real Conversations 완료.
   이 완료를 Chapter/Pass 완료로 표시하지 않는다. 순서에 따른 강제 잠금도 없다.
7. 역할·발화·화면 전환 시 힌트/정답을 숨기고 녹음을 정리한다.
   기존 녹음 컴포넌트를 재사용하며 음성 인식이나 네트워크 전송은 추가하지 않는다.
8. 동일한 localStorage 키의 version 2 구조에 확장한다. version 1의 My Story 기록을
   손실 없이 이관하고 각 영역의 위치·평가를 독립적으로 보존한다.
9. PC 및 모바일에서 읽기/역할 전환/힌트/자기평가/전체 대화/복귀/새로고침을 검증한다.

## Parallel ownership

- Main: 원문 확인, 콘텐츠 데이터, 대화 화면, 앱 통합, 스타일, 실행·시각 검증.
- State agent: 대화 상태 전이, version 1 → 2 이관, 관련 자동 테스트.
- Verification agent: 의존성 추가 없는 안전 검사와 통합 검증 명령.
- 같은 파일을 동시에 수정하지 않는다. 통합 후 전체 검증을 다시 실행한다.
- 교재 PDF와 녹음, 개인 경로, 인증정보를 커밋 후보에 넣지 않는다.

## Morning review

- 실제 마이크 권한과 재생은 사용자의 기기에서 최종 확인한다. 테스트 중 실제 마이크를 임의로 켜지 않는다.
- 새 기능은 별도 로컬 미리보기 주소이므로 기존 주소의 학습 기록이 자동 복사되지 않는다.
- 서비스 공개/개인정보 수집/외부 음성 API는 이번 범위 밖이며 연결하지 않는다.
