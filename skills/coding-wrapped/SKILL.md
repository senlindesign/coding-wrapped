---
name: coding-wrapped
description: Creates or refreshes a private local Coding Wrapped website from Claude Code and Codex session history. Use for Coding Wrapped, coding-agent fun facts, AI-coding behavior insights, a personal localhost coding dashboard, new insight cards, or an export of an existing Wrapped. Scans locally, excludes raw transcripts from generated state, and produces one language with aggregate metrics, a Coding Overview, and four-at-a-time illustrated insights.
---

# Coding Wrapped

Turn local coding-agent history into a private localhost site. Make the default
flow short: infer the language, scan standard local sources, generate the site,
open it, and explain the controls.

## Product contract

1. **Local first** — Read local session files and write state only to the user's
   machine. Bind the site to `127.0.0.1`.
2. **Facts before stories** — Derive every claim from aggregate metrics. Never
   invent a number because it makes a better card.
3. **Fun before judgment** — Lead with recognizable habits and memorable
   moments. Give light suggestions, never scores, rankings, or diagnoses.
4. **One language** — Infer Chinese or English from the invoking prompt and
   generate the whole experience in that language.
5. **Four distinct scenes** — Generate insights four at a time. Their pixel-art
   illustrations must use different compositions, not four variations of a
   person, a hub, and connecting lines.

This is not a raw transcript viewer, employee-monitoring tool, productivity
score, or cloud analytics service.

## Runtime

Require Python 3.9+ and a local web browser. The bundled scripts make no
outbound network requests and need no separate API key; copy and illustration
generation use the active agent when available. Keep the workflow
platform-neutral. Do not require a Codex-only or Claude-only tool.

## First-run decisions

1. Infer `zh` or `en` from the user's current prompt. Do not ask for a language
   choice unless the prompt is genuinely ambiguous.
2. Reuse the saved display name when `config.json` exists. Otherwise infer a
   suitable short name; ask only if no reasonable name is available.
3. Treat an explicit request to scan or generate Coding Wrapped as authorization
   to read the standard local Claude Code and Codex session directories. If the
   user only asks what the Skill does, ask before scanning.
4. Do not ask about themes, metrics, layout, or data sources during normal
   onboarding. Use the defaults and report which sources were found.
5. Use one interface language. Do not expose a language toggle. A later request
   to change language is a regeneration request.
6. Do not present an implementation plan during the normal first run. Build the
   site, show it, then let the user react to something concrete.

## Run the workflow

Set `SKILL_DIR` to this Skill folder. Use a custom `CODING_WRAPPED_HOME` only
when the user requests one; otherwise state lives in `~/.coding-wrapped/`.

### 1. Scan local history

Run:

```bash
python3 "$SKILL_DIR/scripts/build_metrics.py" \
  --display-name "<name>" \
  --locale "<zh-or-en>"
```

This creates `7d`, `30d`, and `all` aggregate snapshots. It may read:

- `~/.claude/projects/**/*.jsonl`
- `~/.codex/sessions/**/*.jsonl`

Never copy raw transcript text into the generated site. Read
[references/privacy-policy.md](references/privacy-policy.md) before changing the
scanner or sending any scan-derived payload to a model.

### 2. Generate the Coding Overview

Run the brief command:

```bash
python3 "$SKILL_DIR/scripts/generate_overview.py" brief \
  --output /tmp/coding-wrapped-overview-brief.json
```

Read the brief. Write one overview in its requested locale with no score or
ranking and up to three sourced recommendations. Save the result as:

```json
{
  "copy": {
    "<locale>": {
      "eyebrow": "...",
      "title": "...",
      "summary": "...",
      "recommendations": [
        {
          "id": "...",
          "title": "...",
          "body": "...",
          "source_ids": ["an-allow-listed-id"]
        }
      ]
    }
  }
}
```

Persist it:

```bash
python3 "$SKILL_DIR/scripts/generate_overview.py" persist \
  --input /tmp/coding-wrapped-overview.json
```

### 3. Generate exactly four insights

Run:

```bash
python3 "$SKILL_DIR/scripts/generate_insights.py" brief \
  --output /tmp/coding-wrapped-insight-brief.json
```

Read [references/insight-writing.md](references/insight-writing.md) and
[references/visual-system.md](references/visual-system.md). Choose the four most
personal and visually expressive findings, not merely the four largest values.

When an image-generation tool is available, create four PNG illustrations with
four different compositions and pass each absolute path as `image_source`.
When none is available, omit `image_source`; the persistence script uses the
four approved fallback illustrations. Do not block the site on image generation.

Write a batch matching the requested locale and persist it:

```bash
python3 "$SKILL_DIR/scripts/generate_insights.py" persist \
  --input /tmp/coding-wrapped-insights.json
```

Every batch must contain exactly four insights. The first real batch replaces
the demo seed; later batches append and survive page refreshes.

### 4. Serve and open the site

Run the server as a persistent process:

```bash
python3 "$SKILL_DIR/scripts/serve_site.py" --open
```

Default URL: `http://127.0.0.1:4173/`.

Use the local browser to confirm:

- the configured name and language appear;
- the Overview loads;
- four generated insights load;
- factual metric cards load;
- generated images resolve;
- no raw prompt, code, project name, or local path is visible.

### 5. Hand off a tiny manual

After generation, give the user the URL and explain only these controls:

- **Scan data** refreshes factual aggregates and does not regenerate insights.
- **Generate insights** uses model allowance, usually takes 1–3 minutes, and
  always adds four.
- **Insight deck** supports click, arrow keys, and horizontal swipe.
- **Customize** chooses which factual metric blocks are shown.
- **Export** creates a portable local archive:

```bash
python3 "$SKILL_DIR/scripts/export_wrapped.py"
```

End with: raw conversations stay out of the website; only aggregates, generated
copy, approved source links, and generated illustrations are saved.

## Refresh rules

- Refresh facts whenever requested; this is deterministic and model-free.
- Do not regenerate the Coding Overview more than weekly unless the user asks.
- Auto-refresh the Overview only after it is at least seven days old and there
  are at least three new sessions or twenty new messages.
- Generate new insights only after explicit user action. Warn only that it uses
  model allowance and usually takes 1–3 minutes.
- Generate four, never one.

## Recovery

- If one source directory is missing, continue with the other and report the
  reduced coverage.
- If both are missing, explain the expected default paths and stop before
  generating claims.
- If image generation fails, use the fallback illustrations.
- If port `4173` is busy, choose another local port and report the exact URL.
- Preserve existing state on every retry; writes are atomic.
