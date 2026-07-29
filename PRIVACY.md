# Privacy

Coding Wrapped is designed to be useful without becoming a transcript archive.

All data and screenshots committed to the public repository are synthetic demo
material. A user's real local state belongs in `~/.coding-wrapped/` and must
never be committed as a public seed.

## Local inputs

With the user's permission, the scanner may read:

- `~/.claude/projects/**/*.jsonl`
- `~/.codex/sessions/**/*.jsonl`

The bundled Python scanner makes no outbound network requests.

## Stored outputs

Generated state may contain:

- aggregate counts and time-based metrics;
- approved short phrase counters such as `continue` / `继续`;
- generated overview and insight copy;
- allow-listed public recommendation links;
- generated or bundled illustrations;
- a short display name and interface locale.

Generated state must not contain:

- raw prompts or assistant responses;
- source code or tool output;
- project names or repository names;
- local paths;
- email addresses, URLs, API keys, tokens, or other secrets.

## Model boundary

When the active coding agent generates overview or insight copy, it receives a
sanitized brief containing allow-listed aggregate fields. Raw session rows are
never part of that brief.

If the active agent uses a hosted model, the sanitized brief is subject to that
model provider's terms. The scanner and local dashboard themselves remain
offline.

## Local server

The dashboard binds to `127.0.0.1` by default. Do not change it to `0.0.0.0`
without an explicit user request and a clear warning that the site may become
reachable from the local network.

## Exports

Exports contain the same sanitized state and illustrations as the dashboard.
Users should still review an export before sharing it publicly.
