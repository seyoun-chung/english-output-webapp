# Usage Data Foundation

## Status

- Implementation is on `codex/usage-data-foundation`.
- The hosted Seoul Supabase project received the usage-events migration once on 2026-10-05 after explicit approval and a preflight existence check.
- No GA4, Bitly API, Tableau, Looker Studio or other analytics SaaS is connected.
- The production client has not yet been deployed with event recording.

## Purpose

Keep a small append-only record of meaningful product use without changing the learning-progress
source of truth. The record supports later counts of users, starts, returns, completed chapters and
reviews. It does not prove English proficiency and must not be described that way.

Supabase remains the source for account learning and usage records. Future analytics tools may read
aggregated exports, but this schema does not depend on a particular dashboard vendor.

## Event definitions

| Event | Recorded when | Main dimensions |
| --- | --- | --- |
| `app_open` | A verified signed-in account opens the learning app in a browser session | anonymous analytics user, session, current chapter/pass |
| `learning_started` | The learner enters a study section from another app location | chapter, pass, section |
| `practice_rated` | The learner completes one self-rating in Story, Conversation, Output or Review | Source item ID, mode, hint level, self-rating |
| `section_completed` | A non-review section changes from incomplete to complete | chapter/pass/section |
| `review_completed` | A Chapter Review or Pass 4+ review set changes to complete | chapter/pass/mode |
| `chapter_completed` | A Chapter Pass gets its explicit completion timestamp | chapter/pass |

Opening hints, changing tabs and editing text are not logged as separate click events. A
`practice_rated` record contains the highest saved hint level for that evaluated Source item.
Review completion is separate from mastery: every question receiving a self-rating completes a set.

## Data boundary

Stored event fields are limited to:

- random `event_id` and per-tab `session_id`
- event and receipt timestamps
- event name, Chapter, Pass, section and practice mode
- stable Source item ID, hint level and self-rating where relevant
- app, content and event-schema versions

Not stored in usage events:

- email, Google profile name or photo
- writing/answer text
- recording audio or microphone data
- textbook sentence text
- OAuth tokens, Supabase keys or browser URLs

`analytics_profiles` privately maps `auth.uid()` to a separate random `analytics_user_id`.
`usage_events` contains only the analytics ID. Both tables deny direct `anon` and `authenticated`
table access. The authenticated RPC resolves the current user server-side and inserts only
whitelisted columns.

`analytics_profiles.is_test` is an operator-controlled flag. The browser cannot set it. Before
reporting real-user figures, known development/test accounts must be marked with privileged SQL and
excluded from aggregates. No admin UI is included in this increment.

## First-touch UTM

On the first page load in a browser tab, the app stores a bounded first-touch record with:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`

Missing values represent direct/unknown traffic. A later URL does not replace the first value. After
verified Google login, the server stores it only when creating that account's analytics profile; later
sessions update `last_seen_at` without replacing first touch. The pending browser value is removed only
after the server confirms a batch.

Recommended share URL before shortening with Bitly:

```text
https://english-output-webapp.vercel.app/?utm_source=bootcamp&utm_medium=community&utm_campaign=community_launch&utm_content=kakao_notice
```

Bitly clicks may include repeats, previews and automated requests. They are acquisition evidence, not
the number of signed-in learners or completed learning actions.

## Reliability and retention

- Event IDs make retries idempotent.
- Failed sends remain in an account-scoped browser queue and retry without blocking study.
- Batches contain at most 50 events; the local safety queue keeps the latest 500 unsent events.
- An analytics failure never blocks learning, progress sync or sign-out.
- Hosted retention for usage events is not yet decided. Do not invent or promise permanent retention.
- The existing bounded recovery-history policy applies only to progress recovery, not this event log.

## Versions

- Event schema: `1`
- App version: `0.1.0`
- Content version: `chapters-2026-10-05`

Version fields must change when event meaning or content identity changes enough to affect comparison.

## Later metrics

After excluding `is_test = true`, this foundation can support:

- registered profiles and accounts with a first `learning_started`
- weekly/monthly active analytics users
- users active in more than one calendar period
- unique and total Chapter/Pass/section/review completions
- unique Source items self-rated and distribution of ratings/hint use
- first-touch UTM → sign-in/app-open → learning start → completion cohorts

Use these as product usage, repetition and completion evidence. Do not convert self-rating movement
into a claim that English ability improved without a separately designed learning-outcome study.

## Hosted apply record and deployment gate

`202610050001_usage_events.sql` was applied once to the Seoul project after confirming the two tables
and RPC were absent. Do not run it again. Hosted checks confirmed both tables exist with RLS, direct
`authenticated` table reads are denied, and the authenticated role can execute the RPC.

Before deploying the client:

1. Commit, review and merge the verified client change.
2. Deploy the client that calls the RPC and run a production login/start/completion check.
3. Mark the resulting known test profile with privileged access before reporting real-user metrics.
4. Verify the stored event excludes writing text, email and audio fields and that a duplicate event ID is idempotent.
