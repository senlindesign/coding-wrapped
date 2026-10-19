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
