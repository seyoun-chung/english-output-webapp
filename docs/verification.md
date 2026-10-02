# Local verification

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
