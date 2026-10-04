# Deployment readiness — 2026-10-04

This is a runbook, NOT deployment authorization. A hosted Seoul Supabase project is connected
to the local app; there is still no deployed production web URL.
The first-product goal includes real hosted login/sync and final deployed verification;
local tests alone do not complete that goal.

## Current verified connection

Approved project: `english-output-webapp-seoul` / `ihvmcxluaiyisncebtqk`, Free, Seoul.
Google identity and account progress storage were approved; student allowlist is deferred.
All three reviewed migrations were manually applied in one transaction without a CLI ledger entry.
Real local Google callback, server save/read, two-storage-origin sync, backup restore and 320px panels
passed. Full verify passed 411 tests/build. See verification.md for methods and remaining limits.
At preparation, no deployment or paid change was performed. User approved the seven-document
commit/push/PR/merge release; confirm its actual merged PR before deployment.

Remaining release sequence: finish approved Git publication; separately approve exact Vercel target,
audience and textbook asset exposure; configure exact HTTPS auth return URL; deploy; verify that URL,
second real user/devices and recovery. Existing Google login is not static textbook asset protection.
Do not introduce a student-approval feature without a new request. Community publication is a later
user decision, not implied by service connection. No automatic production/preview deployment permitted.
Original local records require explicit reviewed backup/import if needed; never silently overwrite them.

## Prepared locally

- Chapters 1–12 / Pass 1–4+ implementation and source provenance tests.
- Protected progress saving, backup preview/restore and previous-format recovery.
- Google PKCE, account-scoped local records, RLS, revision conflict handling and conditional reads.
- Ordered SQL migrations 001 progress, 001 conditional read, 002 bounded history (sort full filenames).
- Bounded history: latest 3 saves + first save from each of latest 7 active UTC dates, at most 10.
  Current progress is separate. Installation does not delete old history; future successful writes prune
  that account only. Downloaded backups/browser copies are untouched. This limits recovery depth.
- Default app stays local; account sync is opt-in configuration and per-user enablement.
- Local tests use isolated/synthetic records. The approved live connection test uploaded the signed-in
  account's current record, not its old anonymous namespace; no audio uploaded.

## Decisions that cannot be inferred

Items 1–2 below were approved for the named Free Seoul project and Google connection. They must not
be asked again unchanged. Audience/content exposure and final deployment still require the final gate.

1. External storage authorization: Google login identity (email/profile) and Supabase storage of
   progress, ratings, writing and personal answers. No recordings, Gmail or Drive access.
2. Exact Supabase account/project, Free plan availability and primary DB region. Recommend Seoul
   for predominantly Korean users, subject to actual availability. Region choice alone is not a
   guarantee that every provider subprocess/log stays in Korea.
3. Who may join and permission to distribute the textbook excerpts to them. The current client bundle
   contains textbook text; hiding UI behind Google sign-in does NOT protect static assets. Restricted
   distribution needs a separately approved server-enforced access design before hosting any bundle.
4. Final approval to deploy on Vercel. Existing Vercel use does not by itself authorize this deployment.

## Free-first constraints (official sources checked 2026-10-04)

- Supabase Free: 500 MB database, 50,000 monthly active users, 5 GB egress; free projects can pause
  after one week inactive and automatic backups are not included. Do not treat browser exports as
  a managed database disaster-recovery backup. https://supabase.com/pricing
- Seoul region is listed: https://supabase.com/docs/guides/platform/regions
- Vercel Hobby is restricted to non-commercial personal use. Charging nothing to learners is not,
  by itself, proof of eligibility. Reassess if commercial purpose, advertising or paid development applies.
  https://vercel.com/docs/limits/fair-use-guidelines
- No paid plan, billing upgrade or quota bypass without explicit approval. On quota failures preserve
  local progress and expose retry/backup, not silent loss. User count alone cannot guarantee free operation.
- Capacity illustration, NOT measured hosted capacity: a 12-chapter initial progress JSON is 15,422 bytes.
  200 users x 10 history copies plus current records is about 34 MB of raw JSON, before record growth,
  database indexes/overhead/compression and Auth data. Old unpruned accounts may exceed the bound until
  their next successful write. Real usage must be monitored after connection; maximum-sized records can
  exceed Free capacity even with bounded history.

## Execute only after the relevant approvals

1. Verify account/plan/project/region and participant-content permission. Stop on paid requirements.
2. Configure Supabase and Google provider in provider settings; never put OAuth secrets/service-role
   keys into Git, chat or VITE variables. Keep only publishable key and project URL in frontend config.
3. Apply SQL files in lexical order to the approved empty/test project first; inspect RLS/grants and
   use disposable accounts for cross-user denial, CAS conflicts, retry and retention tests.
4. Register exact callback URLs: Google -> Supabase /auth/v1/callback, Supabase -> approved app origin /.
   Do not use broad wildcard redirects. Disable unused sign-in methods; verify selected signup restrictions.
5. Test real Google authorization locally with a test account. User handles credentials/consent as needed.
   Sign-out, cancellation, expired session and second account must not expose another learner's records.
6. Only then seek final deployment approval. Validate content protection, audience and Vercel account plan;
   production and preview must obey the same access policy. Use npm ci, npm run build, dist output.
7. Verify exact deployed URL and auth redirects, record import -> study -> sync -> second isolated
   browser -> backup/restore -> reconnect, desktop/320px layout, offline/error recovery and user isolation.
   Browser simulations are not actual-phone or physical-microphone verification.
8. Record the actual deployment/DB migration versions and recovery steps. Roll back app deployment if
   needed without dropping progress tables. Pruned snapshots cannot be recreated by reverting code.

## Not a release gate for local development

GitHub Support #4819958 concerns old commit residuals, separate from product deployment readiness.
Home computers still need safe resynchronization with rewritten history, not a blind pull.
