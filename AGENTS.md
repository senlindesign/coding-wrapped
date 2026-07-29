# Repository instructions

- Keep `skills/coding-wrapped/` as the only canonical Skill implementation.
- Keep Claude Code and Codex manifest versions synchronized.
- Keep the normal first run to one or two confirmations at most.
- Never put raw prompts, responses, code, project names, paths, email
  addresses, URLs, or secrets into generated state, model briefs, or exports.
- Generate insights four at a time and require four different illustration
  compositions.
- Keep every bundled first-run metric and README screenshot synthetic. Never
  commit a real user's aggregate snapshot as the public seed.
- Preserve existing local state during retries and upgrades.
- Run `make validate` after changes to the Skill, scripts, manifests, or assets.
