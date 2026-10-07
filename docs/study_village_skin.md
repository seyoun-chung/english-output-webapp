# Study village skin — 2026-10-06

## Approved direction and current scope
Original apricot/cream hamster (tiny ears, cream forehead spot, two front teeth) and ivory rabbit (bent ear, peach cheek dots). Eye-level illustrated environment. References inform mood only; original game screenshots and characters are not shipped.
Current local implementation: Chapter Library, Chapters 1–12 and Pass 4+ use the shared walnut/olive/amber palette, parchment cards and lime buttons. Existing grid, source content, navigation and progress logic remain in use. Shared control colors target `.library-shell` and `.study-cafe`; all chapters now use `.study-cafe`. Cafe artwork fills the fixed background outside cards across all chapter screens; paper cards, headings and breadcrumb keep text readable. The existing Overview illustration remains.
Branch: `codex/study-village-skin`, based on remote main `651d918`. Pre-existing edits to current_task.md and verification.md were preserved. No commit, push or deployment authorized or executed.

## Verification
- [x] TypeScript and Vite production build passed after final CSS adjustment.
- [x] 50 test files / 433 tests passed with `npm test -- --maxWorkers=4 --testTimeout=15000`.
- [x] Desktop browser: original 12 cards, scoped palette, approved characters visible, no horizontal overflow.
- [x] 375px browser simulation: scroll width 360px, 44px chapter CTA, no horizontal overflow.
- [x] Chapter 1 entry, All chapters return and library restoration after reload; no browser console errors.
- [x] Aside connection attempted; unavailable locally. In-app browser used instead.
- [ ] Physical mobile device check not executed.
- [ ] Production release not executed.

## Next scope
### Mobile chapter selection
Latest refinement: chapter and learning-section selectors share one compact mobile menu; only one list expands and selecting a destination collapses it. 12 chapters remain available. Desktop cafe sidebar widened with balanced outer/gutter spacing; rounded encouragement card aligns with sidebar progress via ResizeObserver when viewport exceeds 900px. 1159px measurements and 690/375/320px interactions verified, 433 tests and final build passed. Build has a nonblocking >500kB chunk warning.

Mobile-only collapsible 12-chapter selector uses chapterCatalog and the existing selectChapter action. Three columns; active chapter highlighted; selection closes the list. Collapsed height 60px. Existing 01–07 navigation is labeled as the current chapter's learning sections. All twelve transitions and Chapter 12 reload restoration verified at 375px; 320px keyboard toggle/number overflow and 690px layout checked; 1194px desktop remains unchanged. Build and 433 tests passed. Physical phone testing not performed; no release.

### Full Chapter 1 palette follow-up — 2026-10-06
- [x] Shared Record buttons, recording/error state CSS, playback/delete, hints/answers/ratings receive warm palette.
- [x] Conversation mode selection, A/B bubbles, role prompt edge, partner cues and statistics themed.
- [x] Grammar/What About You/Weekly Writing cards, Free/Guided/Template modes, select and textarea themed.
- [x] Home/01–07 active icon olive; inactive icon oatmeal. Mobile substep selection also olive.
- [x] Desktop: all implemented section screens and main modes visited; computed color audit, Review empty/active/completed and progress screen inspected. Representative screenshots visually checked.
- [x] 375px: Home and 01–07 visited, no horizontal overflow; mobile substep leak fixed and rechecked.
- [x] 433 tests, final build and diff whitespace check passed.
- [ ] 08 Pronunciation independent screen remains unimplemented (existing Coming later item inspected).
- [ ] Physical device, actual microphone and recording-active execution not performed.
- Branch remains codex/study-village-skin with local uncommitted changes; remote main still 651d918. No push/deployment.

Classroom/park scenes and calendar-driven four-season switching are not implemented. Existing learning completion rules must stay unchanged. No release was performed.

## Chapter 1 cafe follow-up verification
- [x] Build and 433 tests passed; final CSS build also rerun.
- [x] Overview title adjusted after observed overlap with the hamster. Desktop scene shows both characters.
- [x] Read Korean and Both modes, entry to Chunk Recall, Hint 1/Hint 2 and Show answer tested in the browser. Answer remained hidden before explicit reveal; three self-rating controls appeared afterward.
- [x] 375px simulated mobile: no horizontal overflow; hint buttons 45px; Overview and back navigation inspected.
- [x] Library/cafe transitions: cafe class absent in library and Chapter 3. Chapter 3 kept its original blue primary button. Return to Chapter 1 and reload restored its screen; console errors empty.
- [ ] Recording, physical microphone and physical mobile testing not executed; recording logic unchanged.

Cafe asset: `public/skins/walnut-cafe.png`, generated with built-in imagegen from the approved original character reference. Final prompt:
Use case: stylized-concept. One original wide 16:9 cozy cafe illustration for a study web app. Attached image is exact character identity and flat illustrated art style reference, not a layout to reproduce. Exact apricot/cream hamster with tiny round ears, cream off-center forehead spot, two small front teeth, sage sleeveless sweater; exact ivory rabbit with one bent ear tip, peach cheek dots, terracotta cardigan and cream sage dress. They are at a table on RIGHT third, reading and writing quietly together. Eye-level front view into cafe, not overhead or isometric. Flat softly painted illustrated videogame graphic, simple economical shapes and shading, no photoreal fur, wood grain, fabric textures, no 3D movie render. Cozy dark walnut cafe counter and round tables, olive green chairs, parchment walls, brass amber lamps, mugs and a small cake display, green plants, tall window showing autumn ochre trees at dusk. Warm subdued scholar cafe atmosphere, rich walnut and moss green with bright readable friendly characters. Uncluttered left half for title overlay; characters heads and bodies on right in middle-upper portion, room feels inhabited. No text, no UI, no logos, no existing copyrighted characters.

## Artwork
### Native controls follow-up
Sidebar follow-up: cafe artwork extends behind the sidebar and mobile navigation. Sidebar container is transparent; heading/navigation/progress have 86% cream surfaces with a small backdrop blur. Selected olive icons and opaque study cards remain. Desktop Overview/Read and 375px navigation visually checked; no overflow, build passed. No release.

Playback enclosure/panel now use parchment; time labels use ink and range controls olive accent. Input accents, select options and backup file button also themed. Verified with 1-second silent audio in a local fixture importing production CSS: Chromium desktop and 375px mobile, loaded metadata, no overflow. Screenshot visually inspected. Final build passed; recording logic unchanged. Actual microphone, Firefox and Safari native control appearance not tested.

Built-in image generation; original approved illustration used as the edit reference. Shipped asset: `public/skins/walnut-library.png`.
Final prompt:
Edit this approved library illustration. Preserve the exact original hamster and rabbit identities, all their facial features, tiny hamster ears, apricot cream coloring, clothing, poses, eye-level camera, composition and soft flat illustrated art style. Change ONLY the room mood and palette to a cozy traditional scholarly library: DARK WALNUT brown bookshelves and desk, muted olive green chair upholstery, warm ivory walls and paper, deep green and burgundy book spines, a small brass amber desk lamp near the animals, warm subdued evening light. Autumn trees remain softly visible outside the windows with muted ochre leaves. Overall atmosphere inspired by a wood-paneled old library where animal friends quietly study together. Rich brown, moss green, parchment and warm amber, deeper cozy tone than original. Keep characters readable and bright enough, friendly, no gloomy horror. Keep image illustrated and simplified, NO photorealism, NO fur or real wood grain, NO 3D render. Left half stays uncluttered for web heading, both character faces visible upper right, no UI or text. Do not copy reference screenshots or any game characters.

## Latest — shared skin rollout
Chapter 2–12 now use the approved Chapter 1 skin and Overview placement. Pass 4+ reuses common recording, recall, hint, answer, rating and writing colors without changing learning logic. Its stats, setup/empty/summary panels, chapter selections, text input, disabled buttons and All chapters controls use the shared warm palette. The library background stays walnut-library.
Verification: all 12 chapters opened at 1196px with parchment panels and no horizontal overflow. Chapter 12 Read, Chunk/Full Recall, Conversation Read/A/B/Full, Output three modes, Grammar, About, Writing three modes, Review and Progress inspected for remaining blue computed colors; none remained after setting the progress element background. Pass 4+ home, Mixed setup, Smart session/answer/ratings, Multi-Chapter Writing empty state, All Random setup/session checked; 375px mobile had no overflow. Tests: 50 files / 433 passed; build and diff check passed. Completion and available multi-chapter writing states are covered by existing renderer/state tests and shared CSS, not a live browser session with newly created learning ratings. Real-device and deployment checks remain unexecuted.

## 2026-10-06 — 전체 스킨 검수 완료 (로컬 브라우저)

승인된 스킨 적용 범위의 검수를 끝냈다. 기존 학습 기록을 건드리지 않도록 별도 포트의 QA fixture와 메모리 Storage에 실제 App 및 콘텐츠·CSS를 로드했다. 테스트용 사용자 글만 입력했고 공식 학습 콘텐츠는 변경하지 않았다.

- [x] Chapter 1–12 × Pass 1–3: Overview, Read 언어 3종, Chunk Recall 첫/마지막, Full Recall 미완료/완료, Conversation Read 3종·A/B 첫/마지막/summary·Full, Output 3모드 첫/마지막/완료, Grammar, About, Writing 3모드 빈/작성/완료, Review 빈/첫/마지막/완료, Progress 미완료/준비/완료 상태를 렌더링했다.
- [x] 위 화면과 Library·Pass 4+ fixture 총 1,860개를 1196px 및 375px에서 확인했다(3,720회). 보이는 요소의 computed 색상에서 이전 청색 계열 잔존, 문서의 가로 넘침 및 카드의 우측 이탈은 발견되지 않았다. 이것은 브라우저 DOM/style 검사이며 모든 화면의 스크린샷을 각각 사람이 비교했다는 뜻은 아니다.
- [x] 모바일: 12챕터·3회독의 Recall/A/B/Output 3모드/Review 첫·마지막 시나리오 504개에서 Hint 1/2(제공되는 모드), 정답 공개 및 평가 버튼을 눌렀다. 마지막 대화 fixture는 이전 턴을 평가한 정상 선행 상태로 수정하고 72개를 재검증했다. 정상 순서에서 role summary와 저장 정상, 저장 경고 없음.
- [x] PC: 전체 12챕터의 위 7가지 학습 흐름 마지막 항목 84개에서 평가 저장·완료 이동 확인.
- [x] PC·모바일: 12챕터 Writing Free/Guided/Template 입력·완료 저장 총 72개 확인. Grammar/About/Full Recall/Full Dialogue/Pass 1 완료 동작 총 120개 확인. 완료 시 저장 경고 없음.
- [x] 12챕터의 작성/완료 기록을 같은 메모리 저장소에서 App 재마운트로 복원해 입력값 유지 확인. 실제 사용자의 브라우저 저장소는 변경하지 않았다.
- [x] Pass 4+ Mixed/Smart/All Random: 마지막 평가 → 완료 → 재시작을 PC·모바일에서 확인. Multi-Chapter Writing 입력·완료도 양쪽에서 확인.
- [x] PC·모바일 12챕터의 All chapters → Home 복귀와 10개 학습 화면의 Back to overview 총 44개 확인.
- [x] Chapter 11/Library/Pass 4+ 헤더를 10개 화면 폭에서 확인: PC 라벨 중앙 오차 1px 미만, 로고·버튼과 겹침/넘침 없음. 모바일은 로고 옆 일정 간격 왼쪽 정렬.
- [x] 생성된 무음 스트림을 사용해 녹음 중·정지·재생 UI 확인: 네이티브 audio panel은 rgb(255,248,232). 실제 마이크를 요청하지 않았다.
- [x] 자동 테스트 50파일/433개 통과. 최종 헤더 CSS 포함 빌드 통과. 기존 500kB 번들 경고 유지.
- [ ] 실제 휴대폰의 터치 감각·Safari 네이티브 컨트롤·실제 마이크/스피커: 미실행. viewport 및 합성 미디어 검사를 실제 기기 통과로 표현하지 않는다.

Ignored temporary QA files: tmp/skin-qa.html, tmp/skin-qa.tsx, tmp/skin-*-results.json. These are test-only and are not part of the shipped app. No Git commit/push/deployment was performed.
