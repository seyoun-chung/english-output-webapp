# Chapter 3 pilot — implementation handoff

검증일: 2026-09-23. 이번 결과는 Chapter 3 시범 챕터용 로컬 프로토타입이며 전체 서비스 출시가 아니다.

## 구현

- 기존 My Story Read → Chunk Recall → Full Recall 유지
- Real Conversations: 원문 7턴, Read / Play A / Play B / Full dialogue
- Output Practice: Exact 6개, 출처가 있는 Variation 6개, 같은 항목을 사용하는 No hint
- Weekly Writing: Free / Guided / Template, 질문 10개, 템플릿 7개, 모드별 초안
- 선택 영역: Grammar Focus의 예문 5쌍, What About You?의 질문별 답안
- Chapter Review: 학습 중 자기평가한 원문 항목만 그룹별로 선택. 복습 평가와 학습 평가는 분리
- Pass 1: My Story 완료, A/B 전체 자기평가와 전체 대화 완료, Exact 6개 평가, 작문 완료 후 명시적으로 완료
- 공통 ExerciseCard, 자기평가 라벨, 녹음 컴포넌트 재사용. 기존 키 하나에 version 2 저장 및 version 1 이전

## 출처

PDF 원문을 추출하고 페이지 이미지를 확인하여 데이터화했다. 학습용 새 문장을 생성하지 않았다.

- 메인 교재: My Story pp.50–51, Grammar pp.54–55, Real Conversations pp.56–57, 개인화·작문 pp.63–65
- 변형: My Story 부교재 p.3, Real Conversations 부교재 p.2
- 자세한 항목별 출처는 `src/data/`에 있으며, 화면에도 출처를 표시한다.
- Output은 공통 기능을 검증하기 위한 12개 대표 항목이다. 부교재의 모든 문제를 옮긴 것은 아니다.

## 검증 결과

- `npm run verify`: 안전 패턴 검사, 14개 테스트 파일 / 191개 테스트, TypeScript 검사, Vite 빌드 통과
- `git diff --check`: 통과
- 실제 브라우저: PC 1440×1000, 모바일 390×844, 좁은 화면 320×740 확인
- 320px에서 추가한 모든 영역의 문서 가로 넘침 없음. 모바일 메뉴는 의도적인 가로 스크롤
- 브라우저 콘솔에서 수집한 error/warn 없음
- A 4턴/B 3턴, 힌트·정답 공개·평가·전체 대화 완료 검증
- Output Exact 완료, Variation 이동, No hint 버튼 제거 및 완료 화면 새로고침 복원 검증
- Free/Guided/Template 초안 분리, 새로고침 유지, 작문 완료 검증
- 개인 답안 질문 선택과 빈 답안 분리, Grammar 학습 표시 검증
- 학습 전 빈 Review, 학습 후 그룹 선택·6개 복습 완료·중간 새로고침 복원 검증
- 필수 영역이 부족하면 Pass 완료 버튼 없음. 네 영역 완료 후 완료 가능, 새로고침 후 유지
- 기존 My Story 6개 평가 → Full Recall → Finish와 약한 Chunk 분류 회귀 검증
- 발견하여 수정: Output/Review 다음 문제의 스크롤·초점, Output 완료 요약의 새로고침 복원

## 안전과 남은 검증

- 실제 마이크 권한을 허용하거나 사용자 음성을 녹음하지 않았다. 가짜 미디어 장치를 이용한 기존 자동 테스트는 통과했다. 실제 기기의 녹음·재생은 사용자가 확인해야 한다.
- STT, 자동 채점, 외부 API, 로그인, 서버 저장, 배포, 다른 챕터, Paragraph Recall은 추가하지 않았다.
- Pronunciation은 Coming later. 자동 복습 일정과 회독 자동 전환은 구현하지 않았다.
- 민감정보 검사는 패턴 기반이며 완전한 보안 감사를 의미하지 않는다. 원본 PDF와 환경 파일은 Git 제외 상태를 유지한다.
- 학습 발췌문은 코드에 포함되므로 공개 배포 전 콘텐츠 사용 권한을 확인해야 한다.
- 초안과 진도는 해당 브라우저·주소에 저장한다. Git으로 다른 컴퓨터에 앱 코드를 옮겨도 학습 기록은 동기화되지 않는다.

## 실행과 Git 상태

- 작업 브랜치: `feature/chapter-3-real-conversations` (작업 도중 사용자 승인으로 Chapter 3 전체 시범 범위로 확대)
- 별도 worktree에서 구현하여 기존 작업 폴더의 변경과 분리했다.
- 실행: 작업 폴더에서 `npm ci`, `npm run dev -- --port 5174 --strictPort`
- 미리보기: `http://localhost:5174/` (새 기록으로 시작)
- UI 검증 기록은 별도 origin인 `http://127.0.0.1:5174/`에만 남아 있다. 기존 5173 기록은 수정하지 않았다.
- 사용자가 STA Track 컴퓨터에서 확인하기 위해 이번 구현의 커밋·푸시를 명시적으로 승인했다. 대상은 위 작업 브랜치이며 PR·main 병합은 별도 승인이다.

## 다음 검토

사용자가 새 화면과 실제 녹음을 확인한 뒤 수정 여부를 결정한다. PR 생성과 main 병합은 별도 승인 후 진행한다.

STA Track 컴퓨터의 프로젝트 폴더에서 먼저 `git status`로 미저장 변경이 없는지 확인한다.
변경이 없다면 다음과 같이 작업 브랜치를 받아 실행한다. 기존 변경이 있다면 전환 전에 별도로 보존한다.

```bash
git fetch origin
git switch --track origin/feature/chapter-3-real-conversations
npm ci
npm run dev
```

해당 로컬 브랜치가 이미 있으면 `git switch feature/chapter-3-real-conversations` 후
`git pull --ff-only origin feature/chapter-3-real-conversations`를 사용한다. main에서 pull만 하면 이번 변경은 보이지 않는다.
