# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable landing-page decisions

- Match the supplied retro Mac editorial references: pale cyan, cream and misty green; dark hand-inked outlines; hard offset shadows; restrained paper texture.
- The page has one memorable idea: a desktop world that opens a working Coding Wrapped demo window.
- Use Plus Jakarta Sans for the public English landing page and retain Noto Sans SC for future Chinese localization.
- Show only Codex and Claude Code in the Hero. Keep their unmodified official color marks small and inline with the “Now works with” sentence; hover or keyboard focus reveals the supported label. Do not add large standalone agent cards or metal treatments.
- The Hero hierarchy is: standalone reading-robot mascot, product title, the slogan “Observe the way you build” without a period, one short value statement, two CTAs, then a divider and inline agent support. Render the complete slogan in the locally bundled Pixelify Sans pixel font; keep it static and inherit the surrounding ink color. Do not show a local-first eyebrow above the title. Give these groups generous vertical spacing. Do not wrap the mascot in a frame or add desktop shortcut icons or an “Open the program” cue.
- Keep Hero CTA labels geometrically centered at rest. The hover arrow is an absolutely positioned feedback layer with equal left and right padding, so revealing it never shifts the label.
- Keep a four-item pixel Dock fixed near the bottom edge: Coding Wrapped, GitHub, About Sen, and Support the project. About Sen links to Sen's LinkedIn profile; Support the project links to Buy Me a Coffee. Use brand-led tile colors: Coding Wrapped cream, GitHub black with a white Octocat, Sen orange, and Buy Me a Coffee yellow. Preserve one coherent pixel density, rounded tile outline, hard shadow, hover lift, readable labels, and a lightly translucent blurred-glass tray.
- The Hero story should frame the product as a one-shot, local transformation of coding history into an engaging account of how someone works with AI, including unnoticed patterns and practical next steps. Keep privacy as supporting evidence, not the main story.
- Keep the Hero mascot playful without turning it into navigation: it may rotate and enlarge on hover. Keep the `Coding Wrapped` heading static in Plus Jakarta Sans; do not add hover or automatic font-switching effects to the title.
- Let only a narrow edge of the native HTML Dashboard enter the first viewport. Its visual system must track the canonical Coding Wrapped dashboard rather than behaving like an unrelated marketing mock.
- Keep interaction guidance inside the Dashboard. The integrated coach automatically cycles through Overview, Insight deck, and Behavior data, exposes direct view buttons, and can be paused. Do not add a separate “Three views” marketing section below it.
- Keep Cuelume interaction sounds clearly audible but restrained. Use one global volume around `0.4` so CTA, link, and Dock feedback feels consistent rather than assigning louder per-control overrides.
- Keep the Dashboard preview easy to discover as a live demo. Use the top view tabs as the only direct view navigation; rotate the three views automatically, pause briefly after direct user input, and do not add progress, pause, or next-tour chrome.
- Reproduce the native Insight Deck: one large centered pixel-art card with the previous and next cards visible behind it, then HTML-rendered headline, summary, `You did / Agent did / Your style`, and Light tip. Keep all four insight selectors plus Prev/Next visible, and support keyboard arrows and horizontal swipe.
- Give Coding Overview its own illustration instead of reusing any of the four Insight Deck images. The scene should directly visualize the summary behavior with the same coarse pixel density and recurring human/robot character design; for the current correction-led overview, use one human making a small control adjustment and one robot moving through a compact feedback loop.
- Keep the centered Insight Deck frame at the illustration's native 3:2 aspect ratio so the border hugs the image without blank side gutters. Horizontal navigation must work with touch swipe, mouse drag, trackpad horizontal scroll, and keyboard arrows while preserving vertical page scrolling.
- Behavior data keeps its compact Customize popover, supports eight selectable safe aggregates, and renders selected facts as a responsive four-color metric grid. Active days keeps its GitHub-style activity dots inside its card.
- Keep the fixed Dock fully expanded whenever the page is still. On desktop, move it into the smaller fully opaque side state only while the page is actively scrolling, then restore the complete Dock shortly after scrolling stops. On mobile, keep all four Dock items visible and centered even during scrolling.
- Continue from the demo into How it works and Install without a separate white section mask. Give both sections the same opaque pale-cream panel, solid outline, and hard shadow; do not use translucent or dashed containers. Use pale pink for the privacy strip and pale blue for the install command and Copy command accent, following the supplied retro-Mac pastel references.
- The How it works illustration must directly visualize Scan, Wrap, and Explore as one connected pixel-art flow. It sits freely without its own framed card and must not reuse the standalone app icon as a generic placeholder.
- Keep the How it works illustration at the same coarse pixel density and character design as the Insight Deck: reuse the dark-haired person in a white shirt and the cream robot, limit the scene to three simple readable moments, and avoid dense props or miniature UI details.
- Preserve the complete native 3:2 How it works illustration inside its balanced half-width column. Use `object-fit: contain` and natural height; never crop it with a panoramic aspect ratio, `cover`, or an oversized fixed/minimum height.
- Keep How it works and Install at the same maximum width as the Dashboard.
- Keep the demo synthetic and privacy-safe. Never include real user aggregates, transcripts, code, project names, local paths or secrets.
- Render copy and controls as HTML. Reuse only approved Coding Wrapped pixel illustrations as bitmap story assets.
- Keep the public page static and backend-free. External destinations live in `src/content.js`.
- Keep the compact footer to `Coding Wrapped`, the small line `Observe the way you build` with the complete slogan in the same pixel-font treatment, and the open-source link.
- At short desktop heights, compress the Hero vertically and keep the “Now works with” row visibly clear of the fixed Dock. Do not apply that compact desktop treatment to mobile.
- On short desktop viewports, bottom-anchor the Hero content to a Dock safe area instead of translating the whole Hero. Preserve roughly one clear text-line of space between the compatibility row and Dock at 1152 × 720 and nearby laptop sizes.
- Keep the Hero title slightly restrained (132px maximum at ordinary desktop sizes) so the supporting story remains above the fold.
- Disable vertical overscroll bounce without disabling normal page scrolling. Keep the Footer compact while reserving enough bottom space for the fixed Dock.
- Keep the Hero landscape and its pixel clouds static. Do not add drifting cloud overlays or background parallax.
