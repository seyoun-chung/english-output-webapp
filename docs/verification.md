# Local verification

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

## Browser acceptance checklist

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
