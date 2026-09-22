# Chapter 3 pilot — shared learning flow

## Latest scope, 2026-09-23

사용자가 야간 작업 도중 범위를 Chapter 3 시범 챕터 전체와 공통 기능의 구현·검증으로 확대했다.
이 문서가 이전 Real Conversations 단독 작업 범위보다 우선한다.
다른 챕터나 제품 인프라를 미리 구현하지 않는다.

### Included

- 기존 My Story Read / Chunk Recall / Full Recall 보존.
- Real Conversations: Read / A / B / Full Dialogue, 메인 p.56–57의 7개 발화 전체.
- Output Practice: 교재 원문 Exact + 부교재의 실제 한국어/영어 쌍 Variation + 같은 Source를 쓰는 No hint.
- Grammar Focus: p.54–55의 감정 형용사 설명과 원문. Pass 1 선택 학습.
- What About You?: p.65의 실제 질문과 사용자 자유 답변. Pass 1 선택 학습.
- Weekly Writing: Free / Guided / Template, p.64–65 원문 질문·시작문 사용.
- Chapter Review: 이미 평가한 Chapter 3 항목만 선택하여 복습. 원래 학습 평가와 복습 회차 결과 분리.
- Pass 1: My Story, Real Conversations, 기본 Output, Weekly Writing 수행을 확인한 후 사용자가 명시적으로 완료.
- Pronunciation: 추후 영역으로 유지. 녹음·재생은 자기 점검일 뿐 발음 평가가 아니다.

### Shared features

- Source 정보를 가진 학습 데이터와 화면 분리.
- Output/Review 공통 문제 카드: 한국어 → 원문 힌트 → 정답 → 기존 자기평가.
- Writing/About 공통 입력과 독립적인 초안 보존.
- 기존 VoicePractice 재사용 및 문항/역할/화면 이탈 시 마이크·Blob 정리.
- 단일 localStorage 키, version 2, 기존 version 1 무손실 이관.
- 잘못된 저장 데이터가 다른 영역의 유효한 기록을 지우지 않도록 하위 구조별 검증.
- npm run verify: 파일 안전 검사 + 테스트 + TypeScript/빌드. 새 테스트 의존성 없음.

## Decisions deliberately not made

- 자동 합격률, 발음 점수, STT 공급자, AI 첨삭, 유료 서비스.
- Smart Review 가중치·재등장 간격·20~30분의 정확한 문제 수.
- 다음 Chapter 자동 진입, 강제 학습 순서, 타이머·연속 학습 강요.
- 사용자 작문을 공식 교재 정답으로 편입하는 기능.

Output의 선별된 연습 세트는 공통 기능 검증용이다. 교재·부교재 전체를 디지털화했다고 표시하지 않는다.
Core 완료는 학습 수행 기록이지 객관적 숙련도나 발음 합격 판정이 아니다.
학습자가 어느 화면에든 접근할 수 있으며, 선택 영역 미수행으로 Pass 1을 막지 않는다.

## Privacy and checkpoint boundary

회원정보·마이크 권한을 대신 입력하거나 외부 음성/AI API에 연결하지 않는다.
자유 답변과 작문은 이 브라우저의 localStorage에만 저장된다. 민감한 개인정보 입력은 필요 없다.
작성 내용은 소스 코드·테스트 fixture·Git 커밋에 넣지 않는다.
임의 클라우드 업로드, 배포, PR 생성·merge는 하지 않는다.

사용자 지시: 확인 가능한 Codex 계정 한도의 잔여량이 20% 이하가 되면 개발을 멈추고,
에이전트 작업을 정리한 후 안전 검사와 상태 기록을 거쳐 현재 기능 브랜치에 checkpoint commit·push한다.
그때 미완성 기능/실패 테스트를 완료로 표시하지 않는다. 이 예외는 main merge를 승인한 것이 아니다.

## Verification

- Source 원문·힌트·화자 검증.
- 모든 화면 진입, 저장/복원, 영역별 완료, 선택 영역 비차단 검증.
- 실제 브라우저 PC/모바일 너비에서 문항·탭·긴 대화·입력창 확인.
- 실제 마이크는 허락 없이 켜지 않음. 녹음 수명주기는 가짜 장치 자동 테스트로 검증하고
  기기별 권한·음질 확인은 사용자에게 남긴다.
- 검증 결과와 남은 사항은 별도 handoff에 기록한다.
