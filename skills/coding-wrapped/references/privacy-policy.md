# Privacy policy

## Allowed outputs

- aggregate session, message, project, subagent, tool, model, and token counts;
- timestamps rounded or grouped into behavior metrics;
- anonymous project counts;
- counts of explicitly approved short phrases such as `continue / 继续`;
- generated summaries, recommendations, and illustrations;
- allow-listed source IDs and URLs.

## Forbidden outputs

- raw transcripts or long prompt excerpts;
- source code, patches, command output, or terminal logs;
- repository, customer, client, or project names;
- local paths, email addresses, environment variables, or account identifiers;
- tokens, secrets, credentials, URLs discovered inside a conversation;
- employee rankings, productivity scores, or monitoring language.

## Model boundary

Send only the generated brief to a model. The brief may contain aggregates and
approved short phrases; it must not contain raw message text. Do not add a
network call to the scanner. Let the user's active coding agent write the copy
from the sanitized brief so the Skill does not require a separate API key.

## Sharing boundary

Before exporting a public image, visually inspect it. Public artifacts may show
aggregate metrics and user-approved short phrases. They may not show transcript
excerpts, code, project names, or local paths.

