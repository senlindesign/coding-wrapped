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
- The Hero hierarchy is: standalone reading-robot mascot, product title, the slogan “Observe the way you build.”, one short value statement, two CTAs, then a divider and inline agent support. Do not show a local-first eyebrow above the title. Give these groups generous vertical spacing. Do not wrap the mascot in a frame or add desktop shortcut icons or an “Open the program” cue.
- Keep Hero CTA labels geometrically centered at rest. The hover arrow is an absolutely positioned feedback layer with equal left and right padding, so revealing it never shifts the label.
- Keep a four-item pixel Dock fixed near the bottom edge: Coding Wrapped, GitHub, About Sen, and Support the project. About Sen links to Sen's LinkedIn profile; Support the project links to Buy Me a Coffee. Use brand-led tile colors: Coding Wrapped cream, GitHub black with a white Octocat, Sen orange, and Buy Me a Coffee yellow. Preserve one coherent pixel density, rounded tile outline, hard shadow, hover lift, readable labels, and a lightly translucent blurred-glass tray.
- The Hero story should frame the product as a one-shot, local transformation of coding history into an engaging account of how someone works with AI, including unnoticed patterns and practical next steps. Keep privacy as supporting evidence, not the main story.
- Keep the Hero mascot playful without turning it into navigation: it may rotate and enlarge on hover. Keep the `Coding Wrapped` heading static in Plus Jakarta Sans; do not add hover or automatic font-switching effects to the title.
- Let only a narrow edge of the native HTML Dashboard enter the first viewport. Its visual system must track the canonical Coding Wrapped dashboard rather than behaving like an unrelated marketing mock.
- Keep interaction guidance inside the Dashboard. The integrated coach automatically cycles through Overview, Insight deck, and Behavior data, exposes direct view buttons, and can be paused. Do not add a separate “Three views” marketing section below it.
- Keep the Dashboard preview easy to discover as a live demo. Use the top view tabs as the only direct view navigation; rotate the three views automatically, pause briefly after direct user input, and do not add progress, pause, or next-tour chrome.
- Reproduce the native Insight Deck: one large centered pixel-art card with the previous and next cards visible behind it, then HTML-rendered headline, summary, `You did / Agent did / Your style`, and Light tip. Keep all four insight selectors plus Prev/Next visible, and support keyboard arrows and horizontal swipe.
- Behavior data keeps its compact Customize popover, supports eight selectable safe aggregates, and renders selected facts as a responsive four-color metric grid. Active days keeps its GitHub-style activity dots inside its card.
- While the Dashboard preview occupies the desktop viewport, move the fixed Dock into a smaller side state. The compact Dock remains fully opaque. On mobile, keep all four Dock items visible and centered.
- Continue from the demo into How it works and Install without a separate white section mask. Give both sections the same opaque warm panel, solid outline, and hard shadow; do not use translucent or dashed containers.
- The How it works illustration must directly visualize Scan, Wrap, and Explore as one connected pixel-art flow. It sits freely without its own framed card and must not reuse the standalone app icon as a generic placeholder.
- Keep How it works and Install at the same maximum width as the Dashboard.
- Keep the demo synthetic and privacy-safe. Never include real user aggregates, transcripts, code, project names, local paths or secrets.
- Render copy and controls as HTML. Reuse only approved Coding Wrapped pixel illustrations as bitmap story assets.
- Keep the public page static and backend-free. External destinations live in `src/content.js`.
- At short desktop heights, compress the Hero vertically and keep the “Now works with” row visibly clear of the fixed Dock. Do not apply that compact desktop treatment to mobile.
- On short desktop viewports, bottom-anchor the Hero content to a Dock safe area instead of translating the whole Hero. Preserve roughly one clear text-line of space between the compatibility row and Dock at 1152 × 720 and nearby laptop sizes.
- Keep the Hero title slightly restrained (132px maximum at ordinary desktop sizes) so the supporting story remains above the fold.
- Disable vertical overscroll bounce without disabling normal page scrolling. Keep the Footer compact while reserving enough bottom space for the fixed Dock.
- Keep the Hero landscape and its pixel clouds static. Do not add drifting cloud overlays or background parallax.
