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

현재 Chapter 1–12의 Pass 1–3과 전역 Pass 4+ 혼합·랜덤 복습/작문을 구현했습니다.
기록 백업·복원과 저장 보호를 사용할 수 있습니다. 아직 고정 웹 주소에 배포하지 않았고,
Google 로그인·계정별 Supabase 저장은 구현됐고, 승인된 서울 프로젝트를 로컬 앱에 연결하여
실제 로그인/저장과 독립 origin 간 동기화를 확인했습니다. 실제 기기·배포 환경 검증은 남았습니다.
전체 완료 기준은
[`docs/product_v1_completion_plan.md`](./docs/product_v1_completion_plan.md)를 참조하세요.

```text
Chapter Library → Chapter Overview
→ My Story Read
→ Chunk Recall
→ Full Recall
→ Real Conversations / Output Practice
→ Weekly Writing / Chapter Review
→ Pass 1 / Pass 2 / Pass 3 completion → Pass 4+ Automatic
```

## Documentation

- [`AGENTS.md`](./AGENTS.md): 프로젝트 전체 규칙과 개발 원칙
- [`docs/textbook_mastery_prd_v1_1.md`](./docs/textbook_mastery_prd_v1_1.md): 제품 요구사항 문서
- [`docs/codex_handoff.md`](./docs/codex_handoff.md): 기획 맥락과 구현 인수인계
- [`docs/current_task.md`](./docs/current_task.md): 현재 Phase의 작업 범위와 완료 조건
- [`docs/chapter3_pilot_plan.md`](./docs/chapter3_pilot_plan.md): Chapter 3 시범 챕터 범위와 제외 사항
- [`docs/verification.md`](./docs/verification.md): 자동 검사 및 수동 검증 방법
- [`docs/issue_log.md`](./docs/issue_log.md): 사용자 테스트 문제, 해결 액션 아이템 및 검증 상태
- [`docs/chapter3_pilot_handoff.md`](./docs/chapter3_pilot_handoff.md): 이번 구현과 검증 결과

## Development Status

React + TypeScript + Vite + 일반 CSS를 유지하며 다음 기능을 구현했습니다.

- Chapter 1–12 본문 한국어 / 영어 / 함께 보기, 원문 기반 힌트, 정답 확인, Chunk 자기평가
- Full Recall과 `생각해서 나왔어요` 또는 `다시 봐야 해요`로 평가한 Chunk 재연습 (`바로 나왔어요`와 미평가 Chunk는 제외)
- Real Conversations: Chapter별 원문 대화 읽기, A/B 역할 연습, 전체 대화 인출
- Output Practice: Source에 존재하는 Exact / Variation / No hint 연습
- Weekly Writing: 자유 작문, Chapter별 원문 질문·템플릿과 독립적인 로컬 초안
- Grammar Focus / What About You?: 초기 회독 선택, Pass 3 필수
- Chapter Review: 이미 자기평가한 원문 항목만 선택하여 복습. 작문 초안은 대상에서 제외
- My Story, Real Conversations, 기본 Output Practice, Weekly Writing 완료 후 Pass 1 완료 가능
- Pronunciation은 비활성화하고 `Coming later`로 표시
- 말하기 연습에서 선택형 녹음·재생으로 내 목소리를 점검할 수 있습니다. STT·텍스트 변환·자동 채점은 하지 않습니다.
- Pass 4+: 학습한 항목의 Mixed / Smart / All Random 복습과 Multi-Chapter Writing
- 백업 내보내기·복원·복원 전 사본 재복구, 손상 기록과 여러 탭 덮어쓰기 방지
- Google 로그인·계정별 저장·충돌 선택·동기화와 제한된 서버 복구 이력. 실제 서울 서비스의
  로컬 연결 검증은 완료했으며, 고정 배포 주소 및 실제 여러 기기 확인은 아직 남았습니다.

## Local Development

Node.js 22.12 이상이 필요합니다. 터미널에서 프로젝트 폴더로 이동한 뒤 실행합니다.

```bash
cd /path/to/english-output-webapp
npm ci
npm run dev
```

브라우저에서 터미널에 표시된 주소(기본 `http://127.0.0.1:5173`)를 엽니다.
서버 종료는 터미널에서 `Control + C`입니다. 다른 컴퓨터에서는 해당 컴퓨터의 프로젝트 경로를 사용합니다.

```bash
npm test         # 상태 전이, 저장 복원, Source 일치 및 힌트 규칙 검증
npm run build   # TypeScript 검사 + 배포용 빌드
npm run verify  # 민감정보·제외 파일 검사 + 테스트 + 빌드
npm run preview # 빌드 결과 로컬 확인
```

기본 로컬 학습은 별도의 `.env`, API 키, GitHub 접근 토큰 없이 실행할 수 있습니다.
계정 동기화는 별도 설정이 필요합니다. 이 컴퓨터에는 승인된 프로젝트의 ignored `.env.local`이
있지만 clone으로 전달되지 않습니다. `VITE_ACCOUNT_SYNC_ENABLED=1`, `VITE_SUPABASE_URL`,
`VITE_SUPABASE_PUBLISHABLE_KEY`만 사용하며 Google secret/service-role 키를 넣지 않습니다.
DB에는 세 SQL migration 정의를 적용해야 합니다. 현재 서울 프로젝트에는 이미 수동 적용했으므로
CREATE 구문을 다시 실행하지 마세요. 자세한 상태는 `docs/codex_handoff.md`를 확인합니다.

## Optional Voice Practice

화면 용어는 **Chunk**, **Chunk Recall**을 사용하며 Full Recall 요약 배지는 **Self check**로 표시합니다.
말하기 연습에서 `Record` → 마이크 권한 허용 → 직접 말하기 →
`Stop recording` → `Your recording`의 재생 버튼을 사용합니다.
정답을 펼쳐도 녹음이 유지되므로 원문과 비교하면서 다시 들을 수 있습니다.
`Record again`은 이전 녹음을 대체하고, 그 아래의 휴지통 아이콘이 있는 `Delete` 버튼으로 바로 지울 수 있습니다.
녹음하지 않거나 권한을 거부해도 정답 확인·자기평가·완료는 그대로 가능합니다.
승인된 학습 버튼·표시는 영어로 제공하며, 왼쪽 메뉴의 한국어 보조 설명과 자기평가 문구는 유지합니다.
녹음 버튼·주요 상태도 영어로 표시합니다. `Optional`과 중복되는 녹음 생략 안내와 별도의 마이크 사용 종료 문구는 생략합니다.
권한 허용 안내·녹음 삭제 조건·오류 안내는 기존 한국어를 유지합니다.

음성은 `getUserMedia` + `MediaRecorder`로 브라우저 메모리에서만 처리합니다.
음성 서버 전송, 파일 자동 저장, localStorage 저장, STT 서비스 호출은 하지 않습니다.
다른 화면·Chunk·탭으로 이동하거나 새로고침하면 녹음과 재생을 정리합니다.
마이크는 녹음 종료 및 화면 이탈 시 해제합니다. 브라우저에 부여한 사이트 권한 자체는
브라우저 설정에서 별도로 변경할 수 있습니다.

시작 전에는 `Optional` 배지와 삭제 조건을 안내하고, 녹음 중에는 삭제 안내를 반복하지 않습니다.
사이드바의 저장 위치 안내와 Full Recall의 평가 분류 설명은 생략했으며 실제 처리 방식은 그대로입니다.
브라우저 기본 재생기에서 사용자가 직접 다운로드한 파일은 기기에 남으며 앱에서 삭제하지 않습니다.
파일 형식은 브라우저가 지원하는 녹음 형식(WebM/Opus, MP4 등)을 사용합니다. MP3 변환 기능은 없습니다.
공개 서비스의 법적 고지·동의 요건은 실제 운영 지역과 개인정보 처리 방식에 따라 별도 검토해야 합니다.

녹음은 localhost/127.0.0.1 또는 HTTPS와 브라우저의 녹음 API 지원이 필요합니다.
일반 HTTP의 LAN 주소로 모바일 접속하면 마이크가 제한될 수 있습니다.
미지원 환경에서는 안내를 표시하며 기존 학습 흐름은 유지합니다.

### 휴대폰에서 녹음 확인하기 (로컬 HTTPS)

컴퓨터와 휴대폰을 같은 Wi-Fi에 연결하고, 컴퓨터의 프로젝트 폴더에서 `npm run dev:phone`을 실행합니다.
터미널에 `https://<컴퓨터의 LAN IP>:5176/` 주소와 로컬 CA 인증서의 위치가 출력됩니다.
서버는 표시된 LAN IP 한 개에 연결되며, 테스트가 끝나면 `Control + C`로 종료하세요.
컴퓨터에 여러 LAN 주소가 있어 다른 주소를 선택해야 한다면 현재 컴퓨터에 할당된 사설 IP에 한해
`PHONE_LAN_IP=<원하는 IP> npm run dev:phone`으로 지정할 수 있습니다.

첫 사용 때는 출력된 **`local-ca.cer` 파일만** AirDrop 또는 케이블 등으로 자신의 휴대폰에 옮겨
인증서를 설치하고 신뢰해야 합니다. `.key` 파일은 절대로 옮기지 마세요.

- iPhone: 인증서 프로파일을 설치한 뒤 **설정 → 일반 → 정보 → 인증서 신뢰 설정 → 루트 인증서에 대한 전체 신뢰**에서 이 개발용 CA를 켭니다. 그런 다음 Safari에서 터미널에 출력된 HTTPS 주소를 엽니다.
- Android: 기기의 **설정 → 보안/암호화 → 인증서 설치 → CA 인증서**에서 `local-ca.cer`를 설치한 뒤 Chrome에서 HTTPS 주소를 엽니다. 메뉴 이름은 Android 제조사/버전별로 다를 수 있습니다.

주소 표시줄에서 경고 없이 HTTPS가 열리는지 확인한 뒤 녹음 버튼을 눌러 마이크 권한을 선택하세요.
인증서 설치와 마이크 권한 허용은 사용자 기기에서 직접 결정해야 합니다. 이 개발용 CA를 신뢰하는 동안
이 컴퓨터의 CA 개인 키로 서명한 사이트 인증서도 휴대폰에서 신뢰할 수 있으므로 테스트 후에는
휴대폰에서 해당 CA를 삭제하거나 신뢰를 해제하는 것을 권합니다. 개발용 CA와 서버 개인 키는
프로젝트/Git 밖의 운영체제 임시 폴더에 보관하며, 이 폴더가 정리되면 새 CA 설치가 필요합니다.

IP 주소나 포트가 달라지면 브라우저의 학습 기록은 별개입니다. HTTPS로 접속해도
녹음은 브라우저 메모리에서만 처리되며 마이크 테스트를 위해 앱 서버에 전송하지 않습니다.

수동 검증: 짧게 녹음·재생한 뒤 원문 표시, 재녹음, 권한 거부, 녹음 중 화면 전환,
다음 Chunk 이동과 새로고침 후 녹음이 남지 않는지 확인해주세요.
자동 테스트에서는 실제 마이크 대신 가짜 미디어 장치로 데이터 수집·권한 경합·리소스 해제를 검증합니다.

## Progress Storage

### Account sync (live local connection verified; not deployed)

Supabase용 Google 로그인과 사용자별 자동 동기화 코드가 추가됐습니다.
설정 없는 기본 실행은 로컬 모드입니다. 현재 STA Track에서는 사용자 승인으로 서울 Free
프로젝트를 연결했고, 실제 Google 로그인·저장·독립 origin 간 동기화를 확인했습니다.
새 서비스·지역·유료 전환·전송 범위 변경은 별도 승인이 필요합니다.

연결 설정 항목(현재 컴퓨터 설정 완료, clone에는 포함하지 않음):

- `VITE_ACCOUNT_SYNC_ENABLED=1`
- `VITE_SUPABASE_URL`: 승인한 HTTPS Supabase 프로젝트 origin
- `VITE_SUPABASE_PUBLISHABLE_KEY`: publishable key만 사용. secret/service_role 키는 금지.
- SQL migration은 `supabase/migrations/`의 파일명 순서대로 적용한다(현재 3개). 승인된 서울 프로젝트에는 이미 수동 적용했다. CLI 이력에 기록하지 않았으므로 CREATE 구문을 중복 적용하지 않는다.
- 변경 없는 기록은 revision만 받아 통신량을 줄인다. 서버 복구 사본은 최근 저장 3개와 최근 저장일 7일의 첫 기록을 합쳐 사용자당 최대 10개다(날짜 기준 UTC, 저장하지 않은 날은 제외).
- 현재 학습 기록은 이 제한과 별도로 유지한다. 브라우저 복구 사본과 다운로드한 백업은 이 정책으로 삭제하지 않는다. 오래된 서버 사본으로 돌아갈 수 있는 범위는 제한된다.
- 보관 제한 migration 설치 자체는 기존 데이터를 삭제하지 않는다. 승인 후 실제 적용 시 각 사용자의 다음 저장 성공과 같은 트랜잭션에서 그 사용자의 오래된 서버 사본만 정리한다. 무료 용량/영구 복구를 보장하지 않으며 실제 운영 사용량 확인이 필요하다.
- 로그인은 `Continue with Google`로 변경됐다(2026-10-04 사용자 승인). 이메일 OTP UI는 제공하지 않으며 로그인 메일/SMTP가 필요하지 않다.
- Google OAuth Web client와 Supabase Google provider 설정은 완료했다. Secret은 Supabase 설정에만 보관하며 `VITE_*`, 앱 코드, Git에 넣지 않는다.
- Google 승인된 redirect URI는 해당 Supabase 프로젝트의 `/auth/v1/callback`; Supabase Site URL/redirect allowlist는 실제 Vercel 앱의 정확한 origin + `/`로 설정한다. 로컬 시험 주소는 별도 등록하며 광범위한 wildcard는 쓰지 않는다.
- Google scope는 기본 identity인 openid/email/profile만 사용한다. 메일함/Drive 접근이나 offline provider access를 요청하지 않는다. 동의 화면, 개인정보 안내, 테스터/공개 audience 설정은 실제 연결 전에 확인한다.
- 브라우저 PKCE로 로그인 시작→같은 브라우저 복귀→일회용 code 교환. 실패/취소 시 재시도 가능하며 code/provider error를 URL에서 지우고 원문을 화면·로그에 노출하지 않는다.
- 공식 설정: https://supabase.com/docs/guides/auth/social-login/auth-google 및 https://supabase.com/docs/guides/auth/sessions/pkce-flow . 실제 로컬 앱의 외부 로그인 시험은 완료했으며 배포 URL의 시험은 남았다.
- 공개 가입/테스터 허용 범위, 익명 로그인 비활성화, 인증 요청 rate limit과 abuse 보호 확인.

`Enable sync`를 한 번 선택하면 계정별로 설정을 기억합니다. 진도 변경 뒤 자동 저장하며
화면 복귀·온라인 복귀·활성 화면의 주기 확인으로 다른 기기의 기록을 가져옵니다.
양쪽 기록이 달라졌다면 `Use this device` 또는 `Use account copy`로 선택하며,
자동으로 한쪽을 덮어쓰지 않습니다. `Pause sync`는 로컬 저장을 중단하지 않습니다.

계정 로그인은 기존 미로그인 기록을 자동 업로드하지 않습니다. 이전 모드에서 백업을 내려받은 뒤
로그인한 계정의 `Backup & restore`에서 파일 미리보기와 명시적 복원으로 이전합니다.
계정별 복구 사본과 sync baseline은 브라우저에 남습니다. 공용 기기에서는 로그아웃하세요.
브라우저 저장값은 암호화된 금고가 아니며 기기 자체 접근 권한이 있는 사람을 막지 못합니다.
처음 로그인/재접속 시 인증 확인에는 인터넷 연결이 필요합니다. 연결이 끊겨도 기존 로컬 기록은 유지됩니다.
녹음·분석 추적은 업로드하지 않습니다.

로컬 PostgreSQL 및 격리 브라우저 시험 외에 실제 Google callback·Supabase 저장/read,
서로 다른 저장 origin의 양방향 동기화·백업 복원과 hosted RLS read 격리를 확인했습니다.
실제 다른 기기·다른 Google 계정·배포 주소·서버 동시 부하는 미검증입니다.
로그인 메일/SMTP는 이 Google 로그인 흐름에 사용하지 않습니다.

진행 위치·본문 보기 방식·자기평가·힌트 사용·Full Recall 완료 여부·마지막 학습 시각은
`english-output-webapp:progress` 키에 `version: 6` 구조로 저장합니다.
Chapter 1–12의 Pass 1–3, Pass 4+, 작문과 개인 답안이 포함됩니다.
새로고침하면 학습 위치와 평가를 복원하며, 정답과 힌트는 다시 숨깁니다.
손상·미지원·이전 형식 기록은 원본을 덮어쓰지 않고 저장을 보호합니다.
`Backup & restore`에서 원본을 다운로드하고, 지원되는 version 1–5 기록은
`Preview saved record`로 확인한 뒤 명시적으로 복원할 수 있습니다.
정상 백업은 `Download backup` → 다른 브라우저의 `Choose backup` → 미리보기 →
`Restore this backup`으로 옮깁니다. 개인 작문이 있으므로 파일을 비공개로 보관하세요.
복원 전 원본은 별도 recovery key에 보관하며 `Show recovery copies`에서 재복구할 수 있습니다.
녹음은 백업에 포함되지 않습니다. 저장 공간 부족이나 다른 탭 변경 시 경고를 표시합니다.
경고가 뜨면 현재 기록을 다운로드한 뒤 복구하세요. Web Locks를 지원하는 보안 컨텍스트가 필요합니다.

기본 로컬 모드의 기록은 해당 브라우저와 주소에만 저장되며 다른 컴퓨터와 공유되지 않습니다.
계정 동기화를 켠 경우에는 같은 Google 계정으로 로그인하고 동기화를 활성화하여 이어서 사용합니다.
`localhost`와 `127.0.0.1`, 서로 다른 포트도 별도 기록이므로 같은 주소로 접속해주세요.
브라우저 사이트 데이터를 삭제하면 학습 기록도 삭제됩니다.

## Content Privacy

원본 교재 PDF는 `.gitignore`의 `docs/sources/*.pdf` 규칙으로 Git 추적에서 제외됩니다.
Chapter별 학습 본문은 제공된 교재·부교재에서 가져오고 데이터에 출처를 기록합니다.
이 본문은 앱 코드와 빌드에 포함되므로 PDF 제외 규칙이 본문 코드까지 숨겨주지는 않습니다.
추가 학습 자료의 출처는 각 화면과 데이터 파일에 기록합니다. 원문 PDF를 Git에 넣지 않아도
발췌한 학습 문장은 코드에 포함됩니다. 공개 배포 전에는 콘텐츠 사용 권한을 별도로 확인해야 합니다.
작문·개인 답안에 민감정보를 입력하지 마세요. 기본 로컬 모드에서는 서버로 전송하지 않습니다.
실제 계정 서비스를 연결하고 동기화를 켜면 작문·개인 답안도 계정 저장소에 전송됩니다.
브라우저에 남은 사본은 이 기기에 접근할 수 있는 사람이 볼 수 있습니다.
