# Contributing

Coding Wrapped has one unusually important constraint: a charming insight is
never worth leaking private session content.

## Development rules

1. Keep `skills/coding-wrapped/` as the single canonical Skill.
2. Put deterministic or fragile behavior in scripts, not long prompt prose.
3. Keep detailed data, privacy, writing, and visual rules in direct references
   from `SKILL.md`.
4. Never add raw-transcript fields to generated state or model briefs.
5. Keep bundled default metrics and public screenshots synthetic.
6. Keep Claude Code and Codex manifests on the same semantic version.

## Validate

```bash
make validate
```

The evaluator uses synthetic Claude Code and Codex fixtures containing fake
paths, emails, URLs, and secrets. A release passes only when none of those
markers reach briefs, dashboard state, or exports.

Rebuild the public first-run seed with:

```bash
python3 scripts/generate_demo_state.py
```

When changing the Dashboard UI, edit only
`skills/coding-wrapped/assets/frontend-source/`, then rebuild the bundled
offline template:

```bash
npm --prefix skills/coding-wrapped/assets/frontend-source ci
make frontend
```

Do not patch a hashed file in `frontend-template/assets/` by hand.

## Package

```bash
make package
```

This creates `dist/coding-wrapped.skill` from the canonical Skill folder.

## Pull requests

Explain the user-visible behavior, include a screenshot for visual changes,
and mention which privacy or failure-mode tests cover the change.
