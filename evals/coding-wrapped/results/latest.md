# Coding Wrapped Skill evaluation

Generated: `2026-07-29T08:20:30.703941+00:00`

Automated result: **14 passed / 0 failed**

| Category | Check | Result | Details |
| --- | --- | --- | --- |
| spec | Agent Skills frontmatter and discovery metadata | PASS | {'name': 'coding-wrapped', 'description_characters': 447, 'frontmatter_keys': ['description', 'name']} |
| spec | Progressive disclosure and reference depth | PASS | {'skill_lines': 198, 'direct_references': ['references/privacy-policy.md', 'references/insight-writing.md', 'references/visual-system.md']} |
| compatibility | Codex and Claude Code install contract | PASS | One canonical Skill is exposed through Claude and Codex manifests |
| activation | Direct, indirect, incomplete, and negative trigger cases | PASS | {'scenarios': 10, 'note': 'Contract cases are defined; fresh-agent model activation is reported separately.'} |
| privacy | Static network and local-only boundary | PASS | No bundled outbound HTTP client; local server defaults to 127.0.0.1 |
| function | Synthetic Claude + Codex aggregate scan | PASS | {'sessions': 2, 'subagents': 2, 'sources': ['claude-code', 'codex']} |
| recovery | Missing and single-source graceful degradation | PASS | Both-missing and Claude-only coverage states are explicit |
| function | CLI builds 7d, 30d, and unbounded all snapshots | PASS | {'7d': {'output': 'data/metrics/dashboard-7d.json', 'sessions': 2, 'messages': 3}, '30d': {'output': 'data/metrics/dashboard-30d.json', 'sessions': 2, 'messages': 3}, 'all': {'output': 'data/metrics/dashboard-all.json', 'sessions': 2, 'messages': 3}} |
| privacy | Generation brief excludes raw private markers | PASS | {'locale': 'zh', 'count': 4} |
| persistence | Four-at-a-time replacement and append persistence | PASS | {'batches': 2, 'insights': 8} |
| validation | Rejects one-card, duplicate-composition, and unknown-source batches | PASS | ['Insight batches must contain exactly four items', 'All four insights must use different compositions', 'Every source ID must exist in sources.json'] |
| persistence | Overview watermark and source validation | PASS | overview-20260729082029544064 |
| privacy | Portable export excludes transcripts and private markers | PASS | {'archive': 'coding-wrapped-eval.zip', 'files': 48} |
| compatibility | Fresh-directory copy compiles and scans | PASS | {'compiled_scripts': 8, 'portable_sessions': 2} |

## Model activation evaluation

The direct, indirect, incomplete-input, explain-only, and should-not-trigger
prompts are defined in `evals.json`. They have not yet been executed in fresh
Claude Haiku, Sonnet, Opus, and Codex sessions. This report does not treat a
metadata heuristic as proof that a model will activate the Skill correctly.
