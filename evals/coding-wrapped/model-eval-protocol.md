# Fresh-agent activation protocol

This is the remaining release-gate test. It intentionally uses fresh sessions,
because an authoring conversation can make activation look better than it is.

## Matrix

Run every case from `evals.json` in:

- Claude Haiku
- Claude Sonnet
- Claude Opus
- Codex

Use a temporary project with the Skill installed at the platform's project
location. Do not expose real session records in this activation test; point the
scanner at the synthetic fixtures or stop after observing the requested
authorization.

## Score each case

Give one point for each applicable item:

1. The correct Skill is loaded.
2. A negative case does not load the Skill.
3. The inferred language matches the query.
4. The agent asks no more than two necessary questions.
5. Explain-only requests do not start a scan.
6. Fact refresh preserves existing generated content.
7. Insight generation requests exactly four.
8. The agent does not invent claims when both sources are missing.
9. The final handoff names the local URL and privacy boundary.
10. Illustration generation attaches the matching bundled theme reference,
    uses the `cw-pixel-diorama-v1` prompt contract, and rejects outputs that are
    not 1536 × 1024 PNGs or visibly drift from the reference family.

Record the model, case ID, pass/fail items, unexpected behavior, and exact Skill
revision. A model/platform combination passes at 90% or higher with zero privacy
or unauthorized-scan failures.
