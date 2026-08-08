# Landing page design QA

## Source visual truth

- Retro desktop composition, palette, linework, and bottom launcher:
  `/var/folders/rb/jdf2xk8s7zqg66tssdhwnzp00000gn/T/codex-clipboard-cc89f70d-120b-477e-a5f8-e35ff8169acb.png`
  (564 × 423 px).
- Canonical Coding Wrapped interface:
  `/Users/senlin/Documents/Discuss/coding-wrapped/docs/images/dashboard.png`
  (1536 × 1024 px).
- Latest explicit direction: `Coding Wrapped` → `Observe the way you build.`
  → concise value → two CTAs → divider and supported agents; a translucent
  four-item Dock; and a freestanding Scan/Wrap/Explore illustration.

## Implementation evidence

- Desktop Hero and Dock:
  `/Users/senlin/Documents/Discuss/coding-wrapped/landing/qa-hero-final-1440x900.png`
  (1440 × 900 CSS px, 1× density).
- Mobile Hero and Dock:
  `/Users/senlin/Documents/Discuss/coding-wrapped/landing/qa-hero-final-390x844.png`
  (390 × 844 CSS px, 1× density).
- Desktop How it works:
  `/Users/senlin/Documents/Discuss/coding-wrapped/landing/qa-how-it-works-final-1440x900.png`
  (1440 × 900 CSS px, 1× density).
- Mobile How it works:
  `/Users/senlin/Documents/Discuss/coding-wrapped/landing/qa-how-it-works-final-390x844.png`
  (390 × 844 CSS px, 1× density).
- Full-view source and implementation comparison:
  `/Users/senlin/Documents/Discuss/coding-wrapped/landing/qa-reference-comparison.png`
  (source normalized to 1200 × 900 beside the 1440 × 900 implementation).

The supplied desktop image is an art-direction target, not an exact marketing
layout. The comparison therefore normalizes height and checks the shared pixel
desktop language, palette, outlines, window treatment, and bottom Dock rhythm.
The How it works captures provide the focused-region evidence for the newly
generated three-step illustration.

## Findings

- No actionable P0, P1, or P2 issues remain.
- The side desktop shortcuts from the reference are intentionally omitted so
  the page has one clear product focus. The requested Dock stays visible.
- The About Sen tile links to Sen's verified LinkedIn profile, and the Support
  the project tile links to the supplied Buy Me a Coffee destination. Both open
  externally and retain the Dock's hover/focus labels.

## Required fidelity surfaces

- **Fonts and typography:** Plus Jakarta Sans is bundled locally and used
  consistently. The Hero now has a direct title, memorable slogan, two-line
  desktop value statement, CTA pair, and clearly separated compatibility row.
- **Spacing and layout rhythm:** desktop Hero ordering is visually explicit.
  CTAs use a 22 px gap, the divider spans 760 px, and the support row sits below
  it. The interactive Dashboard enters only at the first viewport edge. Mobile
  spacing preserves the same hierarchy without clipping.
- **Colors and visual tokens:** cyan sky, cream paper, misty green landscape,
  dark ink, yellow, and hard gray shadows map to the reference. Dock tiles use
  cream, black, orange, and yellow brand-led backgrounds. The Dock tray computes
  to `rgba(255, 250, 240, 0.64)` with `blur(18px) saturate(1.35)`.
- **Image quality and asset fidelity:** all Dock artwork, button arrows, and the
  three-step graphic are raster assets rather than CSS/SVG approximations. The
  How it works PNG has an alpha channel, no enclosing card, and resolves at
  1619 × 971 before responsive scaling. It stays crisp and uncropped at 621 px
  desktop and 329 px mobile widths.
- **Copy and content:** the Hero reads `Observe the way you build.` followed by
  `Turn local AI-coding history into revealing stories and practical next
  steps. One shot. Nothing leaves your machine.` The footer removes the retired
  scoring line and is reduced to the product name and open-source link.
- **Icons and controls:** the two Hero buttons reveal a real pixel-arrow image
  on hover/focus; arrow opacity changes from 0 to 1 and translation from -8 px
  to 0. Dock hover/focus lifts tiles and reveals labels.
- **Accessibility:** semantic links/buttons, accessible names, alt text for the
  explanatory image, visible focus states, and reduced-motion handling remain.

## Interaction and responsive checks

- Desktop at 1440 × 900: document width equals viewport width; hierarchy order
  and first-screen preview match the brief; Dock blur and translucency resolve.
- Tablet at 1024 × 768: no horizontal overflow and normal vertical scrolling.
- Mobile at 390 × 844: no horizontal overflow; Hero height is 850 px, support
  divider is 342 px, and the 247 px Dock fits with comfortable side margins.
- Hero button hover reveals its right arrow. Install Skill scrolls to the install
  window. About Sen and Support the project open their verified external links.
- Selecting Insight deck pauses the automatic demo tour; Resume advances it to
  Behavior data.
- Seventeen automated build, asset, content, privacy, and Sites packaging tests
  pass. `git diff --check` reports no whitespace errors.

## Comparison history

1. **Earlier P2 — Hero story hierarchy was out of order.** Compatibility sat
   above the CTA pair and the value copy was too long. Fixed by moving support
   below a divider and reducing the value to two sharp sentences.
2. **Earlier P2 — CTA feedback was weak.** Fixed by adding a pixel-arrow asset
   that slides in on hover and keyboard focus without shifting the layout.
3. **Earlier P2 — How it works reused the app icon as a placeholder.** Fixed
   with a purpose-built transparent pixel illustration that visualizes scanning
   local logs, wrapping safe aggregates, and exploring finished insights.
4. **Earlier P2 — Dock and footer felt heavy while scrolling.** Fixed with a
   translucent blurred-glass Dock tray and a footer reduced to 138.5 px desktop
   height with the redundant scoring sentence removed.
5. **Post-fix evidence:** `qa-reference-comparison.png`,
   `qa-hero-final-1440x900.png`, `qa-hero-final-390x844.png`, and both
   `qa-how-it-works-final-*` captures show the resolved hierarchy and responsive
   behavior.

## Latest responsive Hero revision

- Source visual truth:
  `/var/folders/rb/jdf2xk8s7zqg66tssdhwnzp00000gn/T/codex-clipboard-a732f784-4516-4399-ba68-ec6493793860.png`
  (1152 × 720 px).
- Browser-rendered implementation:
  `/Users/senlin/Documents/Discuss/coding-wrapped/landing/qa-hero-target-1152x720.jpg`
  (1152 × 720 CSS px, device density 1×).
- Full-view normalized comparison:
  `/Users/senlin/Documents/Discuss/coding-wrapped/landing/qa-reference-comparison-target.jpg`
  (reference and implementation aligned side by side at 1152 × 720). No
  separate focused crop was required because the title, CTA pair, compatibility
  row, and Dock are all readable in the full-view comparison.
- Earlier P2: whole-Hero translations kept moving the content without defining
  a stable relationship between the compatibility row and the fixed Dock. The
  result varied widely across laptop heights and could still look blocked.
- Fix: remove the short-height translation, bottom-anchor the Hero content to a
  168 px Dock safe area, and lift the compact Dock to 50 px from the viewport
  bottom. Short-height typography and internal gaps now reproduce the supplied
  composition instead of merely pushing the group upward.
- Post-fix evidence at 1152 × 720: title is 87.552 px; content top is 76.5 px;
  compatibility-row bottom is 552 px; Dock top is 597 px; clearance is 45 px;
  there is no horizontal overflow; normal vertical scrolling remains available.
- Adjacent-size evidence at 1280 × 720: title is capped at 92 px;
  compatibility-row bottom remains 552 px; Dock top remains 597 px; clearance
  remains 45 px with no horizontal overflow. At 1440 × 900, the title is 116 px,
  Dock clearance is 109.09 px, and the page remains vertically scrollable.
- Required fidelity surfaces: Plus Jakarta Sans hierarchy, the cyan/cream/green
  palette, static pixel landscape, real bitmap mascot and Dock assets, HTML
  copy, centered CTA labels, and concise value statement all match the visual
  target. The reference's gray canvas gutters are treated as screenshot framing,
  not page content.
- Primary interaction: Install Skill scrolls to the install section (145.41 px
  from the viewport top at 1280 × 720). Browser logs contain no errors. Seventeen
  automated build, content, privacy, responsive-contract, and Sites packaging
  tests pass, and `git diff --check` reports no whitespace errors.

## Final result

final result: passed

## Simplified Three Small Steps illustration — 2026-08-07

### Visual source and implementation

- Style and character references:
  `public/assets/illustrations/agent-orchestra-warm.webp` and
  `public/assets/illustrations/prompt-machine-pink.webp`.
- Superseded flow reference was removed from the production asset set.
- New project asset: `public/assets/how-it-works-flow-v2.webp` (1536 × 1024,
  3:2).
- Browser evidence:
  `audit/preview-ux/how-it-works-simplified-1280x900.png` and
  `audit/preview-ux/how-it-works-simplified-390x844.png`.

### Findings and fixes

1. **Earlier P1 — the flow illustration was denser than the Insight Deck.**
   The books, stacked papers, miniature dashboard, charts, decorative stars,
   and extra props are removed.
2. **Character continuity.** The new image reuses the dark-haired person in a
   white shirt and the cream robot with a black face and orange antenna from
   the Insight Deck visual language.
3. **Simpler narrative.** Scan, Wrap, and Explore are reduced to three readable
   moments connected by two small pixel arrows: hand over one log card, turn
   three colored blocks into one wrapped card, and inspect the result together.
4. **Pixel density.** Larger pixel clusters, simpler silhouettes, a limited
   warm palette, and generous negative space keep the image legible at the
   450 × 300 desktop slot and 329 × 220 mobile slot.

### Validation evidence

- Desktop 1280 × 900: the generated 3:2 image renders at 450 × 300 without
  cropping, panel overflow, or visible background seams.
- Mobile 390 × 844: the same asset renders at 329 × 220 with zero horizontal
  overflow and the three moments remain distinguishable.
- Browser console: zero warnings or errors during the desktop pass.
- Automated verification: 23 production build, content, privacy,
  interaction-contract, responsive-contract, and Sites packaging tests pass.
- `git diff --check` passes.

### Final result

final result: passed

## Pastel information-panel revision — 2026-08-07

### Source and implementation comparison

- User references:
  `/var/folders/rb/jdf2xk8s7zqg66tssdhwnzp00000gn/T/codex-clipboard-224c29e5-156e-4210-a759-bd667a72ad39.png`
  and
  `/var/folders/rb/jdf2xk8s7zqg66tssdhwnzp00000gn/T/codex-clipboard-c8c0b682-7b32-4020-818c-1cf3bb9a3caa.png`.
- Desktop browser evidence:
  `audit/preview-ux/soft-info-panels-1280x900.png` and
  `audit/preview-ux/soft-install-footer-1280x900.png`.
- Mobile browser evidence:
  `audit/preview-ux/soft-info-panels-390x844.png`.
- The two supplied references and all three browser captures were inspected in
  one combined comparison pass. The implementation keeps their pale paper
  surfaces, flat pastel accents, dark linework, and restrained hard shadows
  without copying the references' decorative desktop backgrounds.

### Findings and fixes

1. **Earlier P1 — both information panels felt too dark.** `Three small steps`
   and `One command` now share an opaque pale-cream surface (`#fbf7ed`) while
   retaining the existing outline, shadow, spacing, and illustration.
2. **Requested pink privacy accent.** The raw-conversation safety strip now
   uses a quiet blush (`#f4d7dc`) that is visibly distinct without overpowering
   the explanatory content.
3. **Requested blue install accent.** The command block and `Copy command`
   action use pale blue (`#cfe8e6`). `Read the docs` remains neutral cream with
   dark text, preserving a clear primary/secondary action hierarchy.
4. **Footer signature.** A small `Observe the way you build.` line now sits
   directly below `Coding Wrapped` in the compact footer.
5. **Visual QA correction.** The first browser pass revealed that the neutral
   `Read the docs` button inherited light text from its former dark treatment.
   Its text color was corrected to the dark ink token and rechecked visually.

### Validation evidence

- Desktop 1280 × 900: both panels are 1229 px wide, their main surfaces and
  accent strips render with the intended computed colors, and horizontal
  overflow is zero.
- Mobile 390 × 844: both panels resolve to 374 px, the privacy strip and command
  block remain readable, and horizontal overflow is zero.
- Browser console: zero warnings or errors during the desktop inspection.
- Automated verification: 23 production build, content, privacy,
  interaction-contract, responsive-contract, and Sites packaging tests pass.
- `git diff --check` passes.

### Final result

final result: passed

## Native demo restoration — 2026-08-07

This revision supersedes the earlier compact-tour presentation for the Landing
live demo.

### Reference alignment

- Insight reference: the native Dashboard deck with a large centered card,
  visible previous/next cards, HTML insight copy, three behavior columns, and a
  Light tip.
- Behavior reference: the native four-column pastel metric grid with eight
  selectable facts and the activity-dot matrix inside Active days.
- Information-section reference: the opaque `Give your coding history a plot`
  panel, including its solid outline and hard shadow.

### Implemented behavior

1. The Demo retains three direct tabs and automatic view rotation, but removes
   progress, pause, and next-tour controls. Manual interaction holds autoplay
   for twelve seconds.
2. Insight Deck now shows a true three-card album composition. Four numbered
   selectors, Prev/Next, arrow-key navigation, swipe, synchronized art/copy,
   `You did / Agent did / Your style`, and Light tip remain available.
3. Coding Overview contains one concise summary, three behavior patterns, safe
   source counts, and a local-aggregate privacy note.
4. Behavior Data retains the compact Customize popover, supports eight facts,
   automatically demonstrates 4/6/8 selections, and renders a responsive
   four-color grid. Active days includes a 30-day activity matrix.
5. The Dock is fully opaque. It collapses to one side tile only while the Demo
   intersects a desktop viewport; mobile keeps all four items centered.
6. How it works and Install share the same opaque warm panel, solid border, and
   hard shadow. Their vertical gap is 30 px.

### Validation evidence

- Desktop 1280 × 900: three Insight cards remain visible, all eight metric
  cards form two rows of four, and document width equals viewport width.
- Mobile 390 × 844: Insight art remains centered with side cards peeking in,
  copy stacks into one column, all four Dock items remain visible, and there is
  no horizontal overflow.
- Interaction checks: direct tabs, numbered insight buttons, Prev/Next, and all
  eight metric toggles update the HTML state. The Dock is opaque in compact and
  full states.
- Automated verification: 21 production build, content, privacy, interaction,
  responsive-contract, and Sites packaging tests pass.

### Final result

final result: passed

## Insight frame and swipe revision — 2026-08-07

### Source and implementation evidence

- Source visual truth:
  `/var/folders/rb/jdf2xk8s7zqg66tssdhwnzp00000gn/T/codex-clipboard-7e424cd2-ca5b-4942-a759-1049f122e4d1.png`
  (835 × 471 px, supplied screenshot density).
- Browser-rendered implementation:
  `/Users/senlin/Documents/Discuss/coding-wrapped/landing/audit/preview-ux/insight-swipe-fixed-viewport.png`
  (1280 × 900 CSS px at 1× density).
- Viewport and state: 1280 × 900, `Insight deck`, warm card 01 active.
- The source and implementation were opened together in one comparison input.
  The full viewport supplies composition context; the rendered main-card region
  is clearly readable, so no separately cropped comparison was required.

### Comparison history

1. **Earlier P1 — the main frame was wider than the 3:2 illustration.** The
   screenshot showed blank gutters inside a roughly 1.84:1 frame. The frame now
   uses the illustration's native 3:2 aspect ratio and a 610 px desktop cap.
2. **Earlier P1 — swipe had no response outside the old touch-only path.** The
   interaction now uses Pointer Events for touch and mouse drag, plus a guarded
   horizontal-wheel path for trackpads. `touch-action: pan-y` preserves normal
   vertical page scrolling.
3. **Post-fix evidence:** the measured frame is 609.99 × 406.66 px at exactly
   1.500:1. The image fills the framed region without the earlier side gutters.

### Required fidelity surfaces

- **Fonts and typography:** unchanged; HTML labels and the compact swipe hint
  retain the native Dashboard hierarchy.
- **Spacing and layout rhythm:** the centered frame now hugs the illustration,
  while previous and next cards remain visible behind it.
- **Colors and visual tokens:** unchanged warm paper, ink border, hard shadow,
  and theme backgrounds match the supplied state.
- **Image quality and asset fidelity:** the approved 768 × 512 WebP remains
  uncropped, pixelated, and rendered at its native 3:2 ratio.
- **Copy and content:** all Dashboard copy, selectors, Prev/Next controls, and
  swipe hint remain intact.

### Interaction checks

- Mouse drag changed insight 03 → 04.
- Horizontal trackpad scroll changed insight 02 → 03.
- `ArrowLeft` changed insight 01 → 04.
- A vertical gesture over the image stage moved page scroll from 1037.5 px to
  1404.5 px, confirming that vertical navigation remains available.
- Fresh-load browser console: zero warnings and zero errors.
- Desktop document width equals viewport width; no horizontal overflow.

### Final result

final result: passed

## Historical preview interaction revision — 2026-08-06 (superseded)

This section records the earlier compact-tour iteration. The 2026-08-07 Native
demo restoration above is the current contract and validation result.

### Source and implementation comparison

- UX source of truth: `audit/preview-ux/audit.md` plus the seven captured states
  in `audit/preview-ux/01-preview-default.png` through
  `audit/preview-ux/07-behavior-cards.png`.
- Implementation under test: `http://127.0.0.1:4175/#demo` at 1280 × 720 and
  390 × 844 CSS pixels.
- The old and new Overview states were compared at 1280 × 720. The new state
  removes the duplicate numbered tour, adds one explicit live-demo guide, and
  keeps the primary tabs visible above the content.
- Focused comparisons covered the Insight deck title/navigation region and the
  Behavior data metric grid because those were the two highest-risk interaction
  changes from the audit.

### Resolved findings

1. **Earlier P0 — three competing navigation systems.** The numbered 01–03
   coach is removed. The tabs now choose a view; a single `Tour X of 3` row
   explains progress and offers Pause/Resume plus Next view.
2. **Earlier P0 — insight controls appeared below the fold.** The 01–04
   selectors now sit beside `INSIGHT XX / 04`, remain visible with the title,
   and update the illustration and story together.
3. **Earlier P1 — the Preview looked like a screenshot.** The browser bar now
   says `LIVE DEMO`, the tour describes the current interaction, and the main
   action reads `USE MY OWN DATA`.
4. **Earlier P1 — weak input coverage.** Insight cards support clicking,
   `ArrowLeft` / `ArrowRight`, and touch swipes. Manual input pauses autoplay so
   the tour does not take control back from the visitor.
5. **Earlier P1 — Behavior data was static.** It opens with three core metrics
   and expands to all six in place. Cards have hover/focus feedback and a short
   relationship label.
6. **Earlier P1 — the fixed Dock obscured Preview content.** While the demo is
   in view the Dock collapses to one low-opacity tile at the lower-right edge;
   hover or keyboard focus expands it again.

### Validation evidence

- Desktop 1280 × 720: no horizontal overflow; the live guide, tabs, and primary
  action remain visible; the quiet Dock does not cover the insight copy.
- Mobile 390 × 844: document width equals viewport width; insight content
  stacks into one column and remains swipeable; the quiet Dock is reduced to a
  single tile.
- Keyboard test: focusing the Insight panel and pressing `ArrowRight` changed
  the active story from 01 to 02 and moved the active pager state accordingly.
- Data test: Behavior data rendered three metrics initially and six after
  choosing `CUSTOMIZE · SHOW ALL 6`.
- Browser console: zero warnings or errors during Overview, Insight deck, and
  Behavior data interaction.
- Automated verification: 18 build, content, privacy, interaction-contract,
  and Sites packaging tests pass. Vite production build succeeds.

### Final result

final result: passed

## Hero motion and vertical rhythm revision — 2026-08-06

### Source and implementation comparison

- User reference: `/var/folders/rb/jdf2xk8s7zqg66tssdhwnzp00000gn/T/codex-clipboard-e6417436-5860-4a02-a257-641b1d71f228.png`
  (1840 × 1160 px).
- Browser implementation: `qa-hero-motion-default-1840x1160.png` at the same
  1840 px width and matching first-screen state.
- Combined comparison input: `qa-hero-motion-comparison.png`. The left side is
  the supplied reference; the right side is the browser-rendered revision.
- Focused interaction state: `qa-hero-motion-mascot-hover-1840x1160.png`.

### Findings and fixes

1. **Earlier P2 — Hero content sat too low.** The main Hero group now moves up
   44 px on regular desktop sizes. Short laptop heights receive 26 px more
   bottom safe area, while mobile uses a smaller 12–22 px adjustment.
2. **Requested mascot feedback.** Hover scales the supplied bitmap mascot to
   1.14×, rotates it 7 degrees around its seated base, and adds a hard shadow.
   The bitmap stays crisp through `image-rendering: pixelated`.
3. **Static title retained.** The explored pixel-font title treatments were
   removed. `Coding Wrapped` remains a single HTML heading in Plus Jakarta Sans
   with no hover or automatic type animation.
4. **Reduced motion.** Motion-reduced environments keep only a restrained 1.08×
   mascot scale and collapse all animation durations.

### Validation evidence

- 1280 × 720: Hero content top is 43.13 px; the support row ends at 526 px;
  the Dock begins at 597 px; the live-demo window remains visible at the fold.
- 1440 × 900: Hero content top is 80.09 px and the support row ends at
  647.91 px, with no horizontal overflow.
- 390 × 844: document and viewport widths both equal 390 px; CTA, support row,
  Dock, and the top edge of the live demo remain visible.
- Hover inspection confirms the mascot transform and shadow. Source inspection
  confirms the title has no secondary font layer or title animation selector.
- Nineteen production-build, content, privacy, responsive-contract,
  interaction, and Sites packaging tests pass. Browser console contains no
  errors or warnings.

### Final result

final result: passed
