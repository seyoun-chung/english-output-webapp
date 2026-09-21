# English Output Web App

영어 교재를 반복해서 학습하며 암기, 인출, 아웃풋, 작문, 복습으로 이어지도록 돕는 반응형 웹 앱 프로젝트입니다.

## Product Goal

새로운 영어 콘텐츠를 계속 제공하는 대신, 사용자가 이미 가지고 있는 교재의 내용을 반복해 익히고 실제로 꺼내 쓸 수 있게 만드는 것을 목표로 합니다.

```text
Learn → Memorize → Recall → Output → Write → Review → Repeat
```

## Core Principles

- **Completion > Perfection**: 한 번에 완벽하게 외우기보다 반복 회독으로 완성도를 높입니다.
- **Source Locked Learning**: 학습용 영어 문장과 표현은 제공된 교재와 부교재에서만 가져옵니다.
- **Learner-Paced**: 강제 타이머나 진도 잠금 없이 사용자가 자신의 속도로 학습합니다.
- **Responsive Web App**: PC와 모바일에서 주요 학습 기능을 사용할 수 있도록 설계합니다.

## Current Scope

현재 작업 범위는 **Chapter 3 — Personality Traits**의 `My Story` 학습 흐름을 검증하는 Phase 1 프로토타입입니다.

```text
Chapter 3 Overview
→ My Story Read
→ Chunk Recall
→ Full Recall
```

## Documentation

- [`AGENTS.md`](./AGENTS.md): 프로젝트 전체 규칙과 개발 원칙
- [`docs/textbook_mastery_prd_v1_1.md`](./docs/textbook_mastery_prd_v1_1.md): 제품 요구사항 문서
- [`docs/codex_handoff.md`](./docs/codex_handoff.md): 기획 맥락과 구현 인수인계
- [`docs/current_task.md`](./docs/current_task.md): 현재 Phase의 작업 범위와 완료 조건

## Development Status

현재 저장소에는 기획 문서와 프로젝트 규칙이 준비되어 있습니다. 애플리케이션 소스 코드와 실행 환경이 추가되면 설치 및 실행 방법을 이 문서에 업데이트합니다.

## Content Privacy

원본 교재 PDF는 `.gitignore`의 `docs/sources/*.pdf` 규칙으로 Git 추적에서 제외됩니다.
