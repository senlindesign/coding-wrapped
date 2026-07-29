# Coding Wrapped

[![适用于 Claude Code](https://img.shields.io/badge/Made_for-Claude_Code-7C3AED?style=flat-square&labelColor=555555)](#claude-code-和-codex一条命令)
[![适用于 Codex](https://img.shields.io/badge/Made_for-Codex-0F766E?style=flat-square&labelColor=555555)](#claude-code-和-codex一条命令)
[![格式：Agent Skill](https://img.shields.io/badge/Format-Agent_Skill-EA580C?style=flat-square&labelColor=555555)](skills/coding-wrapped/SKILL.md)
[![许可证：MIT](https://img.shields.io/badge/License-MIT-65A30D?style=flat-square&labelColor=555555)](LICENSE)

**你的 Coding Agent，其实记得很多。**

Coding Wrapped 会读取本地的 Claude Code 和 Codex 记录，把你与 AI
一起工作的方式做成一个私密的像素风 Dashboard：你通常什么时候写代码，
怎样下指令，Agent 如何回应，以及你正在形成什么样的协作风格。

[English](README.md)

![Coding Wrapped Dashboard](docs/images/dashboard.png)

## 它会生成什么

- 一组事实数据：活跃天数、会话数、项目数、模型使用、工具使用、提示词
  节奏和最长连续工作时间。
- 一段简短的 **Coding 总览**，解释你的整体协作习惯。
- 多张有趣的洞察：**你怎么做 / Agent 如何回应 / 你的风格**，再加一条
  有依据的轻建议。
- 每次生成四条洞察，每张都是不同构图的像素插画，并会保存在本地。
- 一个可以归档或主动分享的本地导出包。

它**不是**原始对话浏览器、生产力评分、员工监控工具或云端分析服务。

![四种不同构图的 Coding Wrapped 插画](docs/images/insights.jpg)

## 安装

### Claude Code 和 Codex：一条命令

```bash
npx skills add senlindesign/coding-wrapped \
  --skill coding-wrapped \
  --agent claude-code \
  --agent codex \
  --global
```

两个平台读取的是同一份开放 Agent Skill，不需要维护两套逻辑。

### Claude Code 插件市场

```text
/plugin marketplace add https://github.com/senlindesign/coding-wrapped
/plugin install coding-wrapped@coding-wrapped
```

### 手动安装

Clone 仓库，再把 `skills/coding-wrapped` 复制到以下一个或两个目录：

```text
~/.claude/skills/coding-wrapped
~/.agents/skills/coding-wrapped
```

## 使用

打开一个新的 Agent 对话，直接说：

```text
读取我本地的 Claude Code 和 Codex 记录，生成我的 Coding Wrapped。
```

Skill 会根据这句话自动确定界面语言。正常首次运行最多只会确认昵称，以及
在你没有明确要求扫描时确认一次读取权限。

接下来它会：

1. 扫描标准的 Claude Code 和 Codex 本地会话目录；
2. 只保存安全的汇总指标；
3. 生成 Coding 总览和四条洞察；
4. 在 `http://127.0.0.1:4173/` 打开 Dashboard；
5. 给出一份很短的使用说明。

之后可以继续说：

```text
只刷新事实数据，不要改变洞察。
根据本月数据再生成四条新洞察。
导出我的 Coding Wrapped。
```

## 哪些内容留在本地

扫描器会读取你电脑上的标准会话目录，但生成后的状态不会包含原始对话、
源代码、项目名、本地路径、邮箱、URL 或密钥。网站只监听本机回环地址。
完整边界见 [PRIVACY.md](PRIVACY.md)。

## 仓库结构

| 路径 | 作用 | 何时读取 |
| --- | --- | --- |
| `skills/coding-wrapped/SKILL.md` | 核心流程与硬规则 | Skill 被触发时 |
| `skills/coding-wrapped/references/` | 隐私、数据、文案和视觉规范 | 对应阶段才读取 |
| `skills/coding-wrapped/scripts/` | 扫描、持久化、本地服务和导出 | 按需执行 |
| `skills/coding-wrapped/assets/` | 离线网站、字体和后备插画 | 初始化本地状态时 |
| `.claude-plugin/` | Claude Code 插件与市场清单 | 仅安装时 |
| `.codex-plugin/` | Codex 插件清单 | 仅安装时 |
| `evals/` | 合成隐私与行为测试 | 开发和发布时 |

仓库里只有一份核心 Skill。Claude Code 和 Codex 的清单只是很薄的平台
适配层，避免两个版本逐渐走向不同的产品。

## 验证与打包

唯一运行要求是 Python 3.9+。

```bash
make validate
make package
```

`make validate` 会校验两个平台的清单、编译所有 Python 文件、运行 Skill
评测并检查发布结构。`make package` 会生成
`dist/coding-wrapped.skill`。

## 五条设计原则

1. **本地优先。** 最个人的 Coding 数据不应该先注册一个云端服务。
2. **先有事实，再讲故事。** 每条有趣洞察都必须能回到汇总数据。
3. **有趣优先，不做评判。** 目标是让用户认出自己，不是给用户打分。
4. **先给东西看，不先做问卷。** 先生成一个有用的版本，再让用户调整。
5. **一张地图，按需展开。** 主 Skill 保持简短，脆弱规则和可复用素材放到
   对应文件。

## 参与开发

阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，提交 Pull Request 前运行
`make validate`。

## License

[MIT](LICENSE)。内置字体的授权说明见
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
