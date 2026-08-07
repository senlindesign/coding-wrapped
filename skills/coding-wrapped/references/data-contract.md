# Local data contract

Schema version: `1.0.0`

## State root

Use `~/.coding-wrapped/` by default or `CODING_WRAPPED_HOME` when explicitly
configured.

```text
~/.coding-wrapped/
├── config.json
├── data/
│   ├── metrics/
│   │   ├── dashboard-7d.json
│   │   ├── dashboard-30d.json
│   │   └── dashboard-all.json
│   ├── insights.json
│   ├── overview.json
│   └── sources.json
├── assets/
│   └── generated-images/
└── exports/
```

## Files

- `config.json` stores the display name, single interface locale, visible
  metrics, privacy flags, and generation policy. Never store credentials.
- `dashboard-*.json` stores deterministic aggregates and approved short-phrase
  counts. Rebuild these files without invoking a model.
- `insights.json` stores stable IDs, batches, evidence values, one requested
  locale of UI copy, a Light Tip practice ID, derived source IDs, and local
  relative image URLs. Older cards without a practice ID remain readable.
- `overview.json` stores one requested locale, its metrics watermark, refresh
  decision, and up to three recommendations linked to catalog practice IDs.
- `sources.json` is the runtime URL allow-list derived from
  `references/coding-best-practices.md`. Generated copy may reference its IDs
  but may not invent URLs. Existing installations merge new canonical entries
  while retaining historical entries needed by older cards.
- Every catalog practice declares a `family` and `match_mode`. Generation
  briefs exclude `reserve` entries and select no more than one `automatic`
  practice per family, so reviewed knowledge is not mistaken for a behavior
  the scanner can prove.
- `generated-images/` stores local illustration files by batch.

## Local API

```text
GET  /api/state
GET  /api/config
GET  /api/insights
GET  /api/overview
GET  /api/sources
GET  /api/metrics?range=7d|30d|all
POST /api/insights/generate
POST /api/overview/auto-refresh
POST /api/refresh?range=7d|30d|all
```

`POST /api/refresh` changes facts only. `POST /api/insights/generate` accepts
exactly four records. Generated images use `/generated-images/<batch>/<file>`.
All endpoints bind to the local server; they are not a hosted API.
