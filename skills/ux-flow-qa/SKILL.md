---
name: ux-flow-qa
description: Verify cross-screen navigation, action hierarchy, and responsive learning flows after UX changes to this English Output web app.
---

# UX flow QA

Use for changes affecting navigation, page actions, learning-step controls, or required/optional status in this project. Read `AGENTS.md` and the current task first. This skill is a verification procedure, not permission to change product policy or Git state.

1. Inventory every screen using an affected shared component or label. Include first item, later item, and completion or empty states where relevant. Cover required and optional sections.
2. Define the intended footer hierarchy before editing: boxed Back to overview on the left and one clear next action on the right. With two actions, align them left/right; with three, left/center/right. Move a fourth action into the screen body or regroup it deliberately. On mobile, preserve the same reading order in a vertical stack. Use a left arrow only for Back to overview and a right arrow only for forward Next; local Read/Previous actions do not need arrow glyphs. Explain exceptions and remove duplicate paths to the same destination.
3. For sections with multiple modes, check the handoff after every mode, including optional early continuation to the next required section. Do not silently make all modes required. Shared self-rating controls must have consistent labels, icons, and storage behavior in My Story, Real Conversations, Output Practice, and Chapter Review.
4. Keep `Pass` (learning round) distinct from `Required` and `Optional` (section status). In the current Chapter 3 pilot, show the visible round count on Home; optional sections must not appear to block core completion.
5. After editing, run tests and build, then inspect the rendered app at desktop and narrow mobile widths. Visit each inventoried state and click the footer actions. Check alignment, overflow, touch size, keyboard focus, and destination. Markup or text assertions alone are not visual verification.
6. Do not delegate browser checks to the user before attempting them. Confirm the app is reachable and start the existing development server when needed. Prefer Aside for an extended QA session; if it is available but closed, first attempt to launch and connect it. If Aside is unavailable or fails, continue with computer use or the Codex built-in browser for every check those tools can perform.
7. Reproduce failures and inspect their cause. If the active request includes implementation or bug fixing, apply only in-scope fixes and rerun the failed scenario plus relevant regression checks. If the request is verification-only, do not modify files. Try another available automated route before classifying a check as user-only.
8. Report screen-by-screen results in separate checkbox groups: completed agent checks as `[x]`, unresolved failures as `[ ]` with attempted remediation, and genuinely manual checks as `[ ]` with short user steps. Omit empty groups and never mark an unexecuted check as passed. The manual group must contain only items that still require a real device, human perception, hardware, or a user-controlled permission/account decision.
9. Do not claim real-device layout, touch comfort, microphone, speaker, or OS/browser permission results from viewport simulation, mocked media, or desktop automation. Commit and push require the user's separate approval.
