# Current Task

## Automatic account continuation and login copy — 2026-10-04

User requested a one-action learning journey: Google sign-in, automatic account
record load/save, sign-out, and later continuation at the saved position; users
remain free to choose another chapter. Normal learner UI no longer shows the
five manual backup/sync controls. An untouched new browser downloads its existing
account record; two independently edited records still require an explicit choice.
Sign-out checks the pending account save and stays signed in if it cannot confirm
the save. A storage warning still exposes recovery controls. Existing anonymous
browser records are preserved but not silently uploaded into an account.
Login copy now uses the user's requested heading, Google sign-in line, blue CTA,
and shared-device sign-out reminder. Current work is local on
`codex/korean-login-copy`; commit/push/PR/merge/deployment remain unapproved.
`npm run verify`: 45 test files / 414 tests, identity/safety, and build passed.
Read-only local browser checks: signed-out copy at localhost, one 44px CTA and
no 375px overflow; signed-in 127.0.0.1 overview shows no normal management panels.
Real second-device/logout-and-return validation and production deployment remain
unverified. Do not call the first-product goal complete.

## Korean login copy — 2026-10-04

Follow-up: user requested less text. Normal login now contains only a short heading, one same-account
hint and Google button. Retry appears only for login/callback verification failures. Removed verbose
first-page record/audio/security paragraphs, not the underlying protections or backup/privacy guidance.
Related 3 suites / 14 tests and build passed; 1280px/320px render has one normal-state button and no
horizontal overflow. Synthetic cancellation shows Korean error and retry; normal URL restored.

User requested Korean for the login first page and approved a fresh branch from latest main.
`codex/korean-login-copy` starts at PR #32 merge `2c64330174499b6e1e37ee5acc4d6be7da8c7d17`.
Login title, explanatory/security text, buttons, loading/verification/callback error and signed-out
messages are Korean. Learning UI and the signed-in account bar remain unchanged.
No auth scopes, callback destinations, sync/storage logic, learning content or CSS were changed.
Related 4 suites / 20 tests and client/server build passed. Rendered signed-out page at 1280px/320px:
no horizontal overflow, both mobile buttons 44px high, retry returns to login page, keyboard Tab
reaches retry, synthetic cancellation renders Korean error and removes error from URL.
No real Google consent or physical mobile test was repeated for this copy-only change.
Current changes are local only; commit/push/PR/merge/deployment are not approved for this branch.

## Live connection verified locally — 2026-10-04

User explicitly approved branch creation, Seoul Supabase storage/auth configuration and local
connection verification. User subsequently approved this seven-document commit/push/PR/merge release.
Deployment and billing changes remain excluded.
Branch `codex/supabase-live-connection` starts from verified origin/main `5f58e65` (PR #31 merged).
Target is `english-output-webapp-seoul`, project `ihvmcxluaiyisncebtqk`; do not touch the saju project.
Google provider is Enabled. Site URL is `http://127.0.0.1:5173/`; exact redirects are that URL
and `http://localhost:5173/`. No wildcard or production redirect is configured.
All three reviewed SQL migrations were applied together through the dashboard SQL editor in one
transaction after checking the learning tables/functions were absent. This was manual SQL application,
not a Supabase CLI migration-ledger update; do not blindly apply the same create statements again.
Hosted catalog checks confirm RLS, own-record SELECT policies, denied anonymous/table writes,
authenticated RPC grants and the retention trigger. Anonymous HTTP read RPC returned 401.
The ignored `.env.local` contains only the account feature flag, project URL and publishable key.
Google secret/service-role credentials are not in the app. Original local progress namespace is untouched.
User completed Google selection/consent. Real PKCE callback, reload persistence and authenticated
save/read succeeded. Independent 127.0.0.1 / localhost storage origins exchanged navigation state
bidirectionally; first connection explicitly selected the account copy. Signing out of localhost
left the 127 session signed in. This is not a physical second device or separate browser profile.
Hosted authenticated-role isolation check with a different synthetic subject sees zero progress/history
rows and empty read RPCs; it rolled back without creating a user or record. Not a second real Google user.
Actual downloaded backup was selected, previewed and restored; previous record remains a recovery copy.
320px login/connected overview, backup and sync controls have no document horizontal overflow.
Full `npm run verify`: 45 files / 411 tests, client/server build and identity/safety passed.
Four focused suites / 22 tests also passed. No source or learning-content change in this increment.
Next gate after the approved Git publication of these connection/verification documents: separately approve
final Vercel deployment and its audience/content exposure. Fixed HTTPS URL, production callback,
real-device/second-real-user and hosted load verification remain unexecuted. Overall goal is not complete.
Check the app's actual GOAL status before claiming it is active; Git approval does not itself prove
the goal status changed. Do not repeatedly ask for the approved connection scope.
Student approval/allowlist is deferred by the user; community publication decision comes at the end.
Older entries below describe past approval gates and are superseded by this entry where they conflict.

## Bounded server recovery — local implementation (2026-10-04)

사용자가 사이드 대화를 통해 합리적 보관 정책의 선택·로컬 구현·검증을 위임했다.
PR #30은 `b06da28`로 merged. 그 main 기준 `codex/bounded-recovery-history`에서 작업한다.
선택 정책: 최근 저장 3개 + 최근 저장일 7일의 첫 사본(UTC)을 중복 없이 최대 10개 보관한다.
자동 저장이 잦아도 하루 시작 사본이 모두 밀려나지 않도록 단순 최근 5개 후보를 개선했다.
현재 학습 진도/답변/작문, 브라우저 복구 사본, 다운로드 백업은 이 제한으로 변경하지 않는다.
세 번째 SQL migration은 설치만으로 삭제하지 않으며 다음 성공한 저장에서 해당 사용자만 정리한다.
실제 DB 적용/삭제·외부 연결·배포는 승인 밖이다. 사용자가 이번 변경의 commit/push/PR/merge를 승인했다.
배포 전 승인 범위 안의 로컬 준비를 마무리하며 외부 연결/콘텐츠 접근 결정만 사용자에게 모아 전달한다.
구체적인 연결 순서·남은 승인·운영 검증은 docs/deployment_readiness.md를 따른다.
최종 로컬 준비 검증: 45 files / 411 tests, client/server build, identity/safety, npm audit(0 known advisories).
배포 전 독립적인 로컬 구현/검사는 완료했다. 실제 연결은 외부 저장/프로젝트·지역 승인 및 교재 제공 권한,
참여자 접근 범위가 필요하다. 현재 인증 화면만으로 정적 교재 번들을 보호한다고 주장하지 않는다.
검증 결과는 docs/verification.md 참조. 남은 연결 결정: 서비스 지역/비용, 가입/교재 접근 권한.

## Release candidate published — PR #30 (2026-10-04)

최신 개발분은 `bb8476a`로 commit/push했고 [PR #30](https://github.com/seyoun-chung/english-output-webapp/pull/30)에 포함됐다.
46개 변경 파일, staged index 137개 파일 안전 검사와 406개 테스트/build 통과. 실제 배포 없음.
원격 PR은 충돌 없이 병합 가능하며 자동 CI/check/status는 설정되어 있지 않다. CI 통과로 표현하지 않는다.
사용자 승인으로 merge 진행 단계다. 최종 병합 여부와 main SHA는 GitHub PR에서 직접 확인한다.
이 기록 이전의 '개발분 미커밋'은 과거 상태다. 승인 범위 안의 로컬 구현/검증은 완료됐으며,
이후 실제 연결은 서비스 지역/비용·가입 범위·교재 권한·기록 보관 정책 결정이 필요하다.
GitHub Support 회신은 로컬 개발의 차단 조건이 아니다. 배포는 별도 최종 승인 전까지 금지한다.

## Predeployment release preparation — 2026-10-04

사용자가 최신 개발분의 새 브랜치, 검사, commit/push/PR/merge 진행을 승인했다.
`codex/predeployment-records-release`를 원격 main과 동일한 `16db1c7`에서 생성하고 기존 변경을 보존했다.
백업/복원, Google 로그인, 계정별 동기화의 로컬 구현과 안전장치를 함께 버전 관리한다.
재검증: 44 files / 406 tests, client/server types/build, worktree safety, publishable identity 통과.
전체 refs 감사의 예전 이메일은 보존된 로컬 복구 refs이며 업로드 대상에서 제외한다.
이번 단계는 Git release이며 배포가 아니다. 실제 Google/Supabase 연결, 서비스 지역/비용,
가입 허용 범위, 교재 제공 권한, 복구 이력 보관 정책 확정과 운영 검증이 남아 있다.
아래는 시점별 이력이며 최신 결과가 과거 승인대기/미실행 설명보다 우선한다.

## Completed branch-history cleanup; GitHub residuals pending — 2026-10-04

사용자가 영향 설명 후 진행을 승인했다. 별도 mirror에서 git-filter-repo 2.47.0으로 실제 이메일만
승인된 noreply로 바꾸고, 63개 커밋 모두의 tree/메시지/이름/날짜와 parent topology 보존을 검증했다.
원격 heads 30개를 정확한 이전 SHA lease와 atomic push로 교체했고 전부 ls-remote 재확인했다.
새 main: `16db1c7eaf484d19ae031dc138cd4b6f37fdcbe9` (이전 `4824761`).
STA Track 로컬 heads 27개도 동일 tree 확인 후 CAS update-ref로 정렬했으며 index/worktree는
변경하지 않았다. 사전 백업한 작업 파일 137개 해시가 그대로임을 확인했다. 브랜치 삭제 없음.
프로젝트 앱 개발 변경은 여전히 미커밋이며 이번 push에는 기존 이력의 이메일 정리만 포함됐다.

복구용 원본 bundle 및 작업 파일 사본은 ignored tmp에 보관한다. 파일 사본에는 `.backup` suffix가
있다. 실제 이메일이 포함된 복구 원본·stash·앱 내부 refs는 삭제하지 않았고 외부 업로드 금지다.
pre-push는 publishable branches/remotes/tags와 실제 전송 source SHA를 검사한다. 복구 refs는
자동 업로드하지 않지만 과거 SHA를 직접 push하면 차단됨을 --to-stdin 훅 실행으로 검증했다.
현재 branch history 63개 검사 통과; 전체 refs 감사는 보존된 복구 이력 때문에 계속 탐지할 수 있다.

잔여 문제: GitHub API로 기존 commit `6c863d8`이 아직 조회된다. 브랜치 정리는 완료됐지만
PR refs/캐시/서버 객체의 완전 삭제는 미완료다. 사용자 승인으로 GitHub Support 요청
[#4819958](https://help.github.com/ticket/personal/0/4819958)을 2026-10-04 제출했고 목록에서 Open 접수를 확인했다.
저장소 URL, 관련 SHA, 수행한 정리/검증 내역만 본문에 전달했으며 실제 이메일 값과 파일은 첨부하지 않았다.
계정의 기존 연락 이메일은 지원 서비스의 회신 주소로 사용된다. 저장소 삭제 요청이 아니며,
개인 이메일 metadata의 삭제 대상 적격성 및 서버 정리 결과는 지원팀 검토 대기다. 배포/학습 데이터 전송 없음.
최종 npm run verify: 44 files / 406 tests, client/server types/build/safety/identity 통과.
집에서는 handoff의 재동기화 및 검증 완료 전 일반 pull/merge/push 금지.
새 clone의 원격 이력 일치, 로컬 작업/학습 기록 보존, noreply와 제공된 보호 장치 확인 후 새 폴더에서 재개한다.
이는 지원팀 답변/티켓 종료를 기다리라는 뜻이 아니다. 기존 clone은 재사용/push하지 않고 보존한다.
아래 미실행/승인대기 표시는 이 작업 전 기록이며 이 항목이 우선한다.

## Session split and home handoff — 2026-10-04

사용자 요청으로 전체 GitHub 저장소 이메일 점검을 별도 읽기 전용 대화로 분리했다.
여기서는 영어 앱 개발/검증을 유지한다. 집 안내 시 이력 재작성 여부 확인과 필요 시 재동기화를
일반 pull보다 먼저 진행하도록 AGENTS/handoff에 기록했다. 이 문서는 아직 로컬 미커밋이므로
집에 자동 전달된다고 간주하지 말고 최종 전달 프롬프트에도 반드시 포함한다.
최신 통합 검증: 44 files / 406 tests, client/server TypeScript, production build, identity/safety 통과.
과거 이력은 그대로이며 push guard는 여전히 차단 중. 강제 push 및 새 main SHA는 생성되지 않았다.
다음 Git 실행 전 원격 이력 재작성 범위의 명시 승인을 확정해야 한다. 외부 서비스 연결/배포도 미실행.

## Identity recurrence prevention — 2026-10-04

현재 사용자 요청으로 로컬 identity guard와 `.githooks`를 추가/활성화했다.
기존 hooksPath/활성 훅이 없음을 먼저 확인했으며 다른 프로젝트의 전역 설정은 변경하지 않았다.
문제 3개는 2026-09-22 01:19–01:35 KST의 초기 커밋이다. 같은 날 21:10부터 확인한 이후
이력은 noreply다. 새 설정 해제가 아니라 이전 이력의 잔류이며 과거 파일 위주 검사의 빈틈이다.
관련 28 tests 및 실제 git hook run pre-push 차단 확인. 전체 로컬 refs 65개 중 3개 탐지.
현재 branch/HEAD/작업 내용은 유지. 과거 이력 재작성, force push, 외부 지원 요청은 미실행.
이력 정리 별도 승인 전 Git release 보류. 집 컴퓨터에는 아직 훅이 설치되지 않았다.

## Current gate — GitHub privacy audit (2026-10-04)

배포 전 정리 중 사용자 요청으로 기존 원격 이력까지 보안/개인정보 검사를 확대했다.
현재 브랜치 `codex/review-english-copy`, HEAD와 원격 main은 `4824761`이며 로컬 변경은 미커밋이다.
원격 저장소는 private. 현재 작성자 이메일은 승인된 noreply다.
그러나 과거 커밋 `6c863d8`, `86845bd`, `c5959ff`의 작성자/커미터에 실제 개인 이메일이 남아 있다.
값 자체는 문서에 재기록하지 않는다. 이력 삭제/재작성/force push는 하지 않았다.
이 개인정보 처리 결정 전 commit/push/PR/merge를 보류한다. 선택지는 비공개 이력을 유지하고
이 사실을 수용한 뒤 진행하거나, 별도로 승인된 이력 정리 계획을 수립하는 것이다.
후자는 집/STA Track의 기존 clone 및 PR 참조에 영향을 주므로 일반 push 승인과 구분한다.
나머지 로컬 기능 구현/격리 검증은 이전 기록을 유지하며 실제 배포와 외부 서비스 연결은 미실행이다.
Vercel CLI 읽기 조회로 현재 계정의 프로젝트 2개는 이 저장소와 연결되지 않음을 확인했다.
아래 과거 Vercel 미확인/Git 승인 대기 기록보다 이 항목이 우선한다. 상세 범위는 verification 참조.

## Latest approval — Continue with Google (2026-10-04)

사용자가 Google 로그인 변경과 로컬 구현·검증을 승인했다. 아래의 Google 선택 대기는 해소됐다.
베타는 커뮤니티 피드백/개선 목적이며 유료화 결정이 아니다. Vercel 선택과 배포 마지막 원칙 유지.
Google PKCE 버튼/콜백/취소·실패 재시도, URL code 제거 구현. 기존 계정별 저장/동기화 유지.
실제 OAuth 프로젝트/secret 설정, Supabase 연결, 개인 데이터 전송, 배포·Git 반영은 미실행.
다음 외부 연결에 필요한 정보는 기존 Vercel 프로젝트 주소와 승인할 Supabase 프로젝트/지역 및
참여자 접근 범위다. 복구 이력 보관/교재 제공 권한도 미확정이며 전체 GOAL은 미완료다.

## Latest decision — Vercel, free-first beta (2026-10-04)

- 사용자는 기존 Vercel을 호스팅으로 선택했다. Cloudflare 배포 제안은 대체한다.
- 선택은 배포·외부 데이터 전송·유료 전환 승인이 아니다. 실제 배포는 최종 단계 유지.
- 현재 로컬에 `.vercel/project.json` 연결 정보가 없으며 Vercel 연결 도구도 없다. 기존 프로젝트 URL/요금제는 미확인.
- Supabase 로컬 개발은 승인됐지만 Google 로그인 전환은 아직 제안 상태다. 현 구현은 이메일 OTP.
- 무료 통신량 개선: 계정별 검증된 메모리 사본과 조건부 읽기 RPC로 unchanged 시 전체 기록을 재전송하지 않는다.
  두 번째 migration을 추가했으며 원격 적용·기록 삭제는 하지 않았다.
- 다음 실제 결정: 베타 로그인 방식을 Google로 바꿀지, 기존 이메일 방식을 유지할지 사용자 선택 필요.
  복구 이력 보관 정책, 실제 서비스 연결·지역·비용·테스터 범위·교재 접근 권한도 확정 전이다.
  이 선택 없이 외부 연결/배포로 넘어가지 않는다. 전체 GOAL 미완료.

## Active GOAL — 1차 제품 전체 완성 (2026-10-03)

### Latest decision and implementation — multi-user Supabase, pre-deployment only

사용자는 여러 사람이 휴대폰/노트북에서 자기 기록으로 사용하는 앱을 확정했고,
Supabase 기준 로컬 구현(선택 1)을 승인했다. 본인 한 명 전용이라는 과거 제안을 대체한다.
실제 계정 생성·클라우드 연결·메일 발송·개인 기록 업로드·결제·배포·Git 반영은 승인 범위 밖이다.

- 이메일 코드 로그인 UI/SDK, 로그인 검증 후 계정별 브라우저 기록/백업 분리 구현.
- Supabase SQL migration: RLS로 본인 기록/이력만 조회, 직접 변경 차단, auth.uid 기반 RPC,
  revision CAS와 행 잠금, 중복 요청 처리, 이전 revision 보존.
- 계정별 명시적 sync 활성화 후 자동 저장·focus/online 재조회·재접속 baseline 복원.
- 첫 기기의 미연결 기록은 자동 업로드하지 않는다. 백업 가져오기→미리보기→복원으로 명시적 이전.
- PGlite 로컬 PostgreSQL에서 SQL 실행/권한 검사, Supabase HTTP를 가짜 응답으로 대체한
  격리 브라우저에서 OTP 오류/성공·계정 전환·양방향 동기화·오프라인/재접속을 확인했다.
- 실제 인증메일·Hosted Supabase JWT/RLS·운영 동시 트랜잭션·실제 기기간 시험은 미실행이다.
- 다음 승인 경계: 서비스 비용·저장 지역·이메일 발송/테스터 가입 범위를 안내하고 실제 연결 승인.
  실제 앱 배포는 그 연결 검증 후에도 별도 최종 승인이다. 전체 GOAL 미완료.

아래 로컬 prototype 기록은 이전 단계이며 최신 상태는 이 항목과 verification을 따른다.

최우선 범위와 완료 판정은 [product_v1_completion_plan.md](./product_v1_completion_plan.md)를 따른다.
기존 학습 기능은 재구현하지 않고 저장 보호·백업/복원·고정 HTTPS 주소·기기 간 동기화와
통합 검증을 완료한다. 아래의 과거 `남은 개발 단위 없음`은 당시 학습 엔진 범위의 기록이며,
이번 전체 제품 GOAL 완료를 뜻하지 않는다. 배포는 최종 단계에서 별도 승인 후 진행한다.
로컬 백업/복원·재복구 UI·version 1–5 보호된 migration·저장 보호를 구현했다.
동기화는 로컬 전용 시험 서버·충돌 처리·수동 연결 UI까지 구현했다. 운영 동기화는 아니다.
격리 Chrome 두 브라우저에서 최초 연결 선택, 양방향 변경, 충돌, 오프라인 재시도,
복구 사본과 여러 탭 덮어쓰기 차단을 확인했다. 상세 증거는 verification 최신 항목 참조.
최종 `npm run verify`: 38개 파일 / 380개 테스트, 클라이언트·서버 타입 검사·빌드·안전 검사 통과.
다음 실제 결정 경계: 외부 저장 서비스와 비공개 로그인 방식 승인 후 운영용 연결을 구현하고,
로컬에서 확인한 뒤 별도 최종 배포 승인. 비용·외부 계정 생성·업로드는 미실행.
개인정보·보안·비용 및 Git 일괄 권한은 미확정. 외부 업로드와 Git 반영은 하지 않았다.

## Current — Simple English review copy (2026-10-03)

- 사용자 실제 학습 기록에서 Review 클리어 흐름 정상 동작 확인.
- 이전 변경은 PR #29, main `4824761`로 병합됨.
- 최신 main에서 `codex/review-english-copy` 생성 후 Review 안내·버튼과 Pass 2
  Overview의 연결 문구를 짧은 영어로 통일. 학습 Source·자기평가 버튼·저장 로직은 유지.
- 35개 파일 / 347개 테스트, build, 안전 검사 통과.
- 격리 Chrome에서 Chapter 1·2 × Pass 1–3 클리어·새로고침·전체 재연습 통과.
  1280px/320px 레이아웃과 완료 화면 확인. 실제 모바일 기기 검증은 아님.
- 로컬 수정만 완료. 이번 변경의 commit·push·merge는 미실행.

## Current — Chapter Review 전체/어려운 문제 선택 (2026-10-02)

- 사용자 확정: 모든 문제에 자기평가하면 한 세트 완료. 전체 재연습과 어려운 문제만
  클리어하는 연습을 모두 제공한다.
- Pass 1–3 모두 현재 Chapter·회독에서 평가한 Source 문제를 대상으로 한다.
  아래 역사 기록의 고정 12문제·6 Recall + 6 Output 정책을 대체한다.
- 현재 학습 평가와 복습의 최신 평가를 사용해 effort/review만 어려운 목록에 포함한다.
  immediate로 재평가하면 제외하고, 새 학습에서 어려워지면 다시 포함한다.
- 최초 학습 평가를 Review가 덮어쓰지 않으며, 최신 복습 평가와 한 세트 완료 이력을
  별도로 저장한다. 선택 연습 재시작이 기존 회독 완료를 취소하지 않는다.
- 과거 고정 세트에서 실제 평가한 항목과 완료 이력을 보존한다.
- 검증: 34개 파일 / 344개 테스트, build, 안전 검사 통과.
  격리 Chrome에서 Chapter 1·2 × Pass 1·2·3의 클리어·재연습·새로고침,
  1280px/320px 가로 넘침 없음 확인. 사용자 저장 데이터는 시험에 사용하지 않았다.
- 브랜치: codex/review-clear-flow. commit·push·merge 미실행.

## Active — Pass 4+ Automatic (2026-10-02)

- 상태: 구현·자동 검증·브라우저 검증 완료, commit·push 전
- 전역 Pass 4+ 공간에 Mixed Chapters, Smart Review, All Random,
  Multi-Chapter Writing을 구현
- 기존 Chapter별 Pass 1–3 데이터는 version 6 migration에서 보존
- Review 대상은 기존 Source 묶음 중 실제 자기평가 기록이 있는 항목으로 제한
- All Random은 정답 공개 전 Chapter·Pattern·Source 단서와 Hint를 숨김
- Smart Review는 PRD 기본 우선순위만 적용하며 숫자 Weight·복습 간격은 확정하지 않음
- `npm run verify`: 33개 테스트 파일, 339개 테스트와 production build 통과
- 브라우저 실제 버튼으로 Mixed 선택·2문항 완료, All Random 단서 제거,
  Multi-Chapter Writing 저장·새로고침 복원을 확인
- Chrome 320×740에서 주요 화면 가로 Overflow 없음과 주요 CTA 44px 이상 확인
- Chapter 1–12 각각의 Pass 1 → Pass 2 → Pass 3 완료와 전역 Pass 4+ 진입을
  단일 curriculum 회귀 테스트로 최종 검증
- 남은 개발 단위 없음. Git 반영과 main 병합 승인 대기

세부 범위는 [pass4_automatic_plan.md](./pass4_automatic_plan.md)를 따른다.

## Active — Common Chapter engine rollout (2026-10-02)

Chapter 3 Pass 3 병합 후 사용자가 중단 없이 전체 Chapter 개발을 계속 진행하도록 승인했다.

### Chapter 6 Source rollout

- 상태: PR #21로 main 반영 완료. merge commit `e5da998`
- main textbook pp.116–125, 126–127, 133–135와 Week 6 My Story / Real Conversations 노트를 Source로 확인
- Chapter 6 My Story 6 chunks, Conversation 10 turns, Exact 6, Source Variation 6,
  Grammar, What About You / Let’s Have a Talk 13 questions, Beginner Template 6개를 등록
- Source의 여행자 B/C 대사는 문장을 바꾸지 않고 공통 엔진의 B 역할로 그룹화
- `npm run verify`: 25개 테스트 파일, 304개 테스트와 production build 통과
- 브라우저에서 Library 진입, My Story, Conversation, Grammar, Writing과 320×740 반응형을 확인
- 다음 increment였던 Chapter 7 Source 콘텐츠 적용을 진행함

### Chapter 7 Source rollout

- 상태: PR #22로 main 반영 완료. merge commit `4cd15e7`
- main textbook pp.140–146, 148–149, 152–154와 Week 7 My Story / Real Conversations 노트를 Source로 확인
- Chapter 7 My Story 6 chunks, Conversation 9 turns, Exact 6, Source Variation 6,
  Grammar, What About You / Let’s Have a Talk 13 questions, Beginner Template 9개를 등록
- 질문 선택 화면이 선택된 Source의 실제 section/page를 표시하도록 공통 출처 표시 오류를 수정
- `npm run verify`: 26개 테스트 파일, 308개 테스트와 production build 통과
- PDF로 My Story p.141과 Real Conversations p.149를 시각 대조하고, 브라우저에서 Library,
  My Story Read/Recall/Hint/Answer/저장, Conversation, Grammar, What About You, Writing Template을 확인
- 좁은 내장 브라우저에서 주요 화면의 반응형 배치와 접근 가능한 CTA를 시각 확인
- 다음 increment였던 Chapter 8 Source 콘텐츠 적용을 진행함

### Chapter 8 Source rollout

- 상태: PR #23으로 main 반영 완료. merge commit `e110f45`
- main textbook pp.158–164, 166–167, 170–172와 Week 8 My Story / Real Conversations 노트를 Source로 확인
- Chapter 8 My Story 6 chunks, Conversation 10 turns, Exact 6, Source Variation 6,
  Grammar, What About You / Let’s Have a Talk 14 questions, Beginner Template 6개를 등록
- `npm run verify`: 27개 테스트 파일, 312개 테스트와 production build 통과
- PDF로 My Story pp.158–159와 Real Conversations pp.166–167을 시각 대조하고,
  브라우저에서 Library, Recall/Hint/Answer, Conversation, Grammar, What About You, Writing Template을 확인
- 좁은 내장 브라우저에서 Overview와 Writing Template의 반응형 배치를 시각 확인
- 다음 increment였던 Chapter 9 Source 콘텐츠 적용을 진행함

### Chapter 9 Source rollout

- 상태: PR #24로 main 반영 완료. merge commit `d026240`
- main textbook pp.176–182, 184–185, 189–191와 Week 9 My Story / Real Conversations 노트를 Source로 확인
- Chapter 9 My Story 6 chunks, Conversation 11 turns, Exact 6, Source Variation 6,
  Grammar, What About You / Let’s Have a Talk 15 questions, Beginner Template 6개를 등록
- Source의 직원 C 대사는 문장을 바꾸지 않고 현재 A/B 역할 엔진의 B 역할로 그룹화
- `npm run verify`: 28개 테스트 파일, 316개 테스트와 production build 통과
- PDF로 My Story, Grammar, Real Conversations, What About You, Beginner Template,
  Let’s Have a Talk 원문 페이지를 시각 대조
- 내장 브라우저에서 Library, My Story Read/Recall/Hint/Answer, 11턴 Conversation,
  What About You, Writing Template과 320×740 반응형 배치를 확인
- 다음 increment였던 Chapter 10 Source 콘텐츠 적용을 진행함

### Chapter 10 Source rollout

- 상태: PR #25로 main 반영 완료. merge commit `8b45dc7`
- main textbook pp.196–202, 204–205, 208–210과 Week 10 My Story / Real Conversations 노트를 Source로 확인
- Chapter 10 My Story 6 chunks, Conversation 8 turns, Exact 6, Source Variation 6,
  Grammar, What About You / Let’s Have a Talk 12 questions, Beginner Template 7개를 등록
- Let’s Have a Talk에서 같은 카드에 표시된 여행 계획 두 문장은 하나의 질문 Source 단위로 보존
- `npm run verify`: 29개 테스트 파일, 320개 테스트와 production build 통과
- PDF로 My Story, Grammar, Real Conversations, What About You, Beginner Template,
  Let’s Have a Talk 원문 페이지를 시각 대조
- 내장 브라우저에서 Library, My Story Recall/Hint/Answer, 8턴 Conversation,
  What About You, Writing Template과 320×740 반응형 배치를 확인
- 다음 increment였던 Chapter 11 Source 콘텐츠 적용을 진행함

### Chapter 11 Source rollout

- 상태: PR #26으로 main 반영 완료. merge commit `6115319`
- main textbook pp.214–221, 226–228과 Week 11 My Story / Real Conversations 노트를 Source로 확인
- Chapter 11 My Story 6 chunks, Conversation 9 turns, Exact 6, Source Variation 6,
  Grammar, What About You / Let’s Have a Talk 12 questions, Beginner Template 6개를 등록
- 기존 catalog의 Real Conversations 페이지 223–224를 실제 본문 220–221로 수정
- `npm run verify`: 30개 테스트 파일, 324개 테스트와 production build 통과
- PDF로 My Story, Grammar, Real Conversations, What About You, Beginner Template,
  Let’s Have a Talk 원문 페이지를 시각 대조
- 내장 브라우저에서 Library, My Story Recall/Hint/Answer, 9턴 Conversation과 p.220–221 출처,
  What About You, Writing Template 및 320px 가로 Overflow·CTA를 확인
- 다음 increment였던 Chapter 12 Source 콘텐츠 적용을 진행함

### Chapter 12 Source rollout

- 상태: 구현·자동 검증·반응형 브라우저 검증 완료, commit·push 전
- main textbook pp.232–248과 Week 12 My Story / Real Conversations 노트를 Source로 확인
- Chapter 12 My Story 6 chunks, Conversation 8 turns, Exact 6, Source Variation 6,
  Grammar, What About You / Let’s Have a Talk 15 questions, Beginner Template 9개를 등록
- `npm run verify`: 31개 테스트 파일, 328개 테스트와 production build 통과
- PDF로 My Story, Grammar, Real Conversations, What About You, Beginner Template,
  Let’s Have a Talk 원문 페이지를 시각 대조
- Aside와 내장 브라우저에서 Library, My Story Read/Recall/Hint/Answer/평가 저장,
  8턴 Conversation, Grammar, What About You, Writing Template을 확인
- Chrome 320×740 viewport에서 문서 가로 Overflow가 없고 Back/Mark complete CTA가
  각각 46px/44px임을 확인. 실제 모바일 기기 검증으로 표현하지 않음
- 다음 increment: Pass 4+ Automatic 및 Mixed/Smart/All Random Review

### Chapter 5 Source rollout

- 상태: PR #20으로 main 반영 완료. merge commit `c91507d`
- main textbook pp.94–102, 104–105, 110–112와 Week 5 My Story / Real Conversations 노트를 Source로 확인
- Chapter 5 My Story 6 chunks, Conversation 9 turns, Exact 6, Source Variation 6,
  Grammar, What About You / Let’s Have a Talk 12 questions, Beginner Template 8개를 등록
- Chapter 5도 공통 Pass 1–3 엔진과 독립된 version 5 진행 기록을 사용
- `npm run verify`: 24개 테스트 파일, 301개 테스트와 production build 통과
- 브라우저에서 Library 진입, My Story 언어 전환, Conversation, Output Variation,
  Grammar, What About You, Writing, Review 빈 상태와 실제 문제 진입을 확인
- 390×844 Review/Output과 320×740 Writing에서 가로 Overflow 없음,
  주요 학습 CTA 44px 이상, console warning/error 없음
- 다음 increment였던 Chapter 6 Source 콘텐츠 적용을 진행함

### Chapter 4 Source rollout

- 상태: PR #19로 main 반영 완료. merge commit `15a8baf`
- main textbook pp.70–78, 80–81, 88–90과 Week 4 My Story / Real Conversations 노트를 Source로 확인
- Chapter 4 My Story 6 chunks, Conversation 10 turns, Exact 6, Source Variation 6,
  Grammar, What About You / Let’s Have a Talk 13 questions, Beginner Template 6개를 등록
- Chapter 4도 공통 Pass 1–3 엔진과 독립된 version 5 진행 기록을 사용
- `npm run verify`: 23개 테스트 파일, 298개 테스트와 production build 통과
- 숨김 브라우저에서 Library 진입, My Story 언어 전환, Conversation, Output Variation,
  Grammar, What About You, Writing, 실제 Chapter Review 문제 진입을 확인
- 390×844 My Story/Conversation/Output과 320×740 Writing에서 가로 Overflow 없음,
  주요 학습 CTA 44px 이상, console warning/error 없음
- 다음 increment였던 Chapter 5 Source 콘텐츠 적용을 진행함

### Foundation increment

- 상태: catalog 기반 UI 메타데이터는 main 반영 완료. 공통 학습 엔진 1차 구현·자동 검증·브라우저 smoke 확인 완료, Git 반영 전
- 메인 교재 목차를 Source로 Chapter 1–12 제목과 주요 섹션 시작 페이지 catalog 작성
- Chapter 3 화면의 Chapter 번호, 제목, Source 페이지 표시를 catalog에서 읽도록 변경
- 학습 문장이나 완료 정책은 변경하지 않아 Chapter 3 회귀 동작을 보존
- 진행 상태·Conversation·Output·Review·Writing 파서를 Chapter별 Source 묶음으로 초기화할 수 있게 분리
- Chapter 3은 기본 Source 묶음으로 유지하여 기존 호출과 version 1–4 기록을 그대로 보존
- 대체 Chapter Source 묶음으로 초기화·복원 격리·Recall 갱신을 자동 검사
- `npm run verify`: 19개 테스트 파일, 284개 테스트와 production build 통과
- 숨김 브라우저에서 기존 Chapter 3 Pass 1 Overview가 정상 렌더링됨을 확인
- 다음 increment: 저장 상태를 Chapter별로 분리하고 Chapter 선택/재개가 가능한 version 5 공통 shell 구현
- 그다음: 각 Chapter의 Source-locked 학습 데이터를 원본 PDF에서 검증하여 순차 적용

### Version 5 storage + Chapter Library increment

- 상태: 구현·자동 검증·브라우저 검증 완료, Git 반영 전
- 기존 version 1–4 Chapter 3 기록을 version 5의 Chapter별 container로 자동 이전
- Chapter별 진행 기록과 현재 Chapter를 분리 저장하며, 사용할 수 없는 Chapter 선택은 상태를 바꾸지 않음
- Chapter Library에 12개 목차를 표시하고 Source 묶음이 등록된 Chapter만 시작/재개 가능
- 현재는 Chapter 3만 활성화하며 다른 Chapter는 `Source setup in progress`로 명확히 표시
- `npm run verify`: 20개 테스트 파일, 288개 테스트와 production build 통과
- 숨김 브라우저에서 Library 열기, Chapter 3 재개, 390×844 가로 Overflow 없음과 44px CTA, 깨끗한 세션 console warning/error 없음 확인
- 다음 increment: 화면 컴포넌트에 선택 Chapter Source를 주입하고 Chapter 1 Source 데이터를 추가

### Chapter 1 Source rollout

- 상태: 구현·자동 검증·브라우저 검증 완료, Git 반영 전
- main textbook pp.6–7, 11–12, 16–17, 23–24와 Week 1 My Story / Real Conversations 노트에서 Source를 확인
- Chapter 1 My Story 6 chunks, Conversation 8 turns, Exact 6, Source Variation 6,
  Grammar, What About You 11 questions, Beginner Template 8개를 등록
- Chapter 1도 기존 공통 Pass 1–3 엔진과 독립된 version 5 진행 기록을 사용
- 모든 학습 화면이 선택 Chapter의 Source 묶음과 metadata를 읽도록 변경하고 Chapter 3 기본 동작을 보존
- `npm run verify`: 21개 테스트 파일, 292개 테스트와 production build 통과
- 숨김 브라우저에서 Chapter 1 선택, Read/Recall/Hint/Answer, Conversation, Output,
  Grammar, What About You, Writing Template, Chapter 3 전환을 확인
- 390×844 Writing 화면에서 가로 Overflow 없음, 하단 CTA 44px 이상, 깨끗한 최종 세션 console warning/error 없음
- 다음 increment: 같은 Source 검증 방식으로 Chapter 2 콘텐츠 적용

### Chapter 2 Source rollout

- 상태: 구현·자동 검증·브라우저 smoke 완료, Git 반영 전
- main textbook pp.28–29, 33–34, 36–37, 43–45와 Week 2 My Story / Real Conversations 노트를 Source로 확인
- Chapter 2 My Story 6 chunks, Conversation 9 turns, Exact 6, Source Variation 6,
  Grammar, What About You 11 questions, Beginner Template 6개를 등록
- Chapter 2도 공통 Pass 1–3 엔진과 독립된 version 5 진행 기록을 사용
- `npm run verify`: 22개 테스트 파일, 295개 테스트와 production build 통과
- 숨김 브라우저에서 Library 활성화, Chapter 2 Overview, My Story Read와 Grammar Source 렌더링을 확인
- 다음 increment: Chapter 4부터 같은 방식으로 Source 콘텐츠 순차 적용

## Active — Chapter 3 Pass 3 Complete (2026-10-02)

사용자가 빠른 전체 개발을 위해 Chapter 3 Pass 3을 한 번의 구현 단위로 완료하고,
그 다음 공통 엔진 일반화와 Chapter 1–12 적용으로 이어가는 방안을 승인했다.
Pass 4+는 삭제하지 않으며 전체 Chapter의 Pass 1–3 적용 직후 다음 단계로 진행한다.

- 상태: Pass 3 구현과 자동·브라우저 검증 완료, Git 반영 전
- 저장 형식: version 4. version 1–3 기록을 이전하며 Pass 1·2 snapshot을 보존
- 명시적 진입: 완료된 Pass 2에서만 `Start Pass 3` 가능
- 필수 완료 영역: My Story Full Recall, Real Conversations, Output No Hint,
  Grammar Focus, What About You?, Weekly Writing, Chapter Review
- Output No Hint는 이전 모드 평가와 별개로 No Hint 모드를 실제 끝까지 진행해야 완료
- Chapter Review는 Chapter 3 Source 기반 고정 12문항을 재사용한다. 전역 문제 수·간격 정책은 확정하지 않는다.
- 완료 방식: 7개 영역 완료 뒤 사용자가 `Finish Pass 3`를 눌러 완료 시각 저장
- Pronunciation은 별도 학습 영역이며 Pass 3 완료를 막지 않는다.
- 다음 개발: Chapter 데이터와 학습 엔진의 Chapter 3 결합을 분리한 뒤 Source가 확인된 Chapter 1–12에 적용

검증 결과:

- `npm test`: 17개 파일, 278개 테스트 통과
- TypeScript와 production build 통과
- 숨김 내장 브라우저에서 기존 Pass 2 완료 기록 → Pass 3 시작 → 7개 필수 영역 →
  `Finish Pass 3` → 새로고침 복원까지 실제 버튼으로 완료
- 390×844 Overview와 320×740 Writing에서 가로 Overflow 없음,
  주요 CTA 44px 이상, 모바일 ActionFooter 세로 배치 확인
- 콘솔 warning/error 없음

세부 결정과 수용 기준은 [pass3_complete_plan.md](./pass3_complete_plan.md)를 따른다.

## Proposed next increment — Chapter 3 Pass 2 Reinforce (2026-10-01)

Pass 1 실제 학습과 피드백 반영이 끝난 뒤, 사용자가 Chapter 3 Pass 2 설계 작업을 승인했다.
현재 설계안은 [pass2_reinforce_plan.md](./pass2_reinforce_plan.md)에 기록한다.

- 상태: Increment 1·2 main 반영 완료, Increment 3 구현·검증 완료(로컬 변경, commit·push 전)
- 현재 구현: Pass 2 시작부터 다섯 Core 항목 완료와 명시적 `Finish Pass 2`까지 연결
- Pass 2 완료 조건은 설계안의 권장 다섯 Core 항목으로 적용
- Chapter 4, 새 Source 콘텐츠, 자동 채점, Smart Review 정책 확정은 범위 밖

### Increment 1 구현 결과 — 2026-10-01

- localStorage 진행 형식을 version 3으로 확장하고 Pass 1 / Pass 2 기록을 분리했다.
- version 1·2 저장 기록을 version 3으로 이전하며 기존 Pass 1 진행과 Writing을 보존한다.
- 완료된 Pass 1에서만 사용자가 `Start Pass 2`를 눌러 명시적으로 진입한다.
- Pass 2 Overview는 My Story Full Recall을 기본 경로로 제공한다.
- Read와 Chunk Recall은 보조 경로로 유지한다.
- Increment 2 이후 영역은 `Coming later`로 비활성화하여 현재 범위를 넘지 않는다.
- `npm run verify`: safety 검사 통과, 16개 테스트 파일의 255개 테스트 통과, production build 통과.
- Aside 실제 흐름과 390×844 / 320×740 viewport에서 진입·완료·새로고침 복원·가로 Overflow 없음 확인.
- PR #9로 main에 merge했다. merge commit은 `d95f14c`다.

### Increment 2 구현 결과 — 2026-10-01

- Pass 2 Overview와 공통 Chapter navigation에서 Real Conversations와 Output Practice를 활성화했다.
- Pass 2 Conversation은 A 역할, B 역할, Full Dialogue를 별도 Pass 2 기록으로 저장한다.
- Pass 2 Output Practice는 Source에 검증된 Supplement Variation 6개를 기본 모드로 연다.
- Exact Recall과 No Hint는 선택형 보조 경로로 유지하며 Weekly Writing으로 미리 이동하지 않는다.
- Pass 1과 Pass 2의 Conversation·Output 평가가 서로 바뀌지 않고 새로고침 후 복원되는 것을 확인했다.
- Increment 3 영역인 Chapter Review, Weekly Writing, Pass 2 완료 상태는 계속 비활성화했다.
- `npm test`: 16개 테스트 파일의 257개 테스트 통과. TypeScript와 production build 통과.
- Aside에서 Overview → Conversation 평가·새로고침 → Variation 6개 완료 흐름을 확인했다.
- Headless Chrome 390×844 / 320×740에서 Overview, Conversation, Output Variation의 가로 Overflow 없음과 주요 CTA 44px 이상을 확인했다.

### Increment 3 구현 결과 — 2026-10-01

- Chapter Review는 Chapter 3 Source 항목만 사용한 고정형 12문항(Recall 6 + Output 6)으로 구성했다. 이는 이 Pilot 세트의 구성이고 전역 Review 문제 수·간격 정책을 확정하지 않는다.
- Pass 2 Weekly Writing은 Pass 1 글을 덮어쓰지 않는 새 회독 기록을 사용하며, Free Writing을 기본으로 Guided·Template 보조 경로를 유지한다.
- My Story Full Recall, A/B/Full Dialogue, Variation 6개, Chapter Review 1세트, 새 Writing 1개를 모두 마친 뒤에만 `Finish Pass 2`가 완료 시각을 저장한다.
- Grammar Focus, What About You, Pronunciation, Exact Recall, No Hint는 Pass 2 완료를 막지 않는다.
- 격리된 브라우저 세션에서 Pass 1 전체 완료부터 Pass 2 완료까지 실제 버튼으로 진행했고, 완료 전·후 새로고침 복원과 Pass 1 데이터 보존을 확인했다.
- 390×844 및 320×740에서 Overview, Review, Writing, 완료 요약을 확인했다. 320px Writing 하단 버튼 겹침을 발견해 공용 ActionFooter의 모바일 grid 우선순위를 수정하고 재검증했다.
- `npm run verify`: safety 검사, 16개 테스트 파일의 264개 테스트, TypeScript와 production build 통과.

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
