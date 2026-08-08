# Landing page code review — 2026-08-08

## Scope

Review goals: runtime smoothness, front-end performance, React maintainability,
Cloudflare Worker correctness, responsive behavior, and release readiness.

The baseline build completed in 358 ms and all 30 existing tests passed. The
specialized Chrome performance trace service was not available in this
workspace, so performance evidence uses production bundle sizes, request
behavior, browser interaction checks, and responsive layout inspection rather
than lab Core Web Vitals scores.

## Findings and resolutions

| ID | Severity | Finding | Resolution |
| --- | --- | --- | --- |
| PERF-01 | High | Demo view rotation and metric animation kept updating React state after the user scrolled past the demo. | Gate all three automated demo loops on the demo's current intersection state. |
| PERF-02 | High | Large below-fold illustrations and the three-card insight stack were eagerly decoded without intrinsic dimensions. | Add lazy loading, async decoding, and intrinsic dimensions; keep the hero mascot eager and high priority. |
| PERF-03 | Medium | Two used information illustrations were 1.2 MB PNG files; two superseded PNGs were still shipped. | Convert the used images to lossless WebP and remove superseded files. |
| PERF-04 | Medium | Large panel reveal animations applied a blur filter and retained compositor hints after completion. | Use opacity and transform only, then release `will-change` after reveal. |
| PERF-05 | Medium | The hero background and primary font were discovered only after CSS parsing; the local font lacked an explicit display strategy. | Preload both assets and use `font-display: swap`. |
| CLEAN-01 | Medium | A source-only icon package was installed as a runtime dependency despite no source import. | Remove the unused package while retaining the required asset attribution. |
| CLEAN-02 | Low | Vite, the React plugin, and Wrangler were declared as runtime dependencies. | Move build and deployment tooling to `devDependencies`. |
| CLEAN-03 | Low | The practice-library link had duplicate adjacent CSS rules. | Merge the declarations into one rule. |
| WORKER-01 | Low | The Worker compatibility date lagged the review date. | Update it to 2026-08-08; no unused Node compatibility flag is added. |
| DEPS-01 | High | The baseline dependency audit reported high-severity advisories in the Vite/Wrangler toolchain and transitive Nano ID/PostCSS packages. | Upgrade React to 19.2.8, Vite to 6.4.3, Wrangler to 4.120.0, and apply compatible transitive patches; the follow-up audit reports zero vulnerabilities. |

## Guardrails

- The Worker remains a small fetch handler with no secrets, mutable global
  state, unhandled background work, or unnecessary Node compatibility layer.
- The public demo continues to use synthetic aggregate data only.
- Reduced-motion behavior remains available, normal vertical scrolling remains
  enabled, and mobile insight swiping remains intact.

## Release verification

Complete this table after fixes are applied.

| Check | Result |
| --- | --- |
| Production build and automated tests | Pass — Vite 6.4.3 build; 32/32 tests |
| Repository release validation | Pass — 17/17 checks |
| Dependency security audit | Pass — 0 known vulnerabilities |
| Sites packaging tests | Pass — 4/4 tests |
| Wrangler dry-run validation | Pass — 30 static files; no binding errors |
| Desktop and mobile browser interaction | Pass — 1280 × 720 and 390 × 844; buttons, tabs, Page Down, and touch drag |
| Console errors and horizontal overflow | Pass — no browser errors; viewport and document widths match |
| Reviewed static asset weight | Improved — 4,926,074 B to 1,592,320 B for the four affected images, a 67.7% reduction |
| Production deployment smoke test | Pass — 200 response, 76 ms observed TTFB from Amsterdam, optimized WebP cache hit, SPA fallback 200, no browser errors |
