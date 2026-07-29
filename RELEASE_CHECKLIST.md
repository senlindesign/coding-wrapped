# Release checklist

## Before the first push

- [x] Confirm the GitHub owner is `senlindesign`. If not, replace repository
      URLs in both READMEs, both plugin manifests, the Claude marketplace, and
      `SECURITY.md`.
- [x] Re-authenticate GitHub CLI with `gh auth login -h github.com`.
- [x] Run `make validate`.
- [x] Run `make package` and confirm `unzip -t dist/coding-wrapped.skill`.
- [ ] Run the activation matrix in
      `evals/coding-wrapped/model-eval-protocol.md` in fresh Claude Code and
      Codex conversations.
- [x] Test the public `npx skills add` command after the repository is visible.
- [ ] Test the Claude Code marketplace install after the repository is visible.

## GitHub repository settings

- [x] Description: `A local-first Coding Wrapped Skill for Claude Code and Codex.`
- [x] Topics: `agent-skills`, `claude-code`, `codex`, `coding-agents`,
      `local-first`, `pixel-art`, `dashboard`.
- [x] Enable Issues.
- [x] Enable private vulnerability reporting.
- [x] Keep GitHub Actions enabled for `.github/workflows/validate.yml`.

## Version 0.1.0

- [x] Commit the release with the two platform manifests on version `0.1.0`.
- [x] Tag `v0.1.0`.
- [x] Create a GitHub Release from `CHANGELOG.md`.
- [x] Attach `dist/coding-wrapped.skill`.
- [x] Verify all README screenshots and local links on the published page.

## After publishing

- [ ] Install from GitHub into Claude Code and run a Chinese first-run prompt.
- [ ] Install from GitHub into Codex and run an English first-run prompt.
- [ ] Confirm both installations produce the same dashboard files and privacy
      boundary.
- [ ] Record the fresh-agent activation results before calling the release
      fully cross-model verified.
