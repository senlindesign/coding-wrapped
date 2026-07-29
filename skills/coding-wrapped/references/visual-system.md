# Visual system

## Contents

- Product surface
- Typography
- Illustration style
  - Fixed rendering grammar
  - Required prompt prefix
  - Visual QA gate
  - Maintenance rules
- Card content

## Product surface

- Use one clean localhost Dashboard view.
- Keep the Coding Overview above the insight section.
- Make the illustrated insight the largest central block.
- Keep factual metrics below and let users choose among eight blocks.
- Keep the desktop insight index; hide it on mobile and use horizontal swipe.
- Keep desktop navigation sticky and mobile navigation static.
- Render all UI copy as HTML. Only the pixel illustration is a bitmap.

## Typography

- Chinese UI and headlines: Noto Sans SC.
- English UI and headlines: Plus Jakarta Sans.
- Minimum interface text: 14px.
- Use bold sans-serif for insight headlines; do not introduce a display serif.

## Illustration style

Use the fixed style ID `cw-pixel-diorama-v1`. “Pixel art” alone is not a
sufficient prompt: every generated image must be conditioned on the matching
bundled reference image.

| Theme | Canonical reference |
| --- | --- |
| warm | `assets/frontend-template/assets/agent-orchestra-warm.png` |
| blue | `assets/frontend-template/assets/night-runner-blue.png` |
| pink | `assets/frontend-template/assets/prompt-machine-pink.png` |
| green | `assets/frontend-template/assets/continue-steps-green.png` |

Resolve these paths from the Skill root. Use the theme reference as an actual
image input when the image tool supports references. If it accepts multiple
references, also attach the warm reference to anchor the shared rendering and
robot language.

### Fixed rendering grammar

- Canvas: exactly 1536 × 1024 PNG, landscape 3:2.
- Pixel scale: medium, visible, and consistent across the batch. Keep crisp,
  stair-stepped contours; do not use tiny high-density texture.
- Space: one simplified isometric or three-quarter diorama on a pale,
  uncluttered background with generous negative space and clear outer margins.
- Characters: reuse the rounded cream-white robot, black face panel, amber
  eyes, and small orange antenna seen in the references. Keep human figures
  similarly simplified.
- Materials: blocky shapes, restrained shading, readable silhouettes, and
  limited surface detail. Selective amber glow may appear on screens, lamps,
  signals, and status lights while object edges remain crisp.
- Story: communicate one behavior through one immediately readable scene.
  Do not add titles, labels, UI, logos, or decorative text to the bitmap.

The four default themes are:

- warm cream, ochre, rust, dark brown;
- pale blue with orange and teal accents;
- pale pink with forest green and yellow accents;
- misty cream and forest green with yellow highlights.

Preserve one coherent pixel scale across the batch. Give each illustration a
different composition and narrative space. Use light sources such as screens,
signals, windows, or small status lamps to add atmosphere.

### Required prompt prefix

Start every image prompt with this shared prefix, then append the theme palette
and the scene-specific composition:

> Create a 1536 × 1024 Coding Wrapped pixel-art diorama in the exact visual
> language of the attached canonical reference. Match its medium pixel density,
> crisp stair-stepped edges, simplified isometric geometry, rounded cream-white
> robot design, restrained palette, pale negative space, and selective amber
> glow. Show one clean, immediately readable scene with no text or UI.

Explicitly avoid: cinematic full-bleed landscapes, dark RPG environments,
complex architecture, anime illustration, painterly softness, photorealism,
3D rendering, vector-flat art, micro-pixel texture, heavy noise, giant pixels,
and mixed rendering styles.

### Visual QA gate

Before persistence, compare all four outputs with the canonical references and
reject or regenerate any image that fails one of these checks:

1. The file is a 1536 × 1024 PNG.
2. Pixel density and contour sharpness match the references at normal size.
3. The background stays pale and visually quiet; the scene does not become a
   full-bleed environment painting.
4. The robot, human proportions, perspective, shading, and glow belong to the
   same visual family as the other three outputs.
5. All four use different compositions but feel like one illustration set.
6. No text, UI, logo, accidental lettering, or private data appears.

Do not persist a visibly drifting image merely because it is technically pixel
art. Regenerate it or use the approved fallback illustration.

### Maintenance rules

- Treat `cw-pixel-diorama-v1` and the four bundled references as a versioned
  contract, not a loose mood board.
- Keep the style ID, canvas, prompt prefix, avoid list, and reference paths
  synchronized with `scripts/generate_insights.py` and its evaluator.
- Never promote a newly generated image into the canonical reference set
  automatically. Replace a reference only after human visual approval, then
  compare all four themes again.
- Keep the four fallback images as the canonical references so the no-image-tool
  path and the generated path cannot drift into two products.
- Rebuild or regenerate Dashboard screenshots only from approved references and
  synthetic metrics.

## Card content

Use the fixed sections `你怎么做`, `Agent 如何回应`, `你的风格` in Chinese or
`YOU DID`, `AGENT DID`, `YOUR STYLE` in English. Keep the suggestion visually
secondary. Do not bake these words into the illustration.
