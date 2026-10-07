# Local verification

## Final PDF package — 2026-10-07

- [x] User-approved final PDF from the separate Word session copied without modification into
  `docs/submission/english-output-webapp-project-plan.pdf`; source and destination SHA256 match
  `35433a8be0e0b3671ebf540aec38fee8998bb63f087fcbf2e1512411711ba825` (189,049 bytes).
- [x] A4 two pages parsed and page renders inspected; no overlap/clipping, no textbook page images
  or attachments. Reviewed text/metadata show no personal email/local computer path or recognized
  credential patterns; regex checks are not a proof that all sensitive content is absent.
- [x] Safety exception is restricted to that exact PDF path and digest. Other PDFs, mutated PDF bytes,
  plain-text replacements, and a changed staged PDF masked by a clean working copy are rejected.
- [x] Full regression: 50 test files / 436 tests passed; TypeScript and production build passed.
  Existing large-chunk warning remains non-blocking. App learning/source/completion behavior unchanged.
- [x] README links the final PDF. Generated `output/`, Word drafts and render intermediates are
  excluded from Git and web deployment; final repository PDF is excluded from deployment by docs/PDF rules.
- Git staging/identity/publishable checks and PR state must also be checked when integrating this
  package. Step 10 final-main/history/privacy cleanup and separate public approval remain outstanding.


## Current release and submission preparation — 2026-10-07

- [x] Step 7 documentation-only update: seven Markdown files reviewed; `git diff --check`,
  `check:identity`, `check:safety` (159 text files) and `check:publishable` (100 reachable commits)
  passed on `codex/final-submission-preparation`. No app code changed; the 435-test/build evidence
  below is the earlier code run, not a rerun for these documentation edits. No staging/commit/push yet.
- [x] PR #46 merged into main `bb73204`; design commit `5e6b75c` and remote feature head match.
  Working tree was clean, `.githooks` enabled, effective identities approved noreply; stash/worktree preserved.
- [x] Latest full run: 50 test files / 435 tests, TypeScript and Vite production build passed.
  Staged safety and publishable identity history passed. Whole-local-ref history audit still identifies
  three historical identities in preserved recovery refs; this is not a clean-all-history result.
- [x] Vercel dry run excludes `.env`, original Source documents, docs/tests/scripts, tmp, recordings
  and local build output; deployed sources include approved skin images and app runtime files.
- [x] Approved production deployment `dpl_8cKo2wQZf1Dbfnsr9J5Lckk6w16G` is READY and aliased to
  <https://english-output-webapp.vercel.app/>. The live JS/CSS contain the new skin; both PNGs,
  `/privacy` and `/terms` return HTTP 200. This was a CLI deployment; Git auto-deploy was not enabled.
- [x] Hosted Google login in the previously approved test account restored existing Chapter 1 / Pass 1
  Chunk Recall. Hint 1, Hint 2, explicit answer reveal and rating controls appeared correctly.
  No self-rating or writing was fabricated for this real account.
- [x] Read navigation saved; reload and logout/relogin restored the Read screen. Sign-out completed
  without a save error. Chapter Library contained all 12 cards; Home returned to Chapter 1 Overview.
  Navigation position changed during verification; learner ratings/writing were not reset.
- [x] Hosted browser viewport checks: 375px study and 1196px library had no horizontal overflow.
  Skin present in DOM and visible in the screenshot. Browser error/warning log empty.
  Temporary viewport overrides reset. Aside connection failed; in-app browser fallback used.
- [x] Production bundle includes `G-238VVFM49R`. Privacy controls show saved refusal and the study
  page loads no Google Analytics script. The user's saved refusal was retained.
- [x] GA4 English Output property `557304673` report received initial data: South Korea 2 users,
  privacy-page 1 view and Direct/Unassigned sessions in last-seven-day cards. Real-time 0 at inspection.
  This confirms receipt, not community adoption or a fresh opt-in event from this deployment.
- [ ] Fresh opt-in/live learning-page receipt for this skin deployment: not executed; saved refusal
  retained. Prior hosted opt-in/opt-out execution is recorded in the 2026-10-05 section.
- [ ] Actual phone touch/readability and real microphone/speaker for this skin: not rerun. The
  2026-10-05 physical-device continuation remains a separate dated result. No microphone permission requested.
- [ ] New-batch hosted rating/writing/load or concurrent-device tests: not executed in this release;
  existing automated/previous hosted evidence is not relabeled as a new production run.
- [ ] Final PDF, public repository/history cleanup, assignment submission and community permission:
  not completed. User approval is required at their respective stages; see current_task's 12 steps.

## Consent-gated GA4 acquisition and page flow — 2026-10-05

- [x] Code boundary accepts only GA4 `G-...` IDs and builds controlled page-view payloads.
- [x] URL sanitization preserves only bounded UTM source/medium/campaign/content/term and removes
  OAuth codes, arbitrary query parameters and email-like query fields.
- [x] GA loading is consent-gated; refusal does not block the app. Google Signals and ad
  personalization signals are disabled in client configuration.
- [x] Privacy copy names Google Analytics, its limited purpose, excluded data and the user's choice.
- [x] `npm run verify` passed: identity, repository safety, 50 test files / 433 tests,
  client/server TypeScript and the production Vite build.
- [x] Browser check with a test-only Measurement ID found zero GA script tags before consent and
  after refusal, then one `googletagmanager.com` script only after permission. The policy page
  displayed the saved choice and both change controls.
- [x] The consent banner and privacy controls had no horizontal overflow at a 375px responsive
  viewport. This is browser-responsive evidence, not a physical phone test.
- [x] GA account `English Output`, property `English Output` and web stream `English Output Web`
  were created for `https://english-output-webapp.vercel.app`; Measurement ID is `G-238VVFM49R`.
- [x] The stream detail page confirms Enhanced Measurement is disabled.
- [x] `VITE_GA_MEASUREMENT_ID` is configured for Vercel Production and deployment
  `dpl_DwJMbCZkCZWS19c5HbiZ6QAjYDtf` is READY and aliased to the canonical app URL.
- [x] Hosted production check found zero GA scripts before consent and after refusal, then exactly one
  script for `G-238VVFM49R` after consent. The privacy page showed the saved opt-out state after the
  user choice was changed back to refusal.
- [x] Hosted privacy and consent UI had no horizontal overflow at a 375px responsive viewport. This is
  browser-responsive evidence, not a physical phone test.
- [x] PR #45 was merged into `main` as `651d918`; the STA Track checkout was fast-forwarded to that
  merge on 2026-10-06 without touching the preserved stash.
- [x] Initial GA report ingestion confirmed on 2026-10-07 in property `557304673`; see the current
  release section. Initial verification traffic is not community adoption. Real operator/community
  data begins after those users visit and opt in, rather than on a fixed calendar deadline.

## Usage data foundation — 2026-10-05

- [x] Pure tracking tests cover first-touch preservation, direct traffic, queued retry with a stable
  event ID, meaningful learning/rating/completion transitions and exclusion of writing text.
- [x] PGlite executes the new migration and verifies pseudonymous profile creation, first-touch
  immutability, duplicate-event idempotency, operator-only `is_test`, authenticated direct-table denial,
  account separation and malformed/anonymous rejection.
- [x] Supabase transport tests bind batches to a captured account access token and reject account changes.
- [x] Privacy-page regression covers UTM/usage disclosure, the approved statistics wording and explicit
  exclusion of writing text and recordings from analytics events.
- [x] Full regression: `npm run verify`, 49 test files / 429 tests, Git identity and repository safety,
  client/server TypeScript and production Vite build passed.
- [x] Local browser renders the revised privacy page with the approved wording and no console error.
  DevTools device metrics report document width equal to viewport width at 320px and 390px; this is
  responsive-browser evidence, not a physical phone test.
- [x] Hosted Seoul preflight found no existing usage tables/RPC; the approved migration was applied once.
  Both tables exist with RLS, direct authenticated reads are denied and authenticated RPC execution is allowed.
- [x] PR #43 was merged and Vercel production deployment `dpl_J4eNZa7BGNBwnJHRFyTU4gCAMHjV` reached
  `READY`; the public privacy page shows the approved disclosure.
- [x] A known test login created one `app_open` and one `learning_started` event. Its first-touch UTM was
  stored as `codex / verification / usage_foundation / production_check` and the profile is `is_test = true`.
- [x] Replaying an existing production event ID returned `accepted: 0`; the event count stayed at two.
  Hosted schema inspection found zero email, writing-text, answer-text, audio or recording columns.
- [x] No production analytics SaaS was added.

## Login-card center alignment — 2026-10-05

- [x] Rendered signed-out heading and shared-device reminder report `text-align: center` at desktop
  and 320×740 responsive widths.
- [x] Google CTA remains at least 44px high; legal links remain 12px/400 weight with 44px targets.
  The 320px view has no horizontal overflow and both centered lines wrap within the card.
- [ ] Merge and redeploy, repeat the live checks, then leave Google OAuth at the final publish gate.

## Legal-page display polish — 2026-10-05

- [x] Official Google OAuth policy checked: the public homepage/privacy disclosure and Cloud
  Console support contact remain; a visible email address in the policy body is not listed as a
  requirement.
- [x] Focused tests and production build pass. Rendered root links are 12px/400 weight with 44px
  interaction height; Privacy and Terms contain no `mailto:` link or Gmail address.
- [x] Desktop and 320×740 responsive browser checks found no horizontal overflow. This is a
  responsive browser check, not a physical mobile-device test.

## Public OAuth readiness — 2026-10-05

- [x] Vercel Deployment Protection changed to Standard; an unauthenticated request to the stable
  production URL returned 200 without a Vercel authentication redirect. Preview protection remains.
- [x] Google OAuth Data Access lists no sensitive or restricted scopes; source and regression tests
  limit sign-in to `openid email profile`.
- [x] Local root shows the requested Korean login copy, one factual app-description sentence and
  visible privacy/terms links. Google CTA and both links have at least 44px interaction height.
- [x] Direct `/privacy` and `/terms` navigation renders the correct document titles, semantic
  headings and contact link. Exact Vercel rewrites cover only these two routes.
- [x] Responsive browser checks at 375×812 and 320×740 found no horizontal overflow. The legal
  text uses a maximum 70-character line length and the 320px view keeps 44px navigation targets.
- [x] Keyboard order from the Google button reaches Privacy and then Terms.
- [ ] Production deploy, live-route/header recheck, Google OAuth production publication and a
  post-publication sign-in/continuation check remain in this approved workflow. Until OAuth is
  published, non-test Google accounts may be blocked by Google's Testing audience.

## Hamster favicon — 2026-10-05

- User approved the final design: lime background, v2 hamster geometry (small ears,
  wide cheeks, paired teeth) and v1 apricot/cream palette. `public/favicon.svg`
  is linked from `index.html`; learning content, progress and auth are unchanged.
- [x] `npm run verify`: 46 files / 416 tests, safety/identity, TypeScript and Vite build passed.
- [x] Local favicon response: 200 / `image/svg+xml`; production output contains the SVG.
- [x] In-app browser visual comparison at 16/24/32px with light/dark tab mockups;
  desktop and 375px signed-out page rendered without horizontal overflow.
- [x] User visually selected this candidate. Local screenshot: `tmp/favicon-hamster-mix.jpg`.
- [x] Publishable-ref identity check passed. Full history audit found three old commits
  in preserved recovery refs; these are historical, excluded from publishable refs,
  and have not been deleted. Effective author/committer use approved noreply identity.
- [x] Vercel upload dry-run excludes local gallery/screenshots, textbook PDFs,
  environment files, dependencies, docs and tests. Favicon is the only new web asset.
- [ ] Native Chrome tab/cache behavior and physical mobile icon: not verified;
  in-app tab mockups are not native Chrome evidence.
- User approved commit/push/PR/merge/protected production deployment. Release execution
  follows this pre-release record; actual production outcome is reported after deployment.

## Physical phone → hosted account → STA Track — 2026-10-05

- [x] Starting server state on the STA Track production browser was Pass 4+.
- [x] The user opened Chapter 12 from a physical phone with the same Google account.
- [x] A fresh production login on STA Track loaded `Chapter 12 · Pass 1 · Overview`, including
  the Chapter 12 title and navigation. This was a real server round trip, not viewport simulation.
- [x] STA Track returned the account to Pass 4+, signed out, then signed in again; the new session
  loaded Pass 4+ from the hosted record. The account was logged out after verification.
- [x] Only navigation position was used for the check. Ratings, writing and personal answers were
  not intentionally changed.

## Protected production and deployment security — 2026-10-05

- [x] Stable protected URL: `https://english-output-webapp.vercel.app/`. Unauthenticated
  requests redirect to Vercel authentication; project protection applies to all deployments.
- [x] Supabase Site URL and redirects use exact production/local URLs with no wildcard.
- [x] Production Google OAuth callback, logout/relogin continuation and existing account
  progress load passed in the hosted app.
- [x] Production → local and local → production navigation changes synchronized in both
  directions; the original Pass 4+ position was restored afterward. This used two origins in
  one browser profile, not two physical devices.
- [x] `npm audit --omit=dev` reported 0 vulnerabilities.
- [x] Vercel upload dry-run after `.vercelignore`: no PDFs, source documents, audio, logs,
  environment files, tests or repository work records in the upload set.
- [x] `tests/deploymentConfig.test.ts`: required four response-header values and required
  Vercel exclusions passed. `vercel build --prod` compiled the same headers into the route config.
- [x] Full regression: `npm run verify`, 46 files / 416 tests, client/server TypeScript,
  repository safety and production Vite build passed.
- [x] PR #35 merged as `c08ce27`; production deployment
  `dpl_FTogGnUWRwXNV6QXaXg5pRbFo5Wr` is Ready and the stable alias points to it.
- [x] Authenticated live response: `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy: camera=(), geolocation=(), microphone=(self)` and HSTS. An unauthenticated
  request still returns 302 to Vercel authentication.
- [x] Post-deployment browser check: fresh production Google login returned to the stable URL,
  restored the existing Pass 4+ position and logged out normally.
- [x] Physical phone and STA Track continuation passed; see the physical-device section above.

## Login spacing and plain-language review copy — 2026-10-04

- 구현: Google 버튼 아래 안내/피드백 16px 간격, Library 및 Pass 4+ 설명의
  `Source`/`Recall`/`Pattern` 내부 용어 제거. Hero, Smart Review, 준비/빈 상태,
  작문 카드 설명도 같은 쉬운 한국어 기준으로 통일.
- [x] `npm run verify` — 45개 테스트 파일, 414개 테스트와 production build 통과.
- [x] 로그인 화면 — 실제 렌더링에서 Google 버튼과 공용 기기 안내 사이 16px 확인.
  로그아웃 피드백에도 같은 전용 16px 규칙을 적용했다.
- [x] Chapter Library와 Pass 4+ — 변경 문구를 실제 브라우저에서 확인하고,
  375px viewport에서 문서 가로 Overflow 없음(375px viewport / 360px scroll width) 확인.
- [x] `AutomaticScreen.tsx`의 사용자 설명에서 `Source`, `Pattern`, `Hint` 용어 제거 확인.
  `Recall from memory`는 설명 문구가 아니라 학습 모드의 기존 영어 제목이므로 유지했다.
- 실제 모바일 기기 시험이 아닌 반응형 웹 검증이다.
- [x] 후속 문구 정리 — 정상 로그아웃 성공 문구를 표시하지 않도록 하고, Pass 4+
  소개에서 `새로운 문장은 나오지 않아요`를 삭제했다. Chapter Overview의 비활성
  Pronunciation 행에는 `듣고 따라 말하며 발음과 억양을 연습해요.`를 표시했다.
- [x] 후속 전체 회귀 — `npm run verify`, 45개 파일·414개 테스트와 production build 통과.
- [x] 실제 브라우저 Chapter 1 Overview에서 Pronunciation 설명과 `Coming later` 상태 확인.

## Account header cleanup — 2026-10-04

- 구현: 이메일 주소 비표시, 텍스트형 `로그아웃`, 44px 조작 영역과 포커스 표시 유지.
- [x] `npm run verify`: 45 files / 414 tests, identity/safety 및 build 통과.
- [x] 실제 로그인 상태의 1280px·375px 브라우저: 이메일 문자열 없음, `로그아웃`
  약 64×44px, border 없음, 투명 배경, 문서 가로 넘침 없음.
- [ ] 물리 모바일 기기의 실제 터치 감각은 미검증. 375px 결과는 반응형 브라우저 점검이다.

## Automatic account continuation — 2026-10-04

- [x] `npm run verify`: 45 files / 414 tests, identity/safety checks and client/server build passed.
- [x] Untouched new-browser account download and independent-edit conflict are covered by unit tests;
  existing records remain unchanged in conflict tests.
- [x] Local rendered signed-out page has the four requested Korean strings, one 44px Google CTA,
  and 375px document width with no horizontal overflow.
- [x] Local rendered signed-in overview hides normal Backup & restore / Account sync controls;
  375px viewport had no horizontal overflow. These were browser observations, not a physical phone.
- [ ] Actual sign-out then sign-in on a second device and cloud-resume position: not run; no
  user record was deliberately changed merely for this UI check. Production URL remains undeployed.

## Korean login screen — 2026-10-04

- [x] Follow-up minimal copy: 3 suites / 14 tests + client/server build passed. At 1280px and 320px,
  normal page has one Google button and no horizontal overflow; mobile button height 44px.
  Synthetic cancellation exposes error/retry only in failure state; retry rechecks account.
  Restored normal URL and reset viewport. Older two-button normal-page evidence below is superseded.
  First check tab stopped responding; fresh tab in the same browser completed visual checks.

- [x] Related Google login/account storage/sync/transport: 4 files / 20 tests passed.
- [x] Client/server TypeScript and Vite build passed.
- [x] Rendered login headings, helper text and both buttons are Korean.
- [x] 320x740: document scroll width 320; buttons x=36.8..283.2, both height 44px.
  Screenshot checked wrapping; desktop 1280px also has no horizontal overflow.
- [x] Login-state retry returns to signed-out page; Tab from Google button reaches retry.
- [x] Synthetic callback cancellation shows Korean retry message and removes error query from URL.
  No provider error details shown. Normal page restored and temporary viewport reset.
- Copy-only change: no storage/auth behavior or learning target change. Real Google consent,
  physical-device/microphone and full curriculum interaction were not repeated.

## Live Seoul connection — 2026-10-04

- [x] Four focused suites (`supabaseDatabase`, `supabaseTransport`, `accountSync`, `accountStorage`): 22 tests passed.
- [x] Dashboard: Google Enabled; public Auth settings endpoint independently returns Google enabled.
- [x] Site URL http://127.0.0.1:5173/; exact redirects for it and http://localhost:5173/, no wildcard.
- [x] Before application: both learning tables and read RPC absent. Applied all three reviewed SQL definitions
  in one explicit transaction; dashboard returned Success. No rows returned. No CLI migration ledger written.
- [x] Hosted catalog: both tables have RLS and one own-record policy; anon SELECT denied; authenticated direct
  INSERT/UPDATE/DELETE denied; authenticated read/write/conditional RPC grants present; retention trigger enabled.
- [x] Anonymous HTTP read RPC with publishable key returns 401. Saved-record count at schema audit: 0.
- [x] Ignored local configuration contains publishable key, not Google secret/admin key. Dev server starts on 5173.
- [x] Real app Continue with Google reaches Google account chooser for the correct Supabase project.
- [x] User completed real Google consent; PKCE callback and signed-in reload succeeded.
- [x] Enable sync returned Synced to your account; hosted SQL confirmed one version-6 record,
  revision 1/history 1. Navigation change and Sync now produced revision 2/history 2 with library view.
- [x] Independent localhost origin initially had no account session. Routine login to the same selected
  account and Enable sync offered first-connection choice; Use account copy downloaded library state.
  Localhost navigation then synced back to 127.0.0.1. Signing out of localhost left 127 signed in.
  These are distinct storage origins in one browser profile, not two actual devices/profiles.
- [x] Hosted transaction with authenticated role and a different synthetic JWT subject returned
  zero visible progress/history and empty normal/conditional reads. Rolled back; no test user created.
  Actual second-Google-user login/write isolation is not covered by this role simulation.
- [x] Backup download produced a 3,457-byte JSON file in Downloads (2026-10-04T13-09-39-648Z).
  Download-event waiter timed out, but filesystem metadata confirmed the actual saved file.
  Selected that file through the app: preview showed one chapter; Restore this backup succeeded and
  reported previous record kept as a recovery copy. Recovery-copy controls remained available.
- [x] Actual 320x740 viewport: signed-out login document width 320; connected overview/storage panels
  scroll width 305, no horizontal document overflow. Download backup / Sync now / Pause sync button
  bounds were x=16..288.8; screenshot checked text wrapping and file input. Viewport reset afterward.
  This is responsive simulation, not physical mobile verification. Hidden desktop navigation is not
  counted as visible-control overflow.
- [x] Full npm run verify: 45 files / 411 tests, client/server TypeScript/build, effective noreply identity
  and 140-file safety scan passed. No GitHub CI claim; no source/content/audio changes in this increment.
- [ ] Actual second-device use, second real Google account, hosted concurrency/load and deployed URL:
  not executed. Production URL/redirects and final deployment remain separately approval-gated.
- Original anonymous progress namespace is preserved and was not imported. The newly signed-in account's
  current record was uploaded only within the approved connection test. Download/recovery copies retained.
- Input issue caught during setup: accidental extra character on redirect URL removed and exact value rechecked.
  Monaco editor uses a partial textarea view: use Control+A/Backspace before replacing multi-line SQL and inspect
  query boundaries before Run. A stale-SQL warning was cancelled before execution; migration succeeded once only.

## Bounded history — local-only (2026-10-04)

- [x] Release recheck: 45 files / 411 tests, client/server build, identity and 140-file safety passed.
- [x] UTC day boundaries preserve daily anchors even with Asia/Seoul DB session timezone.
- [x] Authenticated users cannot invoke the internal retention trigger directly.
- [x] Full npm audit: 0 known advisories at check time, not a guarantee of no vulnerabilities.
- [x] Deployment preparation runbook completed; no hosted connection, real records or deployment used.

- [x] `npm run verify`: 45 files / 410 tests, client/server TypeScript, build, identity and 139-file safety passed.
- [x] PGlite applied all three migrations. Synthetic 1,000 saves over 10 UTC dates retain exactly
  7 daily first-save anchors plus latest 3 revisions; another user's legacy rows remain untouched.
- [x] Installing the retention migration leaves legacy rows intact. Transaction rollback restores pruning.
- [x] Current progress including writing remains exact; retry/stale-write behavior and RLS/direct-delete denial pass.
- [x] Diff whitespace check passed. No UI/content/audio change; existing browser evidence was not rerun.
- [ ] Hosted migration/deletion, concurrent hosted load and real 100–200-user storage capacity: not executed.
- Current record, browser recovery copies and downloaded files are outside this pruning policy.
  Daily anchors use UTC active dates, not a guarantee of every historical edit or an exact 7-calendar-day window.

## Predeployment release recheck — 2026-10-04

- [x] `npm run verify`: 44 files / 406 tests, client/server TypeScript, build and safety passed again.
- [x] Effective identity and 63 publishable commits pass; full-ref audit still detects the three
  preserved historical recovery commits. Recovery refs/bundles are not part of this feature push.
- [x] GitHub reports private repository, no open PRs, deployments, repository hooks or Actions workflows
  before release. Current Vercel account lists only two other projects; no deployment performed.
- [x] Prior isolated browser checks below remain evidence for unchanged features; not rerun for documentation-only release cleanup.
- [x] Support ticket #4819958 submitted and Open verified. Server cleanup is still pending, not completed.
- [ ] Hosted Google/Supabase, actual-device sync, content-access/retention policies and final deployment require approval/verification.
- Historical sections below describe their execution time, not the current release state.

## Executed identity history rewrite — 2026-10-04

- [x] Original local all-ref and remote all-ref bundles plus 137 worktree file copies preserved in ignored tmp.
- [x] Fresh mirror git-filter-repo 2.47.0: 63/63 trees, messages, names, timestamps and mapped parent topology identical;
  30 branch tips mapped correctly; personal author/committer email removed. GitHub signatures not retained by rewrite.
- [x] Atomic push with explicit old-SHA leases: all 30 remote branch SHAs verified after write, no branch deleted.
- [x] 27 local heads remapped with same-tree checks/CAS; 137 worktree SHA256 hashes unchanged; index untouched.
- [x] npm run verify: 44 files / 406 tests and full types/build/safety passed after rewrite.
- [x] Actual pre-push hook using --to-stdin: new main accepted, old-main source SHA rejected with exit 1.
  Direct stdin to git hook run without --to-stdin was insufficient to simulate a push; corrected invocation used.
- [ ] GitHub residual removal: old commit API still returns 200. Support #4819958 submitted; cleanup pending.
- [ ] Home clone resync pending. Recovery stash/internal refs/bundles intentionally retain old history locally.
- No deployment or new feature release; new main `16db1c7eaf484d19ae031dc138cd4b6f37fdcbe9` has identical files
  to old main. Guard and latest feature work remain local/uncommitted.

## Latest integrated check — 2026-10-04

- [x] `npm run verify`: 44 test files / 406 tests passed, client/server TypeScript and Vite production build passed.
- [x] Current identity and worktree safety checks passed (137 text files).
- [ ] Historical identity cleanup and remote release are still pending; passing local tests is not a completed deployment.

## Identity guard — 2026-10-04

- [x] `gitIdentity` + `repositorySafety`: 2 files / 28 tests passed. Effective author/committer
  overrides are rejected; a safe newest commit does not hide an unsafe ancestor; raw emails never printed by guard.
- [x] Current effective identities pass; `--history` rejects the 3 known initial commits among 65 local reachable commits
  (includes local refs beyond the previously audited 63 remote commits).
- [x] Existing active hooks/core.hooksPath absent before install; local core.hooksPath now `.githooks`.
  `git hook run pre-push` actually invokes guard and rejects known history; no remote push performed.
- [x] Repository safety: 137 files; diff whitespace check passed. No app/content changes in this fix.
- [ ] Remote history cleanup, home-computer hook activation, hosted/server enforcement: not performed.
- Local hooks require Node/Git, are not installed by clone alone, and can be bypassed by deliberate flags/config changes.
  They do not cover GitHub web/API-created commits or other computers. Manual release checks remain mandatory.

## GitHub privacy/security audit — 2026-10-04

Verdict: **Needs decision before Git release**. Requirements-evidence-audit and project-compass
were used to distinguish verified evidence from release assumptions. No history was rewritten.

| Criterion | Evidence / result | Status |
| --- | --- | --- |
| Repository access | Authenticated GitHub REST reports private | Complete |
| Current upload candidates | Existing repository safety check: 133 text files, no pattern findings; supplemental secret/path patterns reviewed | Complete within pattern scope |
| Existing GitHub history | Fetched origin refs; 63 commits and 319 distinct file blobs scanned, no recognized secret/file/path findings | Complete within reachable scope |
| Commit identity privacy | Three old commits contain a personal email in author/committer metadata: `6c863d8`, `86845bd`, `c5959ff`; current identity is noreply | Failed / decision pending |
| GitHub discussion text | 29 PR titles/bodies; issue endpoint repeats those 29 PRs; 0 issue comments, 0 inline review comments, 0 reviews, 0 releases. No pattern findings | Complete within returned scope |
| Deployment linkage | Current Vercel account lists two projects, neither linked to this repository | Complete for this account only |

- Automated scans report category/location only, never the matched secret or private email.
- History email candidate in repositorySafety tests is synthetic Git SSH/URL test data, not a personal email.
- Supplemental Supabase-secret match in accountStorage tests is a synthetic rejection fixture, not a live key.
- This is not a guarantee of no secrets or all personal information: arbitrary names, unknown secret formats,
  deleted/unreachable GitHub objects, attachments, Actions artifacts/logs, other accounts/integrations and
  hosted configuration were not exhaustively audited. GitHub username/author display names remain metadata.
- Staged snapshot audit, dependency-vulnerability audit and live hosted security tests were not run in this audit.
- Commit/push/PR/merge are held pending the historical-email decision. Existing local edits remain intact.
  No deployment, external learner-data upload, history rewrite, credential rotation or force push performed.


## Latest — Backup recovery and local sync (2026-10-03)

- [x] 최종 `npm run verify`: 38개 파일 / 380개 테스트, 클라이언트·서버 TypeScript,
  production build, repository safety 통과. `git diff --check` 통과.

- [x] Backup/migration 24, sync protocol/store 6, sync client 3 테스트.
- [x] Chapter 1–12 실제 reducer 이동·평가 상태 및 Pass 1–3 완료 fixture의 백업 왕복.
- [x] 격리 Chrome 1280px/320px: 파일 다운로드/취소/복원/재복구, 손상 JSON 거부,
  reload, Chapter·Library·Pass 4+ 백업 접근. 실제 사용자 storage 사용 안 함.
- [x] Chapter 1·2 × Pass 1–3: 어려운 문제 2→1→0, reload, 전체 재연습, 최초 평가 보존.
- [x] 같은 브라우저의 두 탭: 첫 탭 변경을 두 번째 탭이 덮어쓰지 않고 경고 표시.
- [x] 별도 시험 서버의 두 브라우저: 최초 연결 선택, 양쪽 편집 충돌, 양방향 선택,
  원격 수신 전 복구 사본, offline 후 재시도. 1280px/320px overflow 없음.
- [x] localhost API 필수 헤더·Origin 검사, 8MB 초과 거부. production preview는 sync JSON API 없음.
- [x] 동시 store 인스턴스 8개 중 1개만 저장, 7개 충돌, 이전 revision 보존.
- [ ] 운영 인증·타인 접근 차단·클라우드 DB·실제 집/STA Track 동기화: 서비스 미승인, 미실행.
- 실제 모바일·마이크 시험은 이번 변경에서 미실행. 녹음 코드는 수정하지 않음.

### Local sync test setup (not production)

일반 개발 서버에는 시험 UI/API가 없다. 별도 PowerShell 터미널에서:

```powershell
$env:VITE_LOCAL_SYNC_TEST='1'
$env:ENGLISH_OUTPUT_TEST_SYNC_DIR=Join-Path $env:TEMP ('english-output-sync-'+[guid]::NewGuid())
npm run dev -- --port 5174 --strictPort
```

http://127.0.0.1:5174 에서 별도 브라우저 프로필 두 개로 시험한다. 실제 기록 대신
시험 자료만 사용한다. `Local sync test` → `Connect local test sync`를 눌러야 저장한다.
수동 `Sync now` 방식이며 서로 다른 컴퓨터를 연결하지 않는다.
시험 폴더의 revision JSON은 이전 사본이며 개인 작문을 포함할 수 있다. Git에 추가하지 않는다.
종료는 Ctrl+C. 환경변수는 이 터미널에만 적용되므로 시험 뒤 터미널을 닫는다.
`npm run verify`는 클라이언트·서버 타입 검사, 단위 검사, 안전 검사, production build를 수행한다.

## Latest — Simple English review copy (2026-10-03)

- [x] 35개 테스트 파일 / 347개 테스트, TypeScript·production build·안전 검사 통과.
- [x] Pass 1–3 선택·빈 상태·완료 화면의 영어 안내와 단수형 자동 검사.
- [x] 격리 Chrome에서 Chapter 1·2 × Pass 1–3 어려운 문제 2 → 1 → 0,
  새로고침 복원, 전체 연습 재시작 검증. 사용자 저장 데이터는 수정하지 않음.
- [x] 1280px/320px 가로 넘침 없음 및 완료 화면 스크린샷 시각 확인.
- Aside 연결과 URL 실행 시도 실패로 격리 Chrome 자동 검증을 사용함.
- 실제 모바일 기기·마이크 검증은 이번 문구 수정에서 미실행.

## Latest — Chapter Review clearing (2026-10-02)

- [x] 34개 테스트 파일 / 344개 테스트, TypeScript·production build, repository safety 통과.
- [x] Chapter 1·2 각각 Pass 1·2·3: 어려운 항목 2 → 1 → 0, 중간 및 완료 새로고침,
  전체 다시 연습과 재평가 후 어려운 항목 재등록을 격리 Chrome에서 실제 클릭으로 검증.
- [x] 최초 학습 평가 보존, 다른 회독과 분리, 이전 fixed-set 평가 migration,
  추가 연습 중 완료 이력 유지 자동 검증.
- [x] Desktop 1280px·mobile viewport 320px 가로 넘침 없음 및 완료 화면 시각 확인.
- 마이크 코드는 변경하지 않았고 이번 Review 시험은 녹음을 수행하지 않았다.
- 실제 모바일 기기 시험이 아닌 반응형 웹 검증이다.

## Latest result — Pass 4+ Automatic (2026-10-02)

Codex 확인 완료:

- [x] version 5 → version 6 migration과 Pass 1–3 기록 보존 — 자동 테스트 통과
- [x] 자기평가한 Source 항목만 전역 Review 대상 — 자동 테스트와 브라우저 수량 확인
- [x] Mixed Chapters 두 Chapter 선택, Recall, 평가, 완료 — 내장 브라우저 실제 버튼 확인
- [x] Smart Review 우선순위와 평가 history 저장 — 자동 테스트 통과
- [x] All Random의 Hint·Chapter·Pattern·Source 단서 숨김 — 내장 브라우저 확인
- [x] Multi-Chapter Writing 완료와 새로고침 복원 — 내장 브라우저 확인
- [x] Desktop 기본 렌더링과 320×740 반응형 — 문서 너비 320px, 가로 Overflow 0,
  주요 CTA 44px 이상
- [x] Chapter 1–12 전체 완료 회귀 — 각 Chapter의 Pass 1 → Pass 2 → Pass 3 완료와
  Pass 4+ Mixed Review 진입을 단일 curriculum 테스트로 확인
- [x] 전체 회귀 — `npm run verify`, 33개 파일 339개 테스트와 production build 통과

관찰 사항:

- 기본 `favicon.ico` 요청의 404가 남아 있으나 학습 Flow와 무관하며 기존 동작과 같다.
- 실제 모바일 기기 터치감은 viewport 검증으로 표현하지 않는다. 이번 단위에는 실제 마이크
  검증이 필요한 새 녹음 기능 변경이 없다.

## Latest result — Chapter 12 Source rollout (2026-10-02)

- `npm run verify` 통과: repository safety check, 31개 테스트 파일 / 328개 테스트,
  TypeScript와 production build.
- Chapter 12 Source 묶음의 개수, provenance 파일, 독립 진행 초기화와 질문별 출처를 자동 검사했다.
- 메인 교재 My Story pp.232–233, Grammar pp.237–238, Real Conversations pp.240–241,
  What About You p.246, Beginner Template p.247, Let’s Have a Talk p.248을 PNG로 렌더링해 구현과 시각 대조했다.
- Aside와 내장 브라우저에서 Library → Chapter 12 → My Story Read/영문 전환/Recall/Hint/Answer/평가 저장,
  8턴 Conversation, Grammar, What About You와 Writing Template을 실제 버튼으로 확인했다.
- Chrome 320×740 viewport에서 문서 가로 Overflow가 없고 Back/Mark complete CTA가
  각각 46px/44px였다. 브라우저의 기본 `favicon.ico` 요청 외 앱 console 오류·경고는 없었다.
- 실제 모바일 기기의 터치감과 실제 마이크·스피커는 이번 검증에 포함하지 않았다.

## Latest result — Chapter 11 Source rollout (2026-10-02)

- `npm run verify` 통과: repository safety check, 30개 테스트 파일 / 324개 테스트,
  TypeScript와 production build.
- Chapter 11 Source 묶음의 개수, provenance 파일, 독립 진행 초기화, 질문별 출처와
  Real Conversations p.220–221 catalog 값을 자동 검사했다.
- 메인 교재 My Story pp.214–215, Grammar pp.218–219, Real Conversations pp.220–221,
  What About You p.226, Beginner Template p.227, Let’s Have a Talk p.228을 PNG로 렌더링해 구현과 시각 대조했다.
- 내장 브라우저에서 Library → Chapter 11 → My Story Recall/Hint/Answer,
  9턴 Conversation과 p.220–221 출처, What About You와 Writing Template을 실제 버튼으로 확인했다.
- 320px Writing Template에서 문서 가로 Overflow가 없고 Back/Mark complete CTA가
  각각 46px/44px였으며 브라우저 console warning/error는 없었다.
- 실제 모바일 기기의 터치감과 실제 마이크·스피커는 이번 검증에 포함하지 않았다.

## Latest result — Chapter 10 Source rollout (2026-10-02)

- `npm run verify` 통과: repository safety check, 29개 테스트 파일 / 320개 테스트,
  TypeScript와 production build.
- Chapter 10 Source 묶음의 개수, provenance 파일, 독립 진행 초기화와 질문별 출처 표시를 자동 검사했다.
- 메인 교재 My Story pp.196–197, Grammar pp.201–202, Real Conversations pp.204–205,
  What About You p.208, Beginner Template p.209, Let’s Have a Talk p.210을 PNG로 렌더링해 구현과 시각 대조했다.
- 내장 브라우저에서 Library → Chapter 10 → My Story Recall/Hint/Answer,
  8턴 Conversation, What About You와 Writing Template을 실제 버튼으로 확인했다.
- 320×740 Writing Template에서 문서 가로 Overflow가 없고 Back/Mark complete CTA가
  각각 46px/44px였으며 브라우저 console warning/error는 없었다.
- 실제 모바일 기기의 터치감과 실제 마이크·스피커는 이번 검증에 포함하지 않았다.

## Latest result — Chapter 9 Source rollout (2026-10-02)

- `npm run verify` 통과: repository safety check, 28개 테스트 파일 / 316개 테스트,
  TypeScript와 production build.
- Chapter 9 Source 묶음의 개수, provenance 파일, 독립 진행 초기화와 질문별 출처 표시를 자동 검사했다.
- 메인 교재 My Story pp.176–177, Grammar pp.181–182, Real Conversations pp.184–185,
  What About You p.189, Beginner Template p.190, Let’s Have a Talk p.191을 PNG로 렌더링해 구현과 시각 대조했다.
- 내장 브라우저에서 Library → Chapter 9 → My Story Read/Recall/Hint/Answer,
  11턴 Conversation, What About You와 Writing Template을 실제 버튼으로 확인했다.
- 320×740 Writing Template을 시각 확인했고 브라우저 console warning/error는 없었다.
- 실제 모바일 기기의 터치감과 실제 마이크·스피커는 이번 검증에 포함하지 않았다.

## Latest result — Chapter 8 Source rollout (2026-10-02)

- `npm run verify` 통과: repository safety check, 27개 테스트 파일 / 312개 테스트,
  TypeScript와 production build.
- Chapter 8 Source 묶음의 개수, provenance 파일, 독립 진행 초기화와 질문별 출처 표시를 자동 검사했다.
- 메인 교재 My Story pp.158–159와 Real Conversations pp.166–167을 PNG로 렌더링해 구현 문장과 시각 대조했다.
- 내장 브라우저에서 Library → Chapter 8 → Recall/Hint/Answer, 10턴 Conversation,
  Grammar, What About You와 Writing Template을 실제 버튼으로 확인했다.
- 좁은 내장 브라우저에서 Overview와 Writing Template의 반응형 배치를 시각 확인했다.
- 실제 모바일 기기의 터치감과 실제 마이크·스피커는 이번 검증에 포함하지 않았다.

## Latest result — Chapter 7 Source rollout (2026-10-02)

- `npm run verify` 통과: repository safety check, 26개 테스트 파일 / 308개 테스트,
  TypeScript와 production build.
- Chapter 7 Source 묶음의 개수, provenance 파일, 독립 진행 초기화와 질문별 출처 표시를 자동 검사했다.
- 메인 교재 My Story p.141과 Real Conversations p.149를 PNG로 렌더링해 구현 문장과 시각 대조했다.
- Aside에서 desktop 폭의 Chapter 7 Overview가 가로 Overflow 없이 렌더링되는 것을 확인했다.
- 내장 브라우저에서 Library → Chapter 7 → My Story Read/Recall/Hint/Answer/자기평가 저장,
  9턴 Conversation, Grammar, What About You와 Writing Template을 실제 버튼으로 확인했다.
- 좁은 내장 브라우저에서 Overview, My Story Read와 Writing Template의 반응형 배치를 시각 확인했다.
- 실제 모바일 기기의 터치감과 실제 마이크·스피커는 이번 검증에 포함하지 않았다.

## Latest result — Chapter 6 Source rollout (2026-10-02)

- `npm run verify` 통과: repository safety check, 25개 테스트 파일 / 304개 테스트,
  TypeScript와 production build.
- Chapter 6 Source 묶음의 개수, provenance 파일과 독립 진행 초기화를 자동 검사했다.
- 내장 브라우저에서 Library → Chapter 6 → My Story 영어 본문, 10턴 Conversation,
  Grammar와 Writing Template을 확인했다.
- Desktop 원문·대화·Grammar와 320×740 Writing에서 문서 가로 Overflow가 없었다.
  주요 학습 CTA는 44px 이상이었고 console warning/error는 없었다.
- 실제 모바일 기기의 터치감과 실제 마이크·스피커는 viewport simulation으로 증명하지 않았다.

## Latest result — Chapter 5 Source rollout (2026-10-02)

- `npm run verify` 통과: repository safety check, 24개 테스트 파일 / 301개 테스트,
  TypeScript와 production build.
- Chapter 5 Source 묶음의 개수, provenance 파일과 독립 진행 초기화를 자동 검사했다.
- 메인 교재 My Story p.95와 Real Conversations p.105를 PNG로 렌더링해 구현 문장과 시각 대조했다.
- 내장 브라우저에서 Library → Chapter 5 → My Story 한·영 전환, 9턴 Conversation,
  Output Variation, Grammar, What About You, Writing, Review 빈 상태와 실제 문제 진입을 확인했다.
- 390×844 Review/Output과 320×740 Writing에서 문서 가로 Overflow가 없었다.
  주요 학습 CTA는 44px 이상이었고 console warning/error는 없었다.
- 실제 모바일 기기의 터치감과 실제 마이크·스피커는 viewport simulation으로 증명하지 않았다.

## Latest result — Chapter 4 Source rollout (2026-10-02)

- `npm run verify` 통과: repository safety check, 23개 테스트 파일 / 298개 테스트,
  TypeScript와 production build.
- Chapter 4 Source 묶음의 개수, provenance 파일과 독립 진행 초기화를 자동 검사했다.
- 메인 교재 My Story p.71과 Real Conversations p.81을 PNG로 렌더링해 구현 문장과 시각 대조했다.
- 숨김 내장 브라우저에서 Library → Chapter 4 → My Story 한·영 전환, 10턴 Conversation,
  Output Variation, Grammar, What About You, Writing, 평가된 Source 항목의 Chapter Review 진입을 확인했다.
- 390×844 My Story/Conversation/Output과 320×740 Writing에서 문서 가로 Overflow가 없었다.
  주요 학습 CTA는 44px 이상이었고 console warning/error는 없었다.
- 실제 모바일 기기의 터치감과 실제 마이크·스피커는 viewport simulation으로 증명하지 않았다.

## Latest result — Chapter 2 Source rollout (2026-10-02)

- `npm run verify` 통과: repository safety check, 22개 테스트 파일 / 295개 테스트,
  TypeScript와 production build.
- Chapter 2 Source 묶음의 개수, provenance 파일과 독립 진행 초기화를 자동 검사했다.
- 숨김 내장 브라우저에서 Library의 Chapter 2 활성화, Overview, My Story Read의 6개 Source chunk와
  pp.28–29 provenance, Grammar의 `I do` / `I have done` Source와 pp.33–34 provenance를 확인했다.
- 깨끗한 최종 세션에서 console warning/error가 없었고, 390×844 Grammar 화면의 가로 Overflow가 없으며 Back CTA는 46px였다.

## Latest result — Chapter 1 Source rollout (2026-10-02)

- `npm run verify` 통과: repository safety check, 21개 테스트 파일 / 292개 테스트,
  TypeScript와 production build.
- Chapter 1 Source 묶음의 개수, provenance 파일, Chapter 1 전용 진행 초기화와 Chapter 3 기록 보존을 자동 검사했다.
- 숨김 내장 브라우저에서 Library → Chapter 1 → My Story Read/Recall/Hint/Answer,
  Real Conversations, Output Exact, Grammar, What About You, Writing Template을 실제 버튼으로 확인했다.
- 390×844 Writing에서 문서 가로 Overflow가 없고 Back/Mark complete CTA가 각각 46px/44px였다.
- 새 숨김 브라우저 세션에서 Chapter 1 문서 제목과 화면 복원이 정상이며 console warning/error가 없었다.
- Library에서 Chapter 3로 전환했을 때 기존 `Personality Traits` Overview와 문서 제목이 복원됐다.

## Latest result — Version 5 storage and Chapter Library (2026-10-02)

- `npm run verify` 통과: repository safety check, 20개 테스트 파일 / 288개 테스트,
  TypeScript와 production build.
- version 1–4 Chapter 3 기록의 version 5 이전, Chapter별 action 분리,
  사용할 수 없는 Chapter 선택 차단과 Library 전환을 자동 검사했다.
- 숨김 내장 브라우저에서 12개 Chapter 카드, Chapter 3만 활성화된 상태, Chapter 3 재개를 확인했다.
- 390×844 viewport에서 문서 가로 Overflow가 없고 활성 CTA 높이는 44px였다.
  Chapter 3로 재개한 화면도 가로 Overflow가 없고 `All chapters` 버튼은 52.8px 높이였다.
- 깨끗한 새 브라우저 세션의 console warning/error는 없었다.

## Latest result — Common learning engine boundary (2026-10-02)

- `npm run verify` 통과: repository safety check, 19개 테스트 파일 / 284개 테스트,
  TypeScript와 production build.
- 대체 Chapter Source 묶음으로 Chunk·Conversation·Writing 초기값이 구성되고,
  다른 Chapter의 저장 기록을 가져오지 않으며 Recall 갱신이 해당 Chapter ID에만 적용됨을 자동 검사했다.
- 기존 호출은 Chapter 3을 기본값으로 유지해 version 1–4 migration과 기존 281개 회귀 검사가 모두 통과했다.
- 숨김 내장 브라우저에서 Chapter 3 Pass 1 Overview, 기존 섹션 목록과 진행 표시가 정상 렌더링됐다.

## Latest result — Common Chapter metadata foundation (2026-10-02)

- `npm run verify` 통과: repository safety check, 18개 테스트 파일 / 281개 테스트,
  TypeScript와 production build.
- main textbook 목차의 Chapter 1–12 제목과 섹션 페이지가 빠짐없이 catalog에 있고
  ID·주차·제목이 중복되지 않는 것을 자동 검사했다.
- Chapter 3 UI의 제목·번호·Source 페이지가 catalog를 사용하면서 기존 표시와 학습 흐름을
  바꾸지 않는 것을 기존 전체 회귀 테스트와 숨김 브라우저 smoke로 확인했다.

## Latest result — Chapter 3 Pass 3 Complete (2026-10-02)

- `npm run verify` 통과: repository safety check, 17개 테스트 파일 / 278개 테스트,
  TypeScript와 production build.
- version 1–3 → version 4 migration, Pass 1·2 보존, 명시적 Pass 3 진입,
  7개 필수 영역 완료 조건과 새로고침 복원을 자동 테스트로 확인했다.
- No Hint 완료는 같은 Source ID의 이전 Exact 평가만으로 충족되지 않고,
  No Hint 모드를 실제로 끝까지 진행한 기록을 요구한다.
- 숨김 내장 브라우저에서 보존된 Pass 2 완료 기록으로 Pass 3을 시작해 Full Recall,
  A/B/Full Dialogue, No Hint 12문항, Grammar, What About You, 새 Writing,
  Review 12문항, `Finish Pass 3`을 실제 버튼으로 완료했다.
- 완료 후 새로고침에서도 `Chapter 3 · Pass 3 complete`와 7/7 상태가 복원됐다.
- 390×844 Overview와 320×740 Writing에서 문서 `scrollWidth`와 `clientWidth`가 같았고,
  주요 CTA는 44px 이상이었다. 320px ActionFooter는 Back/Next가 겹치지 않고 세로로 배치됐다.
- 브라우저 콘솔 warning/error는 없었다.
- 실제 모바일 기기의 터치감은 viewport simulation으로 증명하지 않았다.

## Latest result — Pass 2 Increment 3 (2026-10-01)

- `npm run verify` 통과: repository safety check, 16 test files / 264 tests, TypeScript와 production build.
- 고정형 Chapter Review가 Source 기반 12문항(Recall 6 + Output 6)이고, Pass 2 완료가 승인된 다섯 Core 항목을 모두 요구하는 것을 자동 테스트로 확인했다.
- Pass 1/Pass 2 Writing·평가·완료 상태 분리, version 3 복원, 완료 전·후 새로고침 복원, Pass 1 snapshot 보존을 확인했다.
- 격리된 내장 브라우저 세션에서 Pass 1 완료 → 명시적 Pass 2 시작 → Full Recall → A/B/Full Dialogue → Variation 6 → Review 12 → 새 Writing → `Finish Pass 2`를 실제 버튼으로 실행했다.
- 390×844 및 320×740에서 Overview, Review 완료, Writing, Pass 2 완료 요약을 시각 점검했다. 320×740의 문서 `scrollWidth`와 `clientWidth`가 같아 가로 Overflow가 없었다.
- 320px Writing에서 발견한 하단 Back/Next 겹침을 수정한 뒤 두 버튼이 세로로 분리되고 다음 CTA가 접근 가능한 것을 재확인했다.
- 실제 이어폰 환경에서 External Microphone의 Windows 음소거 해제 후 입력 표시, 녹음, 목소리 재생, 삭제를 사용자가 확인했다. 권한 요청 타임아웃 회귀 테스트를 포함한 최신 전체 자동 검증은 265개 테스트와 production build를 통과했다.
- 실제 모바일 기기 터치감과 이번 변경과 무관한 마이크 권한·녹음·재생은 viewport simulation으로 증명하지 않았다.

## Previous result — Pass 2 Increment 2 (2026-10-01)

- `npm test` 통과: 16 test files / 257 tests. TypeScript와 production build 통과.
- Pass 2에서 Real Conversations와 Output Practice만 추가로 열리고 Increment 3 화면은 차단되는 것을 자동 테스트로 확인.
- Pass 2 Conversation 평가와 Variation 평가가 Pass 1 기록을 변경하지 않으며 새로고침 후 복원되는 것을 확인.
- Aside에서 Pass 2 Overview → Real Conversations → 평가 → 새로고침 → Output Variation → 6개 완료 흐름을 실행했다. Variation 완료 후 Weekly Writing으로 이동하지 않고 Exact Recall / No Hint 보조 경로만 제공한다.
- Headless Chrome 390×844에서 Overview와 Real Conversations, 320×740에서 Output Variation을 확인했다. 문서 가로 Overflow는 모두 0이고 주요 CTA는 44px 이상이었다.
- QA 중 만든 Pass 2 브라우저 기록은 제거했고 기존 Pass 1 완료 기록이 유지됨을 확인했다.
- 실제 모바일 기기 터치감과 마이크 권한·녹음·재생은 viewport emulation으로 증명하지 않았다.

## Previous result — Pass 2 Increment 1 (2026-10-01)

- `npm run verify` 통과: repository safety check, 16 test files / 255 tests, TypeScript와 production build.
- version 1·2 → version 3 migration, Pass 1 보존, Pass 2 분리 저장, 새로고침 복원을 자동 테스트로 확인.
- Aside에서 실제 Pass 1 완료 → Pass 2 시작 → Full Recall 완료 → 새로고침 → Pass 1 복귀 흐름을 확인.
- Headless Chrome 390×844와 320×740에서 Pass 2 Overview와 Full Recall을 확인. 두 viewport 모두 문서 너비와 viewport 너비가 같아 가로 Overflow가 없었고 주요 버튼 높이는 44px 이상이었다.
- 실제 모바일 기기 터치감과 마이크 권한·녹음·재생은 viewport emulation으로 증명하지 않았으며 사용자 실제 기기 확인 항목으로 남긴다.

Run from the project directory after installing the existing dependencies:

```sh
npm run verify
```

This runs the read-only repository safety check, unit tests, then the TypeScript/production build. It adds no service, dependency, background process, credentials, or Git hook. Build output is ignored. It does not commit, push, merge, or grant microphone permission.

## Before an approved commit or push

1. Inspect the current branch, remotes, changed files, and existing staged files. Preserve unrelated user work.
2. Run `npm run verify` and inspect the diff. Stage only the explicitly approved files, never all files by habit.
3. Run `npm run check:safety -- --staged`. This checks **every file in the staged index**, including previously tracked files, against the exact staged blob content. Review `git diff --cached --check`, the actual staged diff, and author/committer email separately.
4. Confirm the approved branch and destination before each commit/push. Recheck after any change to staged content. Verify remote/HEAD equality after an approved push.

The default scanner checks tracked worktree files plus nonignored untracked files. Ignored files that are already tracked are still checked. It refuses risky filenames (including every `.env` variant, even `.env.example`), course PDFs, audio, generated directories, logs, private-key formats, symlinks, and binary files that need manual review. Nothing is deleted or staged automatically. If a legitimate binary asset is needed, review it explicitly and make a narrow, documented policy change; do not silently suppress findings.

Text pattern checks cover common token/key formats, literal secret assignments, authorization values, credential-bearing URLs, and personal computer paths. Reports contain only filename, line number, and category, never the matching secret. Required ignore rules and fetch/push remote URL credentials are checked. Staged mode also refuses an unstaged ignore-policy difference because Git ignore probes use the worktree policy. Credential stores are never opened.

**Limitations:** pattern checks are not a security audit or a guarantee. They cannot find every secret, encoded value, arbitrary personal information, Git history leak, or binary payload; harmless examples can trigger a finding. Git configuration/global ignore policies can affect ignore probes. Human review of the staged diff, destination, identity, and permissions remains mandatory. Authentication configuration is not modified. If a real credential is found, stop upload, avoid copying it into chat, and request user action to revoke/rotate it when necessary.

## 2026-10-04 Google login local verification

- [x] `npm run verify`: 43 test files / 405 tests, client/server type checks, build and repository pattern checks passed.
- [x] Unit checks: Google-only basic scopes, fixed return URL, foreign authorize URL rejection, callback code removal, cancellation, generic errors and successful exchange.
- [x] Isolated Chromium mock-provider test: SDK PKCE challenge/verifier, keyboard login, expired and orphan code recovery, cancellation, callback URL cleanup, verified-user display, two account isolation, two-browser sync, offline retry, signout and reload.
- [x] Login screens inspected at 1280/320 widths; no horizontal overflow. No real Google/Supabase calls, emails or user browser records used.
- [ ] Real OAuth consent, hosted provider configuration and actual device/cloud sync remain unexecuted. Real connection, privacy/region/tester scope and final deployment need approval. Local mode on port 5173 remains unchanged; fake-provider server is test-only and stopped after QA.

## 2026-10-04 Conditional sync reads and free-first beta

- [x] `npm run verify`: 42 files / 402 tests; repository pattern safety check, client/server type checks and build passed.
- [x] Exact second SQL migration tested locally: empty records, unchanged revisions, changed revisions, account isolation, invalid revision and anonymous access denial.
- [x] Client tests cover private cache copies, malformed unchanged markers and existing account-switch protections.
- [x] 200 synthetic accounts in local PGlite: one saved record per account, own-record isolation and conditional read. Summed unchanged JSON response bytes were less than 10% of full responses (asserted). This excludes HTTP/Auth/compression, does not measure monthly usage, and is not a concurrent hosted load test.
- [x] `scripts/account-browser-qa.cjs` rerun with mocked conditional RPC at 1280/320 widths: account switching, two-browser sync, offline retry and reload passed; no real provider calls.
- [ ] Actual Vercel project/plan, hosted Supabase migrations/Auth, 200-user concurrency and real devices: unverified. Current login is still email OTP; Google login needs user decision. History is not pruned, so long-term free storage capacity remains unproven.

Aside launch/connection was attempted but its daemon was unavailable. Isolated bundled Playwright Chromium was used instead; no user browser records were touched. No deployment, paid service or Git mutation performed.

## 2026-10-03 Supabase local implementation verification

This section supersedes older statements that no account implementation exists. Default development still uses local-only storage; the Supabase implementation is opt-in and has not been connected to a real project or deployed.

- [x] `npm run verify`: 42 test files, 397 tests passed; client/server TypeScript checks, production build and repository safety check passed.
- [x] Exact SQL migration tested in isolated PGlite PostgreSQL: authenticated user separation, anonymous denial, direct write denial, revision conflict, idempotent retry and retained history (3 tests). This is not hosted Supabase JWT or concurrent physical-connection verification.
- [x] Storage/configuration/canonical comparison (3 tests), captured-session transport and late account-switch responses (4 tests), provider-neutral server boundary (7 tests). The latter is not mounted in the direct Supabase SDK integration.
- [x] `scripts/account-browser-qa.cjs`: isolated Chromium contexts at 1280px and 320px; failed/successful OTP, account separation, explicit initial copy choice, two-browser automatic sync, offline retry, reload and remembered sync preference. All HTTPS intercepted; no real provider calls or emails. No page errors or horizontal overflow. Desktop and mobile screenshots visually inspected.
- [x] Existing isolated browser regression checks: backup preview/cancel/restore/recovery/corrupt-original preservation, Chapter 1–2 Pass 1–3 review clearing and restart, stale-tab overwrite prevention.
- [ ] Real Supabase project, JWT/RLS integration, production SMTP/email delivery, deployment and real-device checks: not executed; external connection requires separate approval. No real learning data or recordings uploaded.

To reproduce the mocked account browser check, run a separate local Vite process with `VITE_ACCOUNT_SYNC_ENABLED=1`, `VITE_SUPABASE_URL=https://example.supabase.co`, `VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_localtest` and `npm run dev -- --port 5174 --strictPort`. Run `node scripts/account-browser-qa.cjs` with Playwright available to Node (the bundled runtime can provide `NODE_PATH`). Do not manually use this fake configuration in an ordinary browser: the test script supplies the interception. Stop the test server afterward. No real `.env` or credentials are required.

Remaining release decisions: actual service plan/region, email sender, signup/tester policy, data/history retention and shared-device guidance. A login screen alone does not protect downloadable textbook JavaScript assets; deployment/content access must be reviewed separately.

## Browser acceptance checklist

### Microphone preflight

녹음 검증과 무음 진단마다 아래 순서로 확인한다. 재연결·입력 장치 변경 뒤에는
다시 확인하며, 이전 세션에서 통과했다는 이유로 생략하지 않는다.

1. 사용하려는 내장/이어폰/USB/Bluetooth 마이크를 구분하고 현재 연결 여부를 확인한다.
2. Windows 기본 입력 장치(일반·통신), 해당 장치의 음소거, 입력 볼륨을 실제로 조회한다.
   장치 인식 `OK`는 음소거 해제나 정상 신호의 증거가 아니다.
3. 브라우저 사이트 권한과 실제 캡처 장치 이름을 확인한다. 앱은 현재 기본 입력을
   요청하므로 Windows 기본값만으로 브라우저가 같은 장치를 쓴다고 단정하지 않는다.
4. 사용자가 요청한 녹음 시험에서 입력 신호, 새 녹음 생성, 재생을 확인한다.
   파일 크기·재생 시간만으로 목소리가 들어 있다고 판단하지 않는다.
5. 코드/API 모의 검증과 실제 기기 결과를 구분한다. 실제 목소리 청취가 필요하면
   자동 확인을 마친 뒤 사용자에게 새 녹음의 목소리가 들리는지만 확인받는다.
6. 사용자가 의도적으로 음소거했을 수 있으므로 상태 확인은 읽기 전용으로 한다.
   녹음 복구 요청 범위에서 해제했다면 변경 전후 상태를 기록한다. 자동 상시 해제는 하지 않는다.
7. 같은 문제가 재발하면 연결 시점·기본 입력 변경·음소거 전후 상태를 비교한다.
   음소거가 켜진 사실과 그것을 다시 켠 프로그램/드라이버에 대한 추정은 분리한다.

An agent can verify the following with the available browser tools and report actual results. User microphone access is a separate opt-in manual check, not a prerequisite for studying.

- Desktop and narrow mobile layouts: no horizontal overflow, readable dialogue, reachable actions, keyboard focus and button labels.
- Existing My Story flow: Read, Chunk Recall, Full Recall, hints, answer reveal, self-check, weak-chunk practice, refresh/resume.
- Real Conversations: read language views, A and B role selection, correct source partner prompt, target English hidden until reveal, source-only hints, ratings, previous/next and role switching, Full Dialogue, refresh/resume.
- Confirm that a role/turn change closes temporary hints and answers, and disposes any recording. Section completion must not claim the whole chapter/pass is complete.
- User-only real microphone check: allow/deny/cancel permission, record/stop/play/delete/retry, navigate away or hide the tab, and confirm the microphone stops. Mocked recorder tests do not prove device/browser playback.

No STT, automatic grading, audio upload, cloud progress sync, account, or analytics is introduced. Progress remains local to the browser; audio stays temporary in memory unless the user explicitly downloads it with browser controls.

### Browser verification order

Do not hand the whole acceptance list to the user before attempting it. Use this order:

1. Run the applicable automated checks, normally `npm run verify` after a code change.
2. Confirm that the local app is reachable. Start the existing development command when browser verification is in scope and no server is running.
3. Prefer Aside for an extended browser QA session. If Aside is installed or available but closed, attempt to launch and connect it before declaring it unavailable.
4. If Aside cannot be launched, connected, or used for a particular check, continue with computer use or the Codex built-in browser. A tool failure is not by itself a user-only test.
5. Inspect the relevant flow at desktop and narrow mobile viewport sizes. Exercise controls and state transitions instead of relying only on source or text assertions.
6. Reproduce each failure and identify the observed condition. When the active request authorizes fixes, make only in-scope fixes and rerun the failed check plus relevant regression checks. For a verification-only request, do not edit files; report the failure and evidence.
7. Retry with another available automated method where useful. Leave only checks that genuinely require the user's device, senses, account decision, or hardware interaction.

Do not claim a real-device result from viewport emulation. Do not claim real microphone, speaker, touch comfort, one-handed reach, or OS/browser permission behavior from mocked media devices or desktop automation.

### Result format

Report what the agent completed and what remains as separate checkbox groups. Keep the evidence concise and use the actual observed result.

```text
Codex 확인 완료
- [x] 항목 — 확인 방법과 실제 결과

미해결 또는 실패
- [ ] 항목 — 관찰된 문제, 시도한 조치, 남은 이유

사용자 실제 기기 확인 필요
- [ ] 항목 — 사용자가 수행할 짧은 동작과 기대 결과
```

Omit empty groups. Never mark an unexecuted check as passed. The user checklist must contain only the checks that remain after available automated inspection and permitted remediation have been exhausted.

## Small parallel-work agreement

Use one task worktree only when isolation is useful. Assign disjoint file ownership before agents edit (for example: source/UI, progress/tests, verification scripts). Shared interfaces and file changes must be communicated; do not overwrite another agent's work. The integrating agent reviews all diffs, runs the single verification command, and checks the actual browser flow. Extra orchestration frameworks, services, and agent infrastructure are unnecessary for this feature.
