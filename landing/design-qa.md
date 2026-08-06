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
- Buy Me a Coffee remains a labeled in-page control until a verified payment
  URL is supplied; it reports that the link is coming soon rather than sending
  visitors to an invented destination.

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
  window. The unavailable support control produces its expected toast.
- Selecting Insight deck pauses the automatic demo tour; Resume advances it to
  Behavior data.
- Fifteen automated build, asset, content, privacy, and Sites packaging tests
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
