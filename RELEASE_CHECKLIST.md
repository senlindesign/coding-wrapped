# Release checklist

## Before the first push

- [ ] Confirm the GitHub owner is `senlindesign`. If not, replace repository
      URLs in both READMEs, both plugin manifests, the Claude marketplace, and
      `SECURITY.md`.
- [ ] Re-authenticate GitHub CLI with `gh auth login -h github.com`.
- [ ] Run `make validate`.
- [ ] Run `make package` and confirm `unzip -t dist/coding-wrapped.skill`.
- [ ] Run the activation matrix in
      `evals/coding-wrapped/model-eval-protocol.md` in fresh Claude Code and
      Codex conversations.
- [ ] Test the public `npx skills add` command after the repository is visible.
- [ ] Test the Claude Code marketplace install after the repository is visible.

## GitHub repository settings

- [ ] Description: `Your private local AI-coding yearbook.`
- [ ] Topics: `agent-skills`, `claude-code`, `codex`, `coding-agents`,
      `local-first`, `pixel-art`, `dashboard`.
- [ ] Enable Issues.
- [ ] Enable private vulnerability reporting.
- [ ] Keep GitHub Actions enabled for `.github/workflows/validate.yml`.

## Version 0.1.0

- [ ] Commit the release with the two platform manifests on version `0.1.0`.
- [ ] Tag `v0.1.0`.
- [ ] Create a GitHub Release from `CHANGELOG.md`.
- [ ] Attach `dist/coding-wrapped.skill`.
- [ ] Verify all README screenshots and local links on the published page.

## After publishing

- [ ] Install from GitHub into Claude Code and run a Chinese first-run prompt.
- [ ] Install from GitHub into Codex and run an English first-run prompt.
- [ ] Confirm both installations produce the same dashboard files and privacy
      boundary.
- [ ] Record the fresh-agent activation results before calling the release
      fully cross-model verified.
