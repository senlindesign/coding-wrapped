# Coding Wrapped Skill 行业规范对照

更新日期：2026-07-28

## 结论

Coding Wrapped 已达到可内部试用和小范围开源测试的标准：开放 Skill
格式、跨 Claude Code / Codex 的目录兼容、渐进加载、确定性脚本、隐私
边界、失败降级和本地网站都已进入自动化验收。

还不能把它标成“所有模型都验证完成”。真正的触发质量需要把同一组
prompt 放进全新的 Claude Haiku、Sonnet、Opus 和 Codex 会话，观察模型
是否主动加载 Skill、是否误触发，以及缺少输入时是否只问必要问题。

## 当前高质量 Skill 的共同标准

### 1. 用 description 做可靠发现

- 同时写清“做什么”和“什么时候使用”。
- 使用用户真实会说的关键词。
- 用第三人称，避免宽泛的 `helper` / `utils` 式描述。
- 除了直接点名，还要测试间接表达和不应触发的相似词。

Coding Wrapped 的 description 已前置 `Coding Wrapped`、`Claude Code`、
`Codex`、`localhost`、行为洞察、生成新卡片和导出等触发语。

### 2. 使用开放格式的最小共同子集

- 根目录名与 `name` 相同。
- `SKILL.md` frontmatter 至少有 `name` 和 `description`。
- Claude Code 与 Codex 都基于 Agent Skills 开放格式，但各自会增加可选
  元数据。

开放规范允许 `compatibility`，但当前 Codex 自带快速校验器不接受它。
因此本项目把运行要求放在正文，frontmatter 只保留两个共同字段，避免
“规范上合法、平台校验失败”。

### 3. 渐进加载，避免把上下文塞满

- `SKILL.md` 保持在 500 行以内。
- 细节放在按需读取的 references。
- 所有 reference 从 `SKILL.md` 直接链接，避免多层跳转。
- 确定性的脆弱操作交给脚本，不让模型每次临时重写。

当前 `SKILL.md` 为 189 行，直接连接三份任务相关 reference；扫描、
持久化、导出和本地服务均使用标准库脚本。

### 4. 给脚本明确的输入、输出和验证循环

- 不使用没有来由的 magic number。
- 缺少依赖、数据源或输出不合法时给出明确错误。
- 关键操作执行“生成 → 校验 → 持久化”。
- 不假设额外包已经安装。

Coding Wrapped 使用 Python 3.9 标准库，不需要 pip 安装；会拒绝不是
四条的批次、重复构图、未知来源 ID 和不完整的单语言文案。

### 5. 隐私是硬边界，不只是 prompt 提醒

- 扫描脚本不发网络请求。
- 模型只能看到字段白名单内的汇总值。
- 任意短提示词、路径、邮箱、URL、密钥和项目名不能进入 brief、API 或
  导出包。
- 本地服务默认只绑定 `127.0.0.1`。

本次审计删除了任意重复短提示词，只保留批准词组的计数；同时增加旧版
metrics 的白名单清洗，避免用户未重新扫描时遗留字段进入后续流程。

### 6. 评测覆盖触发、行为和产物

Anthropic 建议至少三个 eval，并在计划支持的不同模型上测试。OpenAI
建议覆盖直接触发、间接触发、缺失输入、不应触发和边缘情况。

本项目定义 10 个激活场景，并执行 15 个自动化检查：

- Skill 元数据和渐进加载；
- Claude + Codex 双源扫描；
- 单源和无源降级；
- 7 天、30 天和真正的全部记录；
- 时区自动检测与覆盖；
- 模型 brief 隐私；
- 四条洞察替换、追加与非法批次拒绝；
- Coding Overview 来源校验；
- 导出包无 transcript / 私密标记；
- fresh-copy 编译与扫描；
- loopback 本地 API。

当前自动结果：**15 / 15 通过**。

## 发布方式建议

第一阶段继续发布开放 Skill 源目录，让用户复制到：

- Codex：`~/.agents/skills/coding-wrapped/`
- Claude Code：`~/.claude/skills/coding-wrapped/`

面向社区分发时，再在同一仓库外层增加 Claude 与 Codex 的 plugin
manifest 和安装说明。Skill 核心保持一份，平台 adapter 分开，避免两份
逻辑逐渐漂移。

## 官方依据

- [OpenAI — Build skills](https://learn.chatgpt.com/docs/build-skills)
- [OpenAI — Skills in plugins](https://developers.openai.com/plugins/build/skills)
- [Anthropic — Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Claude Code — Extend Claude with skills](https://code.claude.com/docs/en/slash-commands)
- [Agent Skills specification](https://agentskills.io/specification)
