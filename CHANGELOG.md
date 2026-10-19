# Changelog

## Unreleased

- Counted Claude Code facts accurately: injected rows (meta, compact
  summaries, local command output, interrupts, tool results) no longer count
  as prompts, and model turns, tokens, tool calls, and prompts repeated across
  content-block rows or resumed session files count once.
- Classified tools by exact Claude Code and Codex names before falling back to
  whole-word matching, so to-do and planning tools no longer count as edits or
  subagents, and MCP tools are judged by their tool name.
- Added synthetic evals for both cases; the portable-copy eval now ignores
  local `node_modules`.
- Kept Codex-injected context (IDE file context, retained instructions,
  AGENTS.md, browser context, approval payloads, history replays) out of prompt
  statistics.
- Replaced the Dashboard's template-only insight generator: Generate now copies
  a request for the agent, and the page picks up new batches on focus. Removed
  `POST /api/insights/generate`.
- Fallback illustrations follow each card's theme. Persistence requires four
  distinct themes and evidence that resolves to real metrics with matching
  values.
- Skipped session files last written before a range's cutoff, and stopped
  asking the agent to load the full practice catalog.
- Replaced the TTF fonts with WOFF2, including a GB2312 subset of Noto Sans SC
  (2 MB instead of 17.8 MB); the Skill folder shrinks from about 28 MB to 12 MB.
- Served `index.html` without caching so an upgraded Dashboard loads its new
  bundle immediately.

## 0.1.2 — 2026-07-29

- Restored vertical Dashboard scrolling at common laptop viewport sizes while
  keeping fixed-size export routes isolated.
- Anchored generated illustrations to a versioned reference-conditioned pixel
  style with four canonical themes and visual QA.
- Tightened Coding Overview summaries to two sentences with representative
  facts and one behavior interpretation.
- Added editable frontend source and deterministic bundle rebuilding.

## 0.1.0 — 2026-07-29

- First public packaging of Coding Wrapped.
- Shared Agent Skill for Claude Code and Codex.
- Local-first Claude Code and Codex session scanner.
- Persistent pixel-art dashboard, Coding Overview, and four-at-a-time insights.
- Synthetic privacy, persistence, export, and loopback-server evaluation.
