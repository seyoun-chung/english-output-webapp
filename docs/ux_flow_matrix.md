# Chapter 3 UX flow verification matrix

Use with `skills/ux-flow-qa/SKILL.md` after navigation, footer, mode, or self-check changes. This is a verification checklist, not a new completion policy.

## Footer contract

| Visible actions | Desktop placement | Mobile check |
| --- | --- | --- |
| One | Keep its semantic slot; `Back to overview` stays left | Full-width or comfortably tappable; no overflow |
| Two | One left, one right; no empty middle column | Preserve reading order and distinct destinations |
| Three | Left, center, right | Stack without clipping or overlapping |

`Back to overview` is always a boxed secondary action on the left. Use one primary forward action on the right. Local navigation such as `Read story`, `Read dialogue`, `Previous turn`, and `Previous chunk` has no backward arrow: only `Back to overview` uses `←`. `Next` uses `→`. A disabled `Previous` must not occupy the first-item footer.

## States to visit

| Screen | First/open state | Midway state | End/complete state |
| --- | --- | --- | --- |
| My Story Read | Reader toggles; start recall; back action | Switch Korean / English / Both | Enter Chunk Recall |
| Chunk Recall | First chunk: Read story, no Previous | Later chunk: Previous chunk | Sixth chunk and Full Recall entry |
| Full Recall | Before speaking; source hidden until requested | Reveal and self-check | Summary, review chunks, next section |
| Real Conversations | Read; first Play A/B turn uses Read dialogue | Later turns use Previous turn | Full Dialogue summary and next section |
| Output Practice | First item in each of Exact / Variation / No hint has no Previous | Later item has Previous; rating advances | Exact → Variation → No hint; early Weekly Writing remains possible after core Exact completion |
| Weekly Writing | Free / Guided / Template draft starts | Switch modes without losing drafts | Free → Guided → Template; Chapter Review remains available after core writing completion |
| Chapter Review | Empty/selection and first question | Later question has Previous | Session summary and chapter progress |
| Grammar / What About You? | Optional status, no duplicate Skip/Next destination | Follow available local actions | Back and forward actions align with the same footer rules |

The three self-check choices in My Story, Real Conversations, Output Practice, and Chapter Review must show the same ✓ / ≈ / ↻ icon-plus-label pattern. Icons are decorative (`aria-hidden`); labels remain accessible. Ratings must not appear before `Show answer`.

## Browser verification (not covered by markup tests)

At desktop (~1440 px), tablet (~768 px), and narrow mobile (~375 px):

- Open every state above; check button alignment, readable text, no horizontal scroll or clipped CTA, and visible keyboard focus.
- Click every displayed footer action and verify its destination and return path. On the first item, check that there is no useless `Previous`.
- Complete one Exact item set and one draft; confirm sequential modes are offered without making extra modes part of the four required Pass 1 sections.
- Reload after saving ratings/drafts and confirm progress remains. Switching modes must not erase another mode's data.
- Record pass/fail for each device and state. A unit test or build pass does **not** count as visual verification. Do not claim physical-phone microphone verification from a simulated mobile browser.
