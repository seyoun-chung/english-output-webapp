# Product v1 completion

## Authoritative goal — 2026-10-03

사용자 확정: Chapter 1–12와 Pass 1–4+를 학습할 수 있고, 주요 오류 없이 진행되며,
기록을 잃지 않고 집·STA Track 어디서든 이어서 사용할 수 있는 웹 앱.
이 기준을 `1차 제품 전체 완성`으로 부른다. 단일 기능 완료와 구분한다.
발음 Lab, STT/AI 평가, 작문 교정 및 복습 알고리즘 고도화는 베타 피드백 이후로 제외한다.

## Acceptance ledger

Latest evidence (2026-10-05): release baseline `8f46b62` contains the protected deployment release.
The full suite passes 46 files / 416 tests and the production build. The fixed
HTTPS deployment, Google callback, hosted account record, security headers and physical phone ↔
STA Track continuation are verified. Community publication and beta enhancements remain separate.

| ID | 완료 조건 | 현재 근거 / 상태 | 남은 확인 |
|---|---|---|---|
| V1-1 | Chapter 1–12 Pass 1–3 학습·완료·저장 | **완료** — 12개 Source 묶음, 전체 Chapter Pass 1–3 완료·저장·백업 round trip 테스트 | 없음 |
| V1-2 | Pass 4+ 혼합·랜덤 복습·작문 | **완료** — Mixed/Smart/All Random/Writing 구현, Source-only 및 저장 회귀 통과 | 없음 |
| V1-3 | 주요 오류 안정화·수정 반영 | **완료** — 최신 UI·저장·녹음·보안 회귀 포함 46 files / 416 tests와 build 통과 | 없음 |
| V1-4 | 학습 기록 백업·복원 | **완료** — 자동 계정 저장, 손상 보호, recovery copy, version 1–5 migration과 실제 파일 복원 검증 | 없음 |
| V1-5 | 고정 HTTPS 주소에서 사용 | **완료** — 보호된 고정 Vercel 주소, 정확한 OAuth redirect, 운영 로그인·보안 헤더 확인 | 없음 |
| V1-6 | 휴대폰·노트북 등에서 이어서 학습 | **완료** — 휴대폰 Chapter 12가 STA Track에 반영되고 Pass 4+ 복구가 재로그인 뒤 유지됨 | 다른 사용자·부하 시험은 베타 운영 검증 |
| V1-7 | 통합 검증 | **완료** — 자동 회귀, 운영 OAuth/저장, 보호 배포, 실제 기기 왕복을 구분해 확인 | 커뮤니티 공개는 별도 결정 |

각 완료 판정은 구현·자동 시험·브라우저·배포 환경 증거를 분리해 기록한다.
실제 다른 컴퓨터를 사용하지 않은 검사는 두 브라우저 환경 시뮬레이션으로 표시한다.
백업이나 동기화만으로 모든 데이터 손실을 영구 방지한다고 보장하지 않는다.

## Execution order

1. 기존 영어 UI 수정 마무리. 현재 브랜치와 미커밋 변경을 보존한다.
2. 기록 보호: 손상/미지원 데이터의 자동 초기화·덮어쓰기 방지, 저장 실패의 전역 표시.
3. 로컬 백업·복원: 진행/자기평가/작문/개인 답안/Pass 4+ 포함; 녹음은 기존처럼 일시적이며 제외.
4. 승인된 비공개 배포·인증·동기화 구현. 유료 서비스·실제 데이터 업로드는 별도 승인 전 금지.
5. 실제 배포 주소 및 격리된 두 브라우저 환경에서 통합 검증 후 최종 사용자 확인.

## Security decisions pending

2026-10-03 갱신: 사용자 승인으로 다중 사용자 + Supabase 기준 로컬 개발을 진행했다.
본인 전용 Access 제안은 현재안이 아니다. 실제 Supabase 연결·지역·비용·가입 허용 정책,
외부 데이터 전송과 배포는 별도 승인 전이다. 아래 Cloudflare 조사 내용은 과거 후보 기록이다.

- 각 사용자별 비공개 기록이 기준이다. 교재 JS 자산은 프론트 로그인만으로 보호되지 않으므로
  호스팅 접근 제어/콘텐츠 제공 권한은 배포 전 별도 확인한다.
- 외부 저장 대상은 학습 진행·작문·개인 답안. 녹음 업로드, 광고/분석 추적은 범위 밖.
- 서버/호스팅 공급자, 계정, 비용, 데이터 저장 위치와 접근 정책은 승인 전 미확정.
- Git commit/push/PR/merge와 후속 작업 브랜치 생성 일괄 승인 여부를 사용자에게 질문함.
- 비밀값은 채팅·저장소·브라우저 번들에 기록하지 않는다.
- 동시 수정은 무조건 마지막 기록으로 덮어쓰지 않는다. 충돌 양쪽 보존·복구 경로를 검증한다.

## Read-only audit findings

- `App.tsx`는 parseAppProgress 결과를 effect에서 즉시 저장한다. parser가 손상/알 수 없는
  입력을 초기 상태로 되돌리면 원본 기록이 덮일 수 있다. 이번 점검은 코드 확인이며,
  실제 사용자 데이터로 파괴적인 재현은 하지 않았다.
- storageError 경고는 Chapter 화면 안에만 있고 Library/Pass 4+는 조기 return한다.
- README의 Chapter 3 시범 범위·저장 version 2 설명은 현재 version 6 구현과 불일치.
- 마이크 음소거 해제 후 사용자 녹음은 정상 확인됐지만 OS 음소거 재발 원인은 미확인.

## Current execution status

사용자 추가 확정: 배포는 모든 로컬 개발·검증 및 최종 확인 이후에만 한다.
외부 서비스 생성·배포·개인 기록 업로드·Git commit/push/merge는 수행하지 않았다.
Git 일괄 승인과 외부 저장 공급자 선택은 아직 미확정이며, 로컬 구현은 진행 승인됨.

### Local backup foundation — 2026-10-03

- Backup & restore 메뉴를 Chapter·Library·Pass 4+에 연결.
- 버전 6 진행·자기평가·작문을 파일로 내보내고, 가져오기 시 형식/크기/구조 검사.
- 미리보기·명시적 복원 버튼과 원본 recovery copy 보관 후 교체.
- 손상·미지원 저장 데이터의 자동 덮어쓰기를 중단하고 원본 다운로드 제공.
- Web Locks와 기존 저장값 대조를 통해 앱의 여러 탭 쓰기를 직렬화.
- 36개 파일 / 363개 테스트 및 production build 통과.
- 격리 Chrome 1280px/320px에서 실제 파일 다운로드·가져오기·취소·복원,
  잘못된 JSON 거부, 새로고침, 원본 보존, 모든 화면에서 메뉴 접근 확인.
- 후속 작업에서 recovery copy 목록/재복구 UI, version 1–5 보호된 migration,
  다중 탭 경쟁·크기 제한·저장 실패 검증을 완료했다. 운영 배포 후 회귀는 남음.
- 사용자의 실제 localStorage는 시험에 사용하거나 수정하지 않았다.

## Hosting candidate research — not approved

### Current candidate: Supabase local implementation

공식 문서: https://supabase.com/docs/guides/auth,
https://supabase.com/docs/guides/database/postgres/row-level-security,
https://supabase.com/docs/guides/auth/auth-smtp,
https://supabase.com/pricing . 현재 구현은 이메일 OTP + RLS + 원자적 RPC다.
Free/Pro와 메일·호스팅 비용은 실제 연결 직전에 다시 확인한다. 사용자가 비용/지역을 승인하지 않았다.
로컬 SQL/브라우저 검증은 완료했지만 Hosted Auth·메일·DB 운영 확인을 대신하지 않는다.

로컬 동기화 시험은 별도 활성화한 loopback 개발 서버에서만 가능하다. revision 비교로
오래된 쓰기를 거부하고, 최초 연결/양쪽 변경은 선택을 요구한다. 서버는 과거 revision을
보존하며 독립 store 경합도 exclusive link로 차단한다. 브라우저 원격 수신 전에는
local recovery copy를 남긴다. 1280px/320px 두 브라우저의 충돌·양방향 선택·오프라인
재시도를 확인했다. 이는 운영 DB·인증·보존기간 정책 또는 실제 기기 간 동기화를 대체하지 않는다.

2026-10-03 공식 문서 확인. 후보는 Cloudflare Workers + Access + D1이다.
가입·외부 리소스 생성·결제·배포·기록 업로드는 수행하지 않았다.

- Workers Access는 Worker 전체를 보호하여 production/preview 및 연결 hostname을
  포괄할 수 있다. 정적 자산도 보호된다. hostname 한 개만 보호하는 방식은 다른
  접속 경로가 빠질 수 있으므로 전체 보호 및 익명 자산 요청 차단 검증이 필요하다.
  https://developers.cloudflare.com/workers/configuration/cloudflare-access/
- Access는 허용된 이메일에 일회용 로그인 코드를 보내는 인증 방식을 제공한다.
  실제 허용 이메일·계정 연결은 사용자 승인 후 설정한다.
  https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/
- D1 Free의 공식 현재 한도: 일 500만 rows read, 10만 rows write, 총 저장 5GB.
  개인 학습의 후보로 적합하다는 것은 추정이며 무료 운영을 보장하지 않는다.
  무료 한도 초과 시 실패에 대비해 로컬 기록을 보존하고 재동기화할 수 있어야 한다.
  https://developers.cloudflare.com/d1/platform/pricing/
- Access와 Workers/D1은 서로 다른 제한을 갖는다. 서비스 선택 시 전체 계정의
  실제 플랜과 제한을 재확인하고 유료 전환은 별도 승인한다.
  https://www.cloudflare.com/plans/zero-trust-services/
  https://developers.cloudflare.com/workers/platform/pricing/
- 위 문서 확인은 배포 성공·접근 보호 검증의 증거가 아니다. 실제 익명 HTML/JS/API
  차단, 로그인 후 접근, 데이터 분리 및 충돌 복구를 통과해야 V1-5/6을 완료로 판정한다.
