# Coding agent best practices

This file is the human-maintained source of truth for Coding Wrapped Light
Tips. Runtime source lists are derived from it. Do not add advice directly to
generation briefs or `sources.json` without adding a supported practice here.

The catalog stores short paraphrases, never long quotations. Re-check living
documentation before changing a claim, and update `checked_at` when the source
has been reviewed again.

The current library contains **40 practices**. `automatic` practices may enter
a generation brief when the local aggregate metrics provide relevant context.
`reserve` practices remain available as reviewed knowledge, but are excluded
from personalization until the scanner can prove the required signal.

## Contents

- [Editorial rules](#editorial-rules)
- [Source registry](#source-registry)
- [Practices](#practices)
- [Behavior tags](#behavior-tags)

## Editorial rules

- Prefer first-party documentation and direct practitioner interviews.
- Match a tip to an observed aggregate behavior; never infer intent, quality,
  or productivity.
- Keep one practice to one actionable next move.
- Preserve caveats from practitioner workflows. A personal workflow is not a
  universal law.
- Use `official`, `practitioner`, or `expert-conversation` as the source tier.
- Keep English and Chinese actions equivalent in meaning.
- Give every practice one `family`; a generated batch may contain at most one
  candidate from the same family.
- Use `match_mode: reserve` whenever current aggregate metrics cannot support a
  personalized match without guessing.

## Source registry

```json
{
  "kind": "source_registry",
  "schema_version": "1.1.0",
  "checked_at": "2026-08-08",
  "sources": [
    {
      "id": "openai-prompting",
      "title": "Prompting",
      "publisher": "OpenAI",
      "url": "https://learn.chatgpt.com/docs/prompting",
      "type": "first-party-documentation",
      "source_tier": "official",
      "published_at": null,
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Describe the goal, relevant context, expected output, and important boundaries for consequential tasks.",
        "State the result you need while leaving implementation choices to the agent when the route is not itself a requirement.",
        "For Codex tasks, include the relevant code location or reproduction path, constraints, and a way to verify success.",
        "Use focused UI iterations and check the result in the browser."
      ],
      "topics": ["prompting", "scoping", "verification", "ui-iteration"]
    },
    {
      "id": "openai-agents-md",
      "title": "Custom instructions with AGENTS.md",
      "publisher": "OpenAI",
      "url": "https://learn.chatgpt.com/docs/agent-configuration/agents-md",
      "type": "first-party-documentation",
      "source_tier": "official",
      "published_at": null,
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Store durable repository guidance in AGENTS.md and scope local rules near the code they govern."
      ],
      "topics": ["repository-context", "durable-instructions"]
    },
    {
      "id": "anthropic-claude-code-best-practices",
      "title": "Best practices for Claude Code",
      "publisher": "Anthropic",
      "url": "https://code.claude.com/docs/en/best-practices",
      "type": "first-party-documentation",
      "source_tier": "official",
      "published_at": null,
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Give the agent an executable way to verify its work and ask for observable evidence.",
        "Explore before planning and implementing when the task is complex or unfamiliar.",
        "Point to relevant files, existing patterns, or comparable implementations instead of making the agent rediscover repository context.",
        "Correct course early and reset a stuck context after repeated failed corrections.",
        "Use separate context for high-output investigation and independent review."
      ],
      "topics": ["verification", "planning", "context-management", "subagents"]
    },
    {
      "id": "anthropic-claude-code-memory",
      "title": "How Claude remembers your project",
      "publisher": "Anthropic",
      "url": "https://code.claude.com/docs/en/memory",
      "type": "first-party-documentation",
      "source_tier": "official",
      "published_at": null,
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Keep project instructions concise, specific, consistent, and scoped to where they apply."
      ],
      "topics": ["context-management", "durable-instructions"]
    },
    {
      "id": "anthropic-claude-code-subagents",
      "title": "Create custom subagents",
      "publisher": "Anthropic",
      "url": "https://code.claude.com/docs/en/sub-agents",
      "type": "first-party-documentation",
      "source_tier": "official",
      "published_at": null,
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Give each subagent a specialized purpose and focused responsibility."
      ],
      "topics": ["subagents", "delegation", "review"]
    },
    {
      "id": "boris-year-of-claude-code",
      "title": "Reflecting on a year of Claude Code",
      "publisher": "Anthropic",
      "url": "https://www.youtube.com/watch?v=Hth_tLaC2j8",
      "type": "first-party-team-interview",
      "source_tier": "practitioner",
      "published_at": "2026-06-08",
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Avoid preloading irrelevant context; let the agent retrieve what it needs.",
        "Persist recurring corrections as durable project instructions rather than repeating them in every session."
      ],
      "topics": ["context-management", "durable-instructions", "correction-loops"]
    },
    {
      "id": "lenny-ai-developer-tools",
      "title": "How to build your own AI developer tools with Claude Code",
      "publisher": "Lenny's Newsletter",
      "url": "https://www.lennysnewsletter.com/p/how-to-build-your-own-ai-developer",
      "type": "practitioner-interview",
      "source_tier": "expert-conversation",
      "published_at": "2026-02-09",
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Use visual specifications for interface-heavy work and give independent reviewers a specific review target."
      ],
      "topics": ["ui-iteration", "visual-specification", "review"]
    },
    {
      "id": "lenny-journalist-ios-developer",
      "title": "From journalist to iOS developer: How LinkedIn's editor builds with Claude Code",
      "publisher": "Lenny's Newsletter",
      "url": "https://www.lennysnewsletter.com/p/from-journalist-to-ios-developer",
      "type": "practitioner-interview",
      "source_tier": "expert-conversation",
      "published_at": "2026-03-16",
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Separate building from reviewing and isolate AI work in branches or worktrees so experiments remain inspectable and reversible."
      ],
      "topics": ["review", "worktrees", "version-control"]
    },
    {
      "id": "lenny-braintrust-agents-evals",
      "title": "How Braintrust uses AI agents, evals, and CI to ship better software",
      "publisher": "Lenny's Newsletter",
      "url": "https://www.lennysnewsletter.com/p/how-braintrust-uses-ai-agents-evals",
      "type": "practitioner-interview",
      "source_tier": "expert-conversation",
      "published_at": "2026-06-15",
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Encode recurring quality expectations as repeatable tests, rubrics, or evals instead of relying on vague requests."
      ],
      "topics": ["evals", "quality", "verification"]
    },
    {
      "id": "lenny-autonomous-coding-agents",
      "title": "How I run autonomous coding agents from my phone with OpenAI Symphony + Linear",
      "publisher": "Lenny's Newsletter",
      "url": "https://www.lennysnewsletter.com/p/how-i-run-autonomous-coding-agents",
      "type": "practitioner-interview",
      "source_tier": "expert-conversation",
      "published_at": "2026-07-06",
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Manage parallel agents with explicit task state, ownership, completion conditions, and a next step after failure.",
        "Audit accumulated instructions and remove context that no longer helps."
      ],
      "topics": ["agent-management", "context-management", "parallel-work"]
    },
    {
      "id": "openai-harness-engineering",
      "title": "Harness engineering: leveraging Codex in an agent-first world",
      "publisher": "OpenAI",
      "url": "https://openai.com/index/harness-engineering/",
      "type": "first-party-engineering-report",
      "source_tier": "official",
      "published_at": "2026-02-11",
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Repeated agent failures often expose a missing tool, abstraction, documentation layer, or enforceable constraint in the environment.",
        "Agent-readable UI state, logs, metrics, and traces shorten runtime debugging loops.",
        "A concise AGENTS.md can act as a map to versioned repository knowledge, while stable architecture rules belong in executable checks."
      ],
      "topics": ["harness-engineering", "observability", "repository-knowledge", "architecture"]
    },
    {
      "id": "openai-code-review",
      "title": "Code review",
      "publisher": "OpenAI",
      "url": "https://learn.chatgpt.com/docs/code-review",
      "type": "first-party-documentation",
      "source_tier": "official",
      "published_at": null,
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Codex can review a specified diff in a read-only pass and return prioritized, actionable findings without changing the worktree."
      ],
      "topics": ["review", "diffs", "verification"]
    },
    {
      "id": "openai-rules",
      "title": "Rules",
      "publisher": "OpenAI",
      "url": "https://learn.chatgpt.com/docs/agent-configuration/rules",
      "type": "first-party-documentation",
      "source_tier": "official",
      "published_at": null,
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Codex rules can narrowly allow, prompt for, or forbid command prefixes and can include positive and negative match tests."
      ],
      "topics": ["permissions", "approval-rules", "security"]
    },
    {
      "id": "openai-github-action",
      "title": "Codex GitHub Action",
      "publisher": "OpenAI",
      "url": "https://learn.chatgpt.com/docs/github-action",
      "type": "first-party-documentation",
      "source_tier": "official",
      "published_at": null,
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Stable review and release prompts can be versioned in a repository and run in CI with least GitHub permissions."
      ],
      "topics": ["ci", "automation", "review", "least-privilege"]
    },
    {
      "id": "openai-build-skills",
      "title": "Build skills",
      "publisher": "OpenAI",
      "url": "https://learn.chatgpt.com/docs/build-skills",
      "type": "first-party-documentation",
      "source_tier": "official",
      "published_at": null,
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Stable repeated workflows can be packaged as reusable Skills whose full instructions load only when the task matches."
      ],
      "topics": ["skills", "reusable-workflows", "context-management"]
    },
    {
      "id": "openai-agent-security",
      "title": "Agent approvals and security",
      "publisher": "OpenAI",
      "url": "https://learn.chatgpt.com/docs/agent-approvals-security",
      "type": "first-party-documentation",
      "source_tier": "official",
      "published_at": null,
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Dependency setup and credential use should be separated from the agent execution phase so execution can run without secrets and with restricted network access."
      ],
      "topics": ["security", "setup", "secrets", "network-access"]
    },
    {
      "id": "anthropic-claude-code-hooks",
      "title": "Automate workflows with hooks",
      "publisher": "Anthropic",
      "url": "https://code.claude.com/docs/en/hooks-guide",
      "type": "first-party-documentation",
      "source_tier": "official",
      "published_at": null,
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Deterministic formatting, linting, notifications, and protected-file checks can run at lifecycle hooks instead of depending on repeated prose reminders."
      ],
      "topics": ["hooks", "automation", "linting", "protected-files"]
    },
    {
      "id": "anthropic-claude-code-permissions",
      "title": "Permissions",
      "publisher": "Anthropic",
      "url": "https://code.claude.com/docs/en/permissions",
      "type": "first-party-documentation",
      "source_tier": "official",
      "published_at": null,
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Permission rules evaluate deny before ask and allow, enabling protected operations to be blocked before execution."
      ],
      "topics": ["permissions", "protected-files", "security"]
    },
    {
      "id": "anthropic-claude-code-security",
      "title": "Security",
      "publisher": "Anthropic",
      "url": "https://code.claude.com/docs/en/security",
      "type": "first-party-documentation",
      "source_tier": "official",
      "published_at": null,
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Third-party MCP servers are not reviewed by Anthropic and should be treated as external dependencies that require explicit trust."
      ],
      "topics": ["mcp", "third-party-tools", "security"]
    },
    {
      "id": "anthropic-claude-code-mcp",
      "title": "Connect Claude Code to tools via MCP",
      "publisher": "Anthropic",
      "url": "https://code.claude.com/docs/en/mcp",
      "type": "first-party-documentation",
      "source_tier": "official",
      "published_at": null,
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Project MCP servers require approval, tool permissions can be scoped, and unused OAuth authorization can be revoked."
      ],
      "topics": ["mcp", "permissions", "authorization"]
    },
    {
      "id": "anthropic-claude-code-costs",
      "title": "Manage costs effectively",
      "publisher": "Anthropic",
      "url": "https://code.claude.com/docs/en/costs",
      "type": "first-party-documentation",
      "source_tier": "official",
      "published_at": null,
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Large tool outputs such as build logs can be filtered to errors and nearby context before entering the conversation.",
        "Code intelligence can reduce repeated broad searches by navigating definitions, references, and type errors directly."
      ],
      "topics": ["context-management", "tool-output", "logs", "code-intelligence"]
    },
    {
      "id": "linear-coding-sessions",
      "title": "Coding sessions",
      "publisher": "Linear",
      "url": "https://linear.app/docs/coding-sessions",
      "type": "first-party-product-workflow",
      "source_tier": "practitioner",
      "published_at": null,
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Agent-ready issues benefit from a clear outcome, scope, constraints, and an example that distinguishes correct behavior from the bug."
      ],
      "topics": ["issues", "delegation", "task-scoping"]
    },
    {
      "id": "linear-agent-at-linear",
      "title": "How we use Linear Agent at Linear",
      "publisher": "Linear",
      "url": "https://linear.app/now/how-we-use-linear-agent-at-linear",
      "type": "first-party-engineering-workflow",
      "source_tier": "practitioner",
      "published_at": "2026-04-10",
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Cross-system investigations become more tractable when divided into targeted evidence-gathering steps that narrow the next search."
      ],
      "topics": ["investigation", "cross-tool-work", "task-decomposition"]
    },
    {
      "id": "armin-agentic-coding",
      "title": "Agentic Coding: The Future of Software Development with Agents",
      "publisher": "Armin Ronacher",
      "url": "https://www.youtube.com/watch?v=nfOVgz_omlU",
      "type": "practitioner-talk",
      "source_tier": "practitioner",
      "published_at": "2025-06-29",
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "Agent-facing environments work better when logs share one tail-able entry point and tools return specific recoverable errors."
      ],
      "topics": ["logs", "tool-design", "debugging"]
    },
    {
      "id": "simon-agentic-patterns",
      "title": "Agentic Engineering Patterns: Anti-patterns",
      "publisher": "Simon Willison",
      "url": "https://simonwillison.net/guides/agentic-engineering-patterns/anti-patterns/",
      "type": "practitioner-guide",
      "source_tier": "practitioner",
      "published_at": "2026-03-04",
      "checked_at": "2026-08-08",
      "supporting_claims": [
        "The author of an agent-generated change remains responsible for reviewing it, validating it, keeping the change reviewable, and attaching evidence."
      ],
      "topics": ["review", "accountability", "pull-requests", "verification"]
    }
  ]
}
```

## Practices

### Define the outcome and one important boundary

```json
{
  "kind": "practice",
  "id": "define-outcome-boundaries",
  "title": {"en": "Define the outcome and one boundary", "zh": "补清结果和一条边界"},
  "behavior_tags": ["short-prompts", "repeated-corrections", "general"],
  "signal_hints": ["short prompts dominate", "correction phrases repeat"],
  "rationale": {
    "en": "A compact request becomes easier to execute when the finish line and one protected constraint are visible.",
    "zh": "短指令只要补上完成标准和一条不能改变的约束，就更容易一次性交付。"
  },
  "action": {
    "en": "Before a short command, add one sentence describing what done looks like and one thing that must not change.",
    "zh": "短指令前补一句“什么算完成”，再写一条不能改变的边界。"
  },
  "family": "task-framing",
  "match_mode": "automatic",
  "source_ids": ["openai-prompting"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Describe the result before prescribing the route

```json
{
  "kind": "practice",
  "id": "result-before-route",
  "title": {"en": "Lead with the result", "zh": "先说结果，再说路线"},
  "behavior_tags": ["general", "repeated-corrections"],
  "signal_hints": ["many steering corrections", "high manual intervention"],
  "rationale": {
    "en": "The agent can compare approaches when the desired result is clear and the route is not itself a constraint.",
    "zh": "当结果清楚而过程不是硬约束时，Agent 才有空间比较路径并自行调整。"
  },
  "action": {
    "en": "State the acceptance result first; prescribe the implementation route only when the route itself matters.",
    "zh": "先写验收结果；只有实现过程本身重要时，才规定具体路线。"
  },
  "family": "task-autonomy",
  "match_mode": "reserve",
  "source_ids": ["openai-prompting"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Reproduce, fix minimally, and rerun the same check

```json
{
  "kind": "practice",
  "id": "reproduce-fix-verify",
  "title": {"en": "Reproduce, fix, rerun", "zh": "先复现，再小修，再复验"},
  "behavior_tags": ["high-tool-use", "verification-language", "repeated-corrections"],
  "signal_hints": ["many tool calls", "test or verify phrases appear", "rework phrases repeat"],
  "rationale": {
    "en": "Using the same reproduction before and after a minimal fix makes the result easier to trust and review.",
    "zh": "修复前后使用同一条复现路径，能让最小改动的结果更容易核验。"
  },
  "action": {
    "en": "Ask the agent to reproduce the issue first, make the smallest fix, then rerun that reproduction and the narrowest relevant tests.",
    "zh": "先让 Agent 复现问题，做最小修复，再重跑同一复现路径和最相关的测试。"
  },
  "family": "bug-verification",
  "match_mode": "reserve",
  "source_ids": ["openai-prompting"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Plan in proportion to task risk

```json
{
  "kind": "practice",
  "id": "plan-by-risk",
  "title": {"en": "Plan in proportion to risk", "zh": "按任务风险决定计划深度"},
  "behavior_tags": ["low-plan-use", "plan-use", "many-projects", "general"],
  "signal_hints": ["few plan-mode sessions", "work spans many projects"],
  "rationale": {
    "en": "Planning helps with unfamiliar or cross-cutting work, while ceremony can slow down a tiny local edit.",
    "zh": "陌生或跨模块任务需要先厘清路线，小改动则不必为计划增加额外流程。"
  },
  "action": {
    "en": "Use an editable plan for unfamiliar or multi-part work; skip the ceremony when the diff can be described in one sentence.",
    "zh": "陌生或多步骤任务先做可编辑计划；一句话能讲清的改动就直接完成。"
  },
  "family": "planning",
  "match_mode": "automatic",
  "source_ids": ["openai-prompting", "anthropic-claude-code-best-practices"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Persist recurring repository guidance

```json
{
  "kind": "practice",
  "id": "persist-repository-guidance",
  "title": {"en": "Persist recurring repository guidance", "zh": "把重复规范写进项目说明"},
  "behavior_tags": ["repeated-corrections", "many-projects", "general"],
  "signal_hints": ["the same correction recurs", "multiple repositories are active"],
  "rationale": {
    "en": "Stable instructions close to the code reduce repeated reminders and survive new sessions.",
    "zh": "把稳定规范放在离代码最近的位置，可以减少重复提醒，并让新会话继续使用。"
  },
  "action": {
    "en": "When the same repository rule comes up repeatedly, put it in the nearest applicable AGENTS.md or project instruction file.",
    "zh": "同一条项目规范重复出现时，把它写进最近的 AGENTS.md 或项目指令文件。"
  },
  "family": "repository-guidance",
  "match_mode": "reserve",
  "source_ids": ["openai-agents-md", "boris-year-of-claude-code"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Iterate on one UI region at a time

```json
{
  "kind": "practice",
  "id": "focused-ui-iteration",
  "title": {"en": "Focus each UI iteration", "zh": "每轮只聚焦一个界面区域"},
  "behavior_tags": ["browser-work", "repeated-corrections"],
  "signal_hints": ["browser tools appear", "many small visual corrections"],
  "rationale": {
    "en": "A narrow visual target makes browser verification and the next correction more concrete.",
    "zh": "视觉目标越聚焦，浏览器验证和下一轮修正就越具体。"
  },
  "action": {
    "en": "Limit the next UI pass to one region and name the browser state, interaction, or screenshot that proves it works.",
    "zh": "下一轮 UI 只改一个区域，并写明要在浏览器里检查的状态、交互或截图。"
  },
  "family": "ui-iteration",
  "match_mode": "automatic",
  "source_ids": ["openai-prompting"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Give the agent an executable verification loop

```json
{
  "kind": "practice",
  "id": "executable-verification-loop",
  "title": {"en": "Make verification executable", "zh": "让验证可以由 Agent 自己运行"},
  "behavior_tags": ["long-runs", "high-tool-use", "verification-language", "general"],
  "signal_hints": ["long autonomous run", "many tool calls", "verification phrases appear"],
  "rationale": {
    "en": "A test, build, lint run, screenshot, or visible diff lets the agent iterate before handing work back.",
    "zh": "测试、构建、lint、截图或可见 diff 能让 Agent 在交付前自行迭代。"
  },
  "action": {
    "en": "End the task with one pass/fail check the agent can run and interpret without waiting for you.",
    "zh": "任务结尾补一个 Agent 能自行运行和判断的通过条件。"
  },
  "family": "verification-loop",
  "match_mode": "automatic",
  "source_ids": ["anthropic-claude-code-best-practices"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Ask for evidence before accepting done

```json
{
  "kind": "practice",
  "id": "evidence-before-done",
  "title": {"en": "Ask for evidence, not a success claim", "zh": "接受完成前先看证据"},
  "behavior_tags": ["continuation-loops", "long-runs", "verification-language", "general"],
  "signal_hints": ["many continue prompts", "long uninterrupted work", "verification language appears"],
  "rationale": {
    "en": "Observable output is easier to review than a generic completion statement.",
    "zh": "可观察的输出比一句泛泛的“已经完成”更容易检查。"
  },
  "action": {
    "en": "Before the final handoff, ask for the command and result, test output, or screenshot that demonstrates the change.",
    "zh": "最终交付前，让 Agent 给出执行命令和结果、测试输出或验证截图。"
  },
  "family": "handoff-evidence",
  "match_mode": "automatic",
  "source_ids": ["anthropic-claude-code-best-practices"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Explore before implementing unfamiliar work

```json
{
  "kind": "practice",
  "id": "explore-before-implementation",
  "title": {"en": "Explore before implementation", "zh": "陌生任务先只读探索"},
  "behavior_tags": ["low-plan-use", "repeated-corrections", "many-projects"],
  "signal_hints": ["few planning sessions", "work spans repositories", "direction changes recur"],
  "rationale": {
    "en": "A read-only pass helps the agent solve the right problem before it starts changing files.",
    "zh": "先做一轮只读探索，可以降低还没理解问题就开始改文件的风险。"
  },
  "action": {
    "en": "For an unfamiliar or cross-file change, reserve the first pass for reading, searching, and returning a plan before edits begin.",
    "zh": "遇到陌生或跨文件改动，第一轮只读、搜索并返回计划，再开始编辑。"
  },
  "family": "exploration",
  "match_mode": "reserve",
  "source_ids": ["anthropic-claude-code-best-practices"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Point to an existing pattern

```json
{
  "kind": "practice",
  "id": "point-to-existing-pattern",
  "title": {"en": "Point to an existing pattern", "zh": "给 Agent 一个现有实现作参照"},
  "behavior_tags": ["short-prompts", "repeated-corrections", "many-projects"],
  "signal_hints": ["short prompts dominate", "convention corrections recur", "many projects are active"],
  "rationale": {
    "en": "A nearby implementation carries repository conventions that are expensive to restate in every prompt.",
    "zh": "项目里相近的实现已经包含很多无需重复描述的约定。"
  },
  "action": {
    "en": "Alongside a short request, name one existing file or component whose pattern the agent should follow.",
    "zh": "短指令旁边再指一个现有文件或组件，让 Agent 沿用它的模式。"
  },
  "family": "repository-patterns",
  "match_mode": "reserve",
  "source_ids": ["anthropic-claude-code-best-practices"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Keep durable instructions concise and scoped

```json
{
  "kind": "practice",
  "id": "concise-scoped-instructions",
  "title": {"en": "Keep instructions concise and scoped", "zh": "让长期指令简短并限定作用范围"},
  "behavior_tags": ["many-projects", "long-runs", "general"],
  "signal_hints": ["many repositories are active", "long contexts recur"],
  "rationale": {
    "en": "Short, specific, non-conflicting rules preserve context and remain easier to follow.",
    "zh": "简短、具体、不冲突的规则更省上下文，也更容易稳定执行。"
  },
  "action": {
    "en": "Remove stale project rules and move directory-specific instructions closer to the code they govern.",
    "zh": "删除过时项目规则，把只适用于某目录的指令移到对应代码附近。"
  },
  "family": "instruction-hygiene",
  "match_mode": "reserve",
  "source_ids": ["anthropic-claude-code-memory", "boris-year-of-claude-code"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Restart a loop after repeated failed corrections

```json
{
  "kind": "practice",
  "id": "restart-stuck-loop",
  "title": {"en": "Restart a stuck correction loop", "zh": "反复纠正无效时重开上下文"},
  "behavior_tags": ["repeated-corrections", "continuation-loops"],
  "signal_hints": ["correction phrases recur", "continue prompts recur"],
  "rationale": {
    "en": "Repeated corrections can leave stale assumptions in context; a clean start can carry forward only what was learned.",
    "zh": "反复纠正会让旧假设继续留在上下文中，重开后可以只带上已经学到的约束。"
  },
  "action": {
    "en": "If the same issue survives two corrections, start a clean context and put the learned constraints in the first prompt.",
    "zh": "同一问题修正两次仍存在时，开一个新上下文，并把学到的约束写进首条 Prompt。"
  },
  "family": "stuck-loop",
  "match_mode": "reserve",
  "source_ids": ["anthropic-claude-code-best-practices"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Reset or compact context deliberately

```json
{
  "kind": "practice",
  "id": "deliberate-context-reset",
  "title": {"en": "Reset context deliberately", "zh": "有意识地清理或压缩上下文"},
  "behavior_tags": ["long-runs", "continuation-loops", "many-projects"],
  "signal_hints": ["long sessions recur", "continue prompts recur", "work spans many projects"],
  "rationale": {
    "en": "Unrelated work and old tool output compete with the decisions a long task still needs.",
    "zh": "无关任务和旧工具输出会挤占长任务真正需要保留的决定。"
  },
  "action": {
    "en": "Before changing topics, start a new context; before compacting a long task, preserve changed files, key decisions, and test commands.",
    "zh": "切换无关任务前开新上下文；压缩长任务前保留改动文件、关键决定和测试命令。"
  },
  "family": "context-management",
  "match_mode": "automatic",
  "source_ids": ["anthropic-claude-code-best-practices"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Separate investigation from independent review

```json
{
  "kind": "practice",
  "id": "separate-investigation-review",
  "title": {"en": "Separate investigation and review", "zh": "把调查和独立审查分开"},
  "behavior_tags": ["subagent-use", "high-tool-use", "long-runs"],
  "signal_hints": ["subagents appear", "tool output is high", "autonomous runs are long"],
  "rationale": {
    "en": "Focused contexts keep noisy investigation out of the main thread and give the final diff an independent check.",
    "zh": "独立上下文既能隔离高输出调查，也能给最终 diff 一次真正独立的检查。"
  },
  "action": {
    "en": "Use one focused agent for high-output investigation and another fresh context to review the final diff against acceptance criteria.",
    "zh": "用一个 Agent 做高输出调查，再用另一个新上下文按验收条件审查最终 diff。"
  },
  "family": "review-isolation",
  "match_mode": "automatic",
  "source_ids": ["anthropic-claude-code-best-practices", "anthropic-claude-code-subagents"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Persist recurring corrections, not one-off preferences

```json
{
  "kind": "practice",
  "id": "persist-recurring-corrections",
  "title": {"en": "Persist recurring corrections", "zh": "固化重复纠正，不固化一次性偏好"},
  "behavior_tags": ["repeated-corrections", "continuation-loops"],
  "signal_hints": ["the same correction recurs", "long-running agent loops recur"],
  "rationale": {
    "en": "A stable correction can become reusable guidance, but one-off task details create stale context when persisted.",
    "zh": "稳定纠正值得复用，一次性任务细节写进长期指令则会制造过时上下文。"
  },
  "action": {
    "en": "When a correction recurs across sessions, turn only its durable part into a project rule or Skill instruction.",
    "zh": "同一种纠正在多个会话出现时，只把长期成立的部分写成项目规则或 Skill 指令。"
  },
  "family": "repository-guidance",
  "match_mode": "reserve",
  "source_ids": ["boris-year-of-claude-code"],
  "confidence": "medium",
  "last_verified": "2026-08-08"
}
```

### Use a visual specification for interface-heavy work

```json
{
  "kind": "practice",
  "id": "visual-spec-for-ui",
  "title": {"en": "Use a visual specification", "zh": "视觉任务先给可查看的规格"},
  "behavior_tags": ["browser-work", "repeated-corrections"],
  "signal_hints": ["browser work is frequent", "layout corrections recur"],
  "rationale": {
    "en": "A mockup or interaction reference communicates layout and motion more directly than an increasingly long correction thread.",
    "zh": "Mockup 或交互参考比不断变长的文字纠正更直接地表达布局和动效。"
  },
  "action": {
    "en": "For a visual task, attach one mockup or interaction reference and name the states that still need written explanation.",
    "zh": "视觉任务先附一张 mockup 或交互参考，再用文字补充图片表达不了的状态。"
  },
  "family": "visual-specification",
  "match_mode": "automatic",
  "source_ids": ["lenny-ai-developer-tools", "openai-prompting"],
  "confidence": "medium",
  "last_verified": "2026-08-08"
}
```

### Isolate parallel work in branches or worktrees

```json
{
  "kind": "practice",
  "id": "isolate-parallel-work",
  "title": {"en": "Isolate parallel work", "zh": "用分支或 worktree 隔离并行工作"},
  "behavior_tags": ["subagent-use", "many-projects"],
  "signal_hints": ["subagents or parallel sessions appear", "multiple projects are active"],
  "rationale": {
    "en": "Isolated working trees keep simultaneous experiments inspectable, reversible, and less likely to overwrite one another.",
    "zh": "隔离的工作树让并行实验保持可检查、可撤销，也更不容易互相覆盖。"
  },
  "action": {
    "en": "When two coding tasks can genuinely run in parallel, give each one its own branch or worktree before starting the agents.",
    "zh": "两个任务确实可以并行时，启动 Agent 前先给它们独立的 branch 或 worktree。"
  },
  "family": "parallel-isolation",
  "match_mode": "reserve",
  "source_ids": ["lenny-journalist-ios-developer"],
  "confidence": "medium",
  "last_verified": "2026-08-08"
}
```

### Encode recurring quality as an eval

```json
{
  "kind": "practice",
  "id": "encode-quality-as-eval",
  "title": {"en": "Encode recurring quality as an eval", "zh": "把重复质量要求写成 Eval"},
  "behavior_tags": ["repeated-corrections", "high-tool-use", "verification-language"],
  "signal_hints": ["subjective correction loops recur", "many tool calls appear", "verification language appears"],
  "rationale": {
    "en": "A repeatable test or rubric gives the agent a target it can compare across iterations.",
    "zh": "可重复的测试或 rubric 能让 Agent 在多轮迭代中比较结果，而不是反复猜“更好”是什么。"
  },
  "action": {
    "en": "When the same quality correction appears again, turn it into one repeatable test, rubric item, or visual check.",
    "zh": "同一种质量纠正再次出现时，把它写成一条可重复的测试、rubric 或视觉检查。"
  },
  "family": "quality-evals",
  "match_mode": "reserve",
  "source_ids": ["lenny-braintrust-agents-evals"],
  "confidence": "medium",
  "last_verified": "2026-08-08"
}
```

### Manage many agents with explicit state

```json
{
  "kind": "practice",
  "id": "explicit-agent-state",
  "title": {"en": "Give every agent explicit state", "zh": "给每个 Agent 明确状态和交付条件"},
  "behavior_tags": ["subagent-use", "continuation-loops", "high-tool-use"],
  "signal_hints": ["many subagents appear", "status checks recur", "tool activity is high"],
  "rationale": {
    "en": "Ownership, completion conditions, and a failure next step make parallel work easier to coordinate than a stream of status prompts.",
    "zh": "负责人、完成条件和失败后的下一步，比不断追问状态更容易协调并行工作。"
  },
  "action": {
    "en": "For each parallel agent, name the owner, expected output, done condition, and what to return when blocked.",
    "zh": "给每个并行 Agent 写清负责人、输出、完成条件，以及遇阻时要返回什么。"
  },
  "family": "orchestration",
  "match_mode": "reserve",
  "source_ids": ["lenny-autonomous-coding-agents", "anthropic-claude-code-subagents"],
  "confidence": "medium",
  "last_verified": "2026-08-08"
}
```

### Pair a builder with a focused reviewer

```json
{
  "kind": "practice",
  "id": "builder-reviewer-pair",
  "title": {"en": "Pair a builder with a focused reviewer", "zh": "让 Builder 和 Reviewer 分工"},
  "behavior_tags": ["subagent-use", "long-runs", "verification-language"],
  "signal_hints": ["subagents appear", "large autonomous runs recur", "review language appears"],
  "rationale": {
    "en": "A reviewer with a narrow checklist can catch requirement gaps without turning two agents into an open-ended debate.",
    "zh": "带着明确检查范围的 Reviewer 能发现需求缺口，又不会让两个 Agent 陷入泛泛讨论。"
  },
  "action": {
    "en": "After a consequential implementation, give a fresh reviewer only the acceptance criteria and final diff to inspect.",
    "zh": "重要实现完成后，给一个新 Reviewer 只看验收条件和最终 diff。"
  },
  "family": "review-isolation",
  "match_mode": "reserve",
  "source_ids": ["lenny-journalist-ios-developer", "lenny-ai-developer-tools"],
  "confidence": "medium",
  "last_verified": "2026-08-08"
}
```

### Repair the harness, not just the wording

```json
{
  "kind": "practice",
  "id": "repair-the-harness-not-the-prompt",
  "title": {"en": "Repair the harness, not just the wording", "zh": "反复失败时先补环境能力"},
  "behavior_tags": ["repeated-corrections", "high-tool-use", "general"],
  "signal_hints": ["strong retry language recurs", "tool activity is high", "the same workflow may need a reusable capability"],
  "rationale": {
    "en": "A repeated failure can point to a missing tool, abstraction, document, or enforceable constraint rather than a weak sentence in the prompt.",
    "zh": "反复失败有时说明缺的是工具、结构、文档或可执行约束，而不只是 Prompt 换一种说法。"
  },
  "action": {
    "en": "If the same failure returns, identify one missing capability in the environment before asking the agent to try again.",
    "zh": "同一种失败再次出现时，先找出环境里缺少的一项能力，再让 Agent 重试。"
  },
  "family": "agent-harness",
  "match_mode": "automatic",
  "source_ids": ["openai-harness-engineering"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Make runtime signals directly readable

```json
{
  "kind": "practice",
  "id": "make-runtime-signals-agent-readable",
  "title": {"en": "Make runtime signals directly readable", "zh": "让 Agent 直接读取运行信号"},
  "behavior_tags": ["browser-work", "high-tool-use", "long-runs"],
  "signal_hints": ["browser work appears", "tool activity is high", "runs are long"],
  "rationale": {
    "en": "Direct access to UI state, logs, metrics, and traces removes a lossy human copy-and-paste step from debugging.",
    "zh": "让 Agent 直接看到 UI、日志、指标和 trace，可以减少人工转述造成的信息损失。"
  },
  "action": {
    "en": "For runtime-heavy work, expose one agent-readable path to the current UI and diagnostic signals.",
    "zh": "涉及运行时问题时，提供一个让 Agent 能直接读取当前 UI 和诊断信号的入口。"
  },
  "family": "runtime-observability",
  "match_mode": "automatic",
  "source_ids": ["openai-harness-engineering", "anthropic-claude-code-best-practices"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Use the repository instruction file as a map

```json
{
  "kind": "practice",
  "id": "use-agents-file-as-a-map",
  "title": {"en": "Use the instruction file as a map", "zh": "让入口说明成为目录，而不是百科全书"},
  "behavior_tags": ["many-projects", "long-runs", "general"],
  "signal_hints": ["many projects appear", "long sessions recur", "instruction-file size is not currently measured"],
  "rationale": {
    "en": "A concise entry file can route the agent to maintained architecture, product, and workflow documents without preloading everything.",
    "zh": "简短的入口文件可以把 Agent 引向持续维护的架构、产品和工作流文档，而不用一开始塞进全部内容。"
  },
  "action": {
    "en": "Keep AGENTS.md or CLAUDE.md as a short map to deeper repository-owned sources of truth.",
    "zh": "把 AGENTS.md 或 CLAUDE.md 保持为一份指向仓库内深层事实源的简短地图。"
  },
  "family": "instruction-architecture",
  "match_mode": "reserve",
  "source_ids": ["openai-harness-engineering", "openai-agents-md", "anthropic-claude-code-memory"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Version plans for work that crosses sessions

```json
{
  "kind": "practice",
  "id": "version-long-work-plans",
  "title": {"en": "Version plans for work that crosses sessions", "zh": "跨会话任务把计划写进仓库"},
  "behavior_tags": ["long-runs", "continuation-loops", "many-projects"],
  "signal_hints": ["long runs appear", "continuation language recurs", "several projects appear"],
  "rationale": {
    "en": "Versioned plans preserve decisions, progress, and known debt when a complex task outlives one context window.",
    "zh": "复杂任务超过一个上下文窗口时，版本化计划能保留决策、进度和已知技术债。"
  },
  "action": {
    "en": "For a task likely to span sessions, record its plan, progress, key decisions, and known debt in the repository.",
    "zh": "预计会跨会话的任务，把计划、进度、关键决策和已知技术债记录在仓库里。"
  },
  "family": "plan-persistence",
  "match_mode": "automatic",
  "source_ids": ["openai-harness-engineering"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Turn stable architecture rules into executable checks

```json
{
  "kind": "practice",
  "id": "turn-architecture-rules-into-lints",
  "title": {"en": "Turn architecture rules into executable checks", "zh": "把稳定架构约束变成可执行检查"},
  "behavior_tags": ["repeated-corrections", "verification-language", "many-projects"],
  "signal_hints": ["architecture violations are not currently measured", "verification language appears", "many projects appear"],
  "rationale": {
    "en": "Stable non-negotiable boundaries are easier for agents to follow when CI or linting can detect and explain violations.",
    "zh": "稳定且不能违反的边界，如果能被 CI 或 lint 检测并解释，Agent 更容易持续遵守。"
  },
  "action": {
    "en": "When the same architecture rule matters repeatedly, encode it as a focused lint or structural test with a useful remediation message.",
    "zh": "同一条架构规则反复重要时，把它写成聚焦的 lint 或结构测试，并给出可操作的修复提示。"
  },
  "family": "architecture-enforcement",
  "match_mode": "reserve",
  "source_ids": ["openai-harness-engineering"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Write issues that an agent can act on

```json
{
  "kind": "practice",
  "id": "write-agent-ready-issues",
  "title": {"en": "Write issues that an agent can act on", "zh": "把 Issue 写成 Agent 可执行的任务"},
  "behavior_tags": ["short-prompts", "repeated-corrections", "general"],
  "signal_hints": ["prompts are short", "strong retry language recurs", "issue quality is not directly measured"],
  "rationale": {
    "en": "An outcome, scope, constraints, and a concrete example reduce ambiguity without dictating the implementation path.",
    "zh": "结果、范围、约束和一个具体例子能减少歧义，同时不必替 Agent 规定实现路径。"
  },
  "action": {
    "en": "For delegated work, add one concrete example that clearly distinguishes correct behavior from the bug.",
    "zh": "委派任务时，补一个能清楚区分正确行为和 Bug 的具体例子。"
  },
  "family": "task-framing",
  "match_mode": "automatic",
  "source_ids": ["linear-coding-sessions", "openai-prompting"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Narrow an investigation one step at a time

```json
{
  "kind": "practice",
  "id": "reduce-work-to-targeted-steps",
  "title": {"en": "Narrow an investigation one step at a time", "zh": "让每一步调查缩小下一步范围"},
  "behavior_tags": ["high-tool-use", "long-runs", "many-projects"],
  "signal_hints": ["tool activity is high", "runs are long", "several projects appear"],
  "rationale": {
    "en": "Small targeted evidence-gathering steps keep cross-system investigations from expanding into unrelated searches.",
    "zh": "小而明确的证据收集步骤，可以防止跨系统调查扩散成大量无关搜索。"
  },
  "action": {
    "en": "In a broad investigation, make each step answer one question that narrows where the next step should look.",
    "zh": "调查范围很大时，让每一步只回答一个问题，并用答案缩小下一步的搜索范围。"
  },
  "family": "investigation-scope",
  "match_mode": "automatic",
  "source_ids": ["linear-agent-at-linear", "openai-harness-engineering"],
  "confidence": "medium",
  "last_verified": "2026-08-08"
}
```

### Give the agent one tail-able log

```json
{
  "kind": "practice",
  "id": "give-agents-one-tail-able-log",
  "title": {"en": "Give the agent one tail-able log", "zh": "给 Agent 一个统一可追踪的日志入口"},
  "behavior_tags": ["high-tool-use", "browser-work", "long-runs"],
  "signal_hints": ["tool activity is high", "browser work appears", "runs are long"],
  "rationale": {
    "en": "One recent, queryable stream reduces tool switching and preserves the sequence between frontend and backend failures.",
    "zh": "一个可查询的近期日志流能减少工具切换，并保留前后端故障发生的顺序。"
  },
  "action": {
    "en": "Route the relevant browser and service logs to one command that returns the latest useful lines.",
    "zh": "把相关浏览器和服务日志汇总到一个能返回近期有效内容的命令。"
  },
  "family": "runtime-observability",
  "match_mode": "automatic",
  "source_ids": ["armin-agentic-coding", "openai-harness-engineering"],
  "confidence": "medium",
  "last_verified": "2026-08-08"
}
```

### Make tool failures actionable

```json
{
  "kind": "practice",
  "id": "make-tool-errors-actionable",
  "title": {"en": "Make tool failures actionable", "zh": "让工具错误告诉 Agent 下一步怎么做"},
  "behavior_tags": ["high-tool-use", "repeated-corrections", "general"],
  "signal_hints": ["tool activity is high", "strong retry language recurs", "error quality is not measured"],
  "rationale": {
    "en": "Specific recoverable errors help an agent correct the call instead of repeating a command without new information.",
    "zh": "明确、可恢复的错误能让 Agent 修正调用，而不是在没有新信息时重复同一命令。"
  },
  "action": {
    "en": "For agent-facing scripts, make failures state what was wrong and one safe next action.",
    "zh": "面向 Agent 的脚本失败时，说明哪里错了，并给出一个安全的下一步。"
  },
  "family": "tool-design",
  "match_mode": "reserve",
  "source_ids": ["armin-agentic-coding", "openai-harness-engineering"],
  "confidence": "medium",
  "last_verified": "2026-08-08"
}
```

### Review before requesting review

```json
{
  "kind": "practice",
  "id": "review-before-you-request-review",
  "title": {"en": "Review before requesting review", "zh": "交给同事前先自己验证"},
  "behavior_tags": ["long-runs", "verification-language", "high-tool-use"],
  "signal_hints": ["runs are long", "verification language appears", "tool activity is high"],
  "rationale": {
    "en": "The person submitting agent-generated work remains responsible for its scope, correctness, and review evidence.",
    "zh": "提交 Agent 生成改动的人，仍然需要对范围、正确性和审查证据负责。"
  },
  "action": {
    "en": "Before handing off a generated change, inspect the final diff and attach the tests or manual checks you ran.",
    "zh": "交付生成的改动前，检查最终 diff，并附上你实际运行的测试或人工检查。"
  },
  "family": "review-accountability",
  "match_mode": "automatic",
  "source_ids": ["simon-agentic-patterns", "openai-code-review"],
  "confidence": "medium",
  "last_verified": "2026-08-08"
}
```

### Scope the review before it starts

```json
{
  "kind": "practice",
  "id": "scope-a-read-only-review",
  "title": {"en": "Scope the review before it starts", "zh": "审查前先明确 diff 和关注点"},
  "behavior_tags": ["verification-language", "long-runs", "subagent-use"],
  "signal_hints": ["verification language appears", "runs are long", "subagents appear"],
  "rationale": {
    "en": "A fresh read-only pass is more useful when it knows the exact diff and whether correctness, security, tests, or performance matters most.",
    "zh": "新的只读审查如果知道确切 diff，以及优先关注正确性、安全、测试还是性能，会更有效。"
  },
  "action": {
    "en": "Before committing a consequential change, give a read-only reviewer the exact diff and one primary review criterion.",
    "zh": "重要改动提交前，把确切 diff 和一个主要审查标准交给只读 Reviewer。"
  },
  "family": "review-scope",
  "match_mode": "automatic",
  "source_ids": ["openai-code-review"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Keep approval rules narrow and tested

```json
{
  "kind": "practice",
  "id": "keep-approval-rules-narrow",
  "title": {"en": "Keep approval rules narrow and tested", "zh": "审批规则要窄，并测试正反例"},
  "behavior_tags": ["high-tool-use", "general"],
  "signal_hints": ["tool activity is high", "approval prompts and rule breadth are not measured"],
  "rationale": {
    "en": "A narrow command prefix reduces repeated approval friction without turning a convenience rule into broad shell authority.",
    "zh": "窄范围命令前缀可以减少重复审批，又不会把便利规则变成过宽的 Shell 权限。"
  },
  "action": {
    "en": "For a recurring trusted command, write the narrowest prefix rule and test one command it must match and one it must reject.",
    "zh": "对反复出现的可信命令，写最窄的 prefix rule，并测试一个应匹配和一个应拒绝的命令。"
  },
  "family": "approval-security",
  "match_mode": "reserve",
  "source_ids": ["openai-rules"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Version stable checks in CI

```json
{
  "kind": "practice",
  "id": "version-stable-agent-checks-in-ci",
  "title": {"en": "Version stable checks in CI", "zh": "把稳定检查做成版本化 CI Prompt"},
  "behavior_tags": ["verification-language", "high-tool-use", "many-projects"],
  "signal_hints": ["verification language appears", "tool activity is high", "many projects appear"],
  "rationale": {
    "en": "A reviewed prompt stored with the code can turn repeated release or review work into an auditable, least-privilege check.",
    "zh": "经过审查并随代码保存的 Prompt，可以把重复发布或审查工作变成可追踪、最小权限的检查。"
  },
  "action": {
    "en": "When a review or release check has stabilized, store its prompt in the repository and run it in CI with read-only permissions first.",
    "zh": "当审查或发布检查已经稳定，把 Prompt 存进仓库，并先用只读权限在 CI 中运行。"
  },
  "family": "ci-automation",
  "match_mode": "automatic",
  "source_ids": ["openai-github-action"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Package stable repeated workflows as Skills

```json
{
  "kind": "practice",
  "id": "package-stable-workflows-as-skills",
  "title": {"en": "Package stable workflows as Skills", "zh": "稳定重复流程再封装成 Skill"},
  "behavior_tags": ["many-projects", "repeated-corrections", "general"],
  "signal_hints": ["many projects appear", "strong retry language recurs", "workflow repetition is not directly measured"],
  "rationale": {
    "en": "A reusable Skill keeps a proven workflow available on demand without copying the same instructions into every prompt.",
    "zh": "可复用 Skill 能按需提供已经验证的流程，而不用每次把同一套说明复制进 Prompt。"
  },
  "action": {
    "en": "After a workflow succeeds repeatedly, move its stable instructions, references, and checks into a narrowly described Skill.",
    "zh": "同一流程多次成功后，把稳定的说明、参考和检查封装进描述准确的 Skill。"
  },
  "family": "reusable-workflows",
  "match_mode": "reserve",
  "source_ids": ["openai-build-skills"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Separate setup from agent execution

```json
{
  "kind": "practice",
  "id": "separate-setup-from-agent-execution",
  "title": {"en": "Separate setup from agent execution", "zh": "把依赖安装和 Agent 执行分开"},
  "behavior_tags": ["high-tool-use", "long-runs", "general"],
  "signal_hints": ["tool activity is high", "runs are long", "network and secret exposure are not measured"],
  "rationale": {
    "en": "Dependency installation may need network and credentials, while implementation work can usually run with a narrower boundary.",
    "zh": "安装依赖可能需要网络和凭据，而真正执行实现通常可以在更窄的边界内完成。"
  },
  "action": {
    "en": "In automated environments, finish dependency setup first, then remove secrets and restrict network access before the agent phase.",
    "zh": "自动化环境中先完成依赖安装，再移除 Secrets 并限制网络后进入 Agent 执行阶段。"
  },
  "family": "execution-security",
  "match_mode": "reserve",
  "source_ids": ["openai-agent-security"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Move deterministic reminders into hooks

```json
{
  "kind": "practice",
  "id": "move-deterministic-checks-into-hooks",
  "title": {"en": "Move deterministic checks into hooks", "zh": "把确定性提醒变成 Hook"},
  "behavior_tags": ["repeated-corrections", "verification-language", "high-tool-use"],
  "signal_hints": ["strong retry language recurs", "verification language appears", "hook usage is not measured"],
  "rationale": {
    "en": "Formatting, linting, and fixed checks are more reliable as deterministic lifecycle actions than as prose reminders.",
    "zh": "格式化、lint 和固定检查作为确定性的生命周期动作，比反复文字提醒更可靠。"
  },
  "action": {
    "en": "When a reminder can be decided by a script, move it to the appropriate lifecycle hook and make failures visible.",
    "zh": "当一条提醒可以由脚本确定判断时，把它移到合适的生命周期 Hook，并让失败可见。"
  },
  "family": "workflow-hooks",
  "match_mode": "reserve",
  "source_ids": ["anthropic-claude-code-hooks"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Block protected files before writes happen

```json
{
  "kind": "practice",
  "id": "protect-critical-files-before-write",
  "title": {"en": "Block protected files before writes happen", "zh": "在写入前拦截受保护文件"},
  "behavior_tags": ["high-tool-use", "many-projects", "general"],
  "signal_hints": ["tool activity is high", "many projects appear", "protected-file attempts are not measured"],
  "rationale": {
    "en": "Pre-execution controls can stop accidental changes to secrets, generated files, lockfiles, or critical configuration before damage occurs.",
    "zh": "执行前控制可以在损害发生前，阻止对密钥、生成物、Lockfile 或关键配置的意外修改。"
  },
  "action": {
    "en": "For truly protected paths, add a tested deny rule or pre-tool hook that blocks the write before execution.",
    "zh": "对真正受保护的路径，添加经过测试的 Deny 规则或 PreToolUse Hook，在执行前阻止写入。"
  },
  "family": "protected-files",
  "match_mode": "reserve",
  "source_ids": ["anthropic-claude-code-hooks", "anthropic-claude-code-permissions"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Treat MCP servers as third-party dependencies

```json
{
  "kind": "practice",
  "id": "vet-and-scope-mcp-servers",
  "title": {"en": "Vet and scope MCP servers", "zh": "把 MCP Server 当第三方依赖审查"},
  "behavior_tags": ["high-tool-use", "many-projects", "general"],
  "signal_hints": ["tool activity is high", "many projects appear", "MCP inventory is not measured"],
  "rationale": {
    "en": "An MCP server expands the trusted code, provider, data, and future update surface of the agent environment.",
    "zh": "MCP Server 会扩大 Agent 环境所信任的代码、提供方、数据和后续更新范围。"
  },
  "action": {
    "en": "Connect only reviewed MCP servers, grant the narrowest tool permissions, and revoke authorization when the integration is no longer used.",
    "zh": "只连接经过审核的 MCP Server，授予最窄工具权限，并在不再使用时撤销授权。"
  },
  "family": "mcp-security",
  "match_mode": "reserve",
  "source_ids": ["anthropic-claude-code-security", "anthropic-claude-code-mcp"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Filter large tool output before context

```json
{
  "kind": "practice",
  "id": "filter-large-tool-output",
  "title": {"en": "Filter large tool output before context", "zh": "大型工具输出先过滤再进上下文"},
  "behavior_tags": ["high-tool-use", "long-runs", "continuation-loops"],
  "signal_hints": ["tool activity is high", "runs are long", "continuation language appears"],
  "rationale": {
    "en": "Errors, warnings, and nearby context are usually a more useful first pass than thousands of unrelated log lines.",
    "zh": "错误、警告及其附近上下文，通常比几千行无关日志更适合作为第一轮信息。"
  },
  "action": {
    "en": "Before sending a large build or test log, extract errors, warnings, and enough neighboring lines to preserve the failure sequence.",
    "zh": "大型构建或测试日志进入上下文前，先提取错误、警告和足够的相邻行以保留故障顺序。"
  },
  "family": "tool-output",
  "match_mode": "automatic",
  "source_ids": ["anthropic-claude-code-costs"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

### Prefer symbol navigation in typed projects

```json
{
  "kind": "practice",
  "id": "prefer-symbol-navigation",
  "title": {"en": "Prefer symbol navigation in typed projects", "zh": "类型化项目优先使用符号导航"},
  "behavior_tags": ["high-tool-use", "many-projects", "long-runs"],
  "signal_hints": ["tool activity is high", "many projects appear", "text search versus symbol navigation is not measured"],
  "rationale": {
    "en": "Definitions, references, and type errors can answer many code-navigation questions without repeatedly reading broad files or search results.",
    "zh": "定义、引用和类型错误可以直接回答许多代码导航问题，减少反复读取大文件或广泛搜索结果。"
  },
  "action": {
    "en": "In a supported typed project, try definitions, references, and type diagnostics before broad repository text searches.",
    "zh": "在支持的类型化项目中，先尝试定义、引用和类型诊断，再做全仓库文本搜索。"
  },
  "family": "code-navigation",
  "match_mode": "reserve",
  "source_ids": ["anthropic-claude-code-costs"],
  "confidence": "high",
  "last_verified": "2026-08-08"
}
```

## Behavior tags

The matcher may emit only these aggregate-safe tags:

- `short-prompts`
- `repeated-corrections`
- `continuation-loops`
- `long-runs`
- `subagent-use`
- `high-tool-use`
- `browser-work`
- `verification-language`
- `plan-use`
- `low-plan-use`
- `many-projects`
- `general`

These tags describe observable aggregate patterns, not skill, quality, intent,
or productivity. A missing tag is not proof that the opposite behavior exists.
They provide relevant context for conditional advice; they are never proof that
the user failed to follow a practice.
