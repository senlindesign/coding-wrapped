import { useEffect, useRef, useState } from "react";

const wrappedCards = {
  1: {
    meta: "01 / 08",
    ariaLabel: "Coding Wrapped 多代理协作卡片",
    eyebrow: "多代理协作",
    title: ["13 次开场", "67 个 Agent"],
    summary: (
      <>
        你只直接开启了 <strong>13</strong> 个主会话，
        却让 <strong>67</strong> 个子 Agent 接力工作。
      </>
    ),
    flow: "ASK → DISPATCH → REVIEW",
    image: "/assets/agent-fleet.png",
    imageAlt: "一位使用者通过任务中枢协调许多 AI Agent 工作站",
    facts: [
      ["你怎么开始", "一次对话，先把问题交给主 Agent。"],
      ["它怎么扩散", "研究、实现和检查，被继续拆给更多子 Agent。"],
      ["这说明什么", "你更像在编排一支临时团队，而不是单纯聊天。"],
    ],
    advice: "给每个子 Agent 固定交付格式，最后会更容易合并结果。",
  },
  2: {
    meta: "02 / 08",
    ariaLabel: "Coding Wrapped 短句指挥官卡片",
    eyebrow: "短句指挥官",
    title: ["49% 消息", "不到 50 字"],
    summary: (
      <>
        你发出的 <strong>111</strong> 条消息里，
        有 <strong>54</strong> 条不到 50 个字。
      </>
    ),
    flow: "SAY LESS → LET IT EXPAND",
    image: "/assets/short-prompt-expansion.png",
    imageAlt: "一条很短的指令经过展开装置变成一整套 AI 工作系统",
    facts: [
      ["你怎么说", "先给一小句方向，再看 AI 怎么展开。"],
      ["它怎么工作", "很短的输入，往往启动一整套复杂执行。"],
      ["这说明什么", "你习惯控制方向和节奏，把展开空间留给 AI。"],
    ],
    advice: "短指令前再补一句完成标准，通常能少一次来回确认。",
  },
};

const validationCards = {
  warm: {
    lang: "zh",
    theme: "warm",
    titleScale: "compact",
    meta: "01 / 04",
    range: "最近 30 天",
    ariaLabel: "Coding Wrapped Agent 总指挥卡片",
    profileTitle: "Agent 总指挥",
    title: "13 次开场，67 个 Agent",
    subtitle: (
      <>
        你只直接开启了 <strong>13</strong> 个主会话，
        却让 <strong>67</strong> 个子 Agent 接力工作。
      </>
    ),
    rows: [
      ["你怎么做", "把问题交给主 Agent，再让任务继续往下拆。"],
      [
        "Agent 如何回应",
        "研究、实现和检查，被分给不同的子 Agent 接力完成。",
      ],
      ["你的风格", "你更像在指挥一支临时乐团，而不是独自敲代码。"],
    ],
    tipLabel: "轻建议",
    tip: "给每个子 Agent 写清角色、交付格式和验收动作，主线程只收结论。",
    tipSource: "claude-code-subagents",
    image: "/assets/agent-orchestra-warm.png",
    imageAlt: "一位站立的指挥者面对由许多 AI 机器人组成的像素乐团",
    composition: "tiered-orchestra",
  },
  blue: {
    lang: "zh",
    theme: "blue",
    meta: "02 / 04",
    range: "最近 30 天",
    ariaLabel: "Coding Wrapped 夜间长跑者中文卡片",
    profileTitle: "夜间长跑者",
    title: "160 分钟，一路做到底",
    subtitle: (
      <>
        你最长的一段活跃时间，从 <strong>22:24</strong> 开始，
        持续了 <strong>2 小时 40 分</strong>。
      </>
    ),
    rows: [
      ["你怎么做", "22:24 开始，一口气推进了 160 分钟。"],
      ["Agent 如何回应", "持续读取、修改和执行，陪你把上下文一路做深。"],
      ["你的风格", "一旦进入状态，你更愿意把一件事连续做透。"],
    ],
    tipLabel: "轻建议",
    tip: "长任务每推进一段就跑测试或截图，让进度带着验证一起前进。",
    tipSource: "claude-code-verification",
    image: "/assets/night-runner-blue.png",
    imageAlt: "夜晚，一位使用者和一个 AI 机器人通过发光进度路径持续工作",
    composition: "horizontal-night-route",
  },
  pink: {
    lang: "zh",
    theme: "pink",
    meta: "03 / 04",
    range: "最近 30 天",
    ariaLabel: "Coding Wrapped 短句指挥官卡片",
    profileTitle: "短句指挥官",
    title: "49% 消息不到 50 字",
    subtitle: (
      <>
        你发出的 <strong>111</strong> 条消息里，
        有 <strong>54</strong> 条不到 50 字。
      </>
    ),
    rows: [
      ["你怎么做", "先给一句方向，再看 Agent 怎样展开。"],
      [
        "Agent 如何回应",
        "短输入也会启动读取、拆解、修改和验证的整套流程。",
      ],
      ["你的风格", "你控制方向和节奏，把展开空间留给 AI。"],
    ],
    tipLabel: "轻建议",
    tip: "短句不用变长，只补一个文件、一个完成标准或一个验证动作。",
    tipSource: "codex-issue-style-prompts",
    image: "/assets/prompt-machine-pink.png",
    imageAlt: "一个小指令进入剖面式机器后，被机器人扩展成多道工作流程",
    composition: "vertical-cutaway-machine",
  },
  green: {
    lang: "zh",
    theme: "green",
    titleScale: "compact",
    meta: "04 / 04",
    range: "最近 30 天",
    ariaLabel: "Coding Wrapped 继续按钮本人卡片",
    profileTitle: "继续按钮本人",
    title: "8 次「继续」，一次没停",
    subtitle: (
      <>
        过去 30 天，你在 <strong>8</strong> 条消息里说过
        <strong> continue / 继续</strong>。
      </>
    ),
    rows: [
      ["你怎么做", "方向没变时，你用一句“继续”保持工作的惯性。"],
      [
        "Agent 如何回应",
        "沿着已有上下文继续读取、修改和检查，不重新开场。",
      ],
      ["你的风格", "你喜欢在同一条线上逐步校准，而不是反复重写需求。"],
    ],
    tipLabel: "轻建议",
    tip: "每次继续前让 Agent 用一行报：已完成、未验证、下一步。",
    tipSource: "trust-but-verify",
    image: "/assets/continue-steps-green.png",
    imageAlt: "一位使用者鼓励机器人沿着八段像素台阶继续向前",
    composition: "diagonal-platform-journey",
  },
  en: {
    lang: "en",
    theme: "blue",
    meta: "03 / 08",
    range: "LAST 30 DAYS",
    ariaLabel: "Coding Wrapped Night Runner English card",
    profileTitle: "NIGHT RUNNER",
    title: (
      <>
        A 160-MINUTE
        <br />
        NIGHT RUN
      </>
    ),
    subtitle: (
      <>
        Your longest active stretch started at <strong>10:24 PM</strong> and
        lasted <strong>2 hours 40 minutes</strong>.
      </>
    ),
    rows: [
      ["YOU DID", "Started at 10:24 PM and stayed active for 160 minutes."],
      [
        "AGENT DID",
        "Kept reading, editing, and running inside the same working context.",
      ],
      [
        "YOUR STYLE",
        "Once you find the thread, you prefer to follow it all the way through.",
      ],
    ],
    tipLabel: "LIGHT TIP",
    tip: "Set a finish line before a long run, so details do not pull the work off course.",
    image: "/assets/night-runner-blue.png",
    imageAlt:
      "At night, one person and one AI robot keep working along a glowing progress path",
  },
};

const stories = [
  {
    number: "01",
    title: "Agent 总指挥",
    image: "/cards/coding-wrapped-style-01-warm.png",
    download: "coding-wrapped-style-01-warm.png",
  },
  {
    number: "02",
    title: "夜间长跑者",
    image: "/cards/coding-wrapped-style-02-blue.png",
    download: "coding-wrapped-style-02-blue.png",
  },
  {
    number: "03",
    title: "短句指挥官",
    image: "/cards/coding-wrapped-style-03-pink.png",
    download: "coding-wrapped-style-03-pink.png",
  },
  {
    number: "04",
    title: "继续按钮本人",
    image: "/cards/coding-wrapped-style-04-green.png",
    download: "coding-wrapped-style-04-green.png",
  },
];

const dashboardRanges = ["7d", "30d", "all"];

const dashboardCopy = {
  zh: {
    brand: "编程回顾",
    privacy: "本地 / 私人",
    greeting: "你好，SEN",
    activeProjectSummary: (days, projects) =>
      `${days} 个活跃日 · ${projects} 个项目`,
    range: { "7d": "7天", "30d": "30天", all: "全部" },
    rangeAria: "选择数据范围",
    languageAria: "切换界面语言",
    lastUpdated: "最后更新",
    notUpdated: "尚未更新",
    update: "扫描事实数据",
    updating: "扫描中…",
    dashboardAria: "Coding Wrapped 个人数据面板",
    metricsAria: "编程数据概览",
    activeDays: "活跃日历",
    activeDaysValue: (days) => `${days} 天`,
    activityWindow: (days) => `最近 ${days} 天`,
    less: "少",
    more: "多",
    messagesOnDate: (date, messages) => `${date}，${messages} 条消息`,
    sessions: "主会话",
    sessionsNote: "你直接开启的对话",
    projects: "项目",
    projectsNote: "仅显示数量",
    messages: "你的消息",
    messagesNote: (chars) => `消息长度中位数 ${chars} 字`,
    agentRuns: "智能体运行",
    agentRunsNote: (subagents) => `包含 ${subagents} 个子智能体`,
    longestRun: "最长连续工作",
    minutes: "分钟",
    buildRhythm: "你的工作节奏",
    buildRhythmNote: "最常开始工作的时间",
    toolMix: "智能体工具使用",
    tokenUsage: "模型用量",
    tokenVerified: "已记录 · 含上下文与缓存",
    tokenMissing: "未记录",
    output: "输出",
    cached: "缓存",
    insightTitle: "编程洞察",
    insightEvidence: "界面文字 · 本地数据",
    logTitle: (name) => `${name} 的编程冒险日志`,
    logSubtitle: "看看你和 AI 是怎样一起把事情做出来的。",
    collection: "洞察卡组",
    collectionNote: "选择一张卡，查看本期故事",
    currentInsight: "本期洞察",
    insightBasedOn: (date) => `基于 ${date} 的本地数据`,
    generateInsight: "生成新洞察",
    generatingInsight: "生成中…",
    insightGenerator: "洞察生成器",
    generateDialogTitle: "生成 4 条新洞察？",
    generateDialogBody: "会分析新增记录，并一次向卡组追加 4 条新洞察。",
    tokenCostTitle: "TOKEN",
    tokenCostCopy: "会使用你连接的模型额度",
    waitTitle: "等待",
    waitCopy: "通常约 1–3 分钟",
    cancelGeneration: "先不生成",
    confirmGeneration: "使用 Token 生成 4 条",
    generationComplete: "已新增 4 条洞察",
    generationFailed: "生成失败，请稍后再试",
    swipeInsight: "左右滑动切换洞察",
    periodStats: "本期数据",
    periodStatsNote: "时间范围只影响下面的事实数据",
    customize: "自定义",
    closeCustomize: "完成",
    metricPicker: "选择显示的数据",
    metricPickerCount: (count) => `已显示 ${count} / 8`,
    recentActivity: "最近活动",
    metricActive: "活跃天数",
    metricProjects: "运行项目",
    metricLongest: "最长连续工作",
    metricTokens: "模型用量",
    metricSessions: "主会话",
    metricSubagents: "子智能体",
    metricMessages: "你的消息",
    metricPrompt: "消息长度中位数",
    projectUnit: "个项目",
    minuteUnit: "分钟",
    tokenNote: "包含上下文和缓存读取",
    sessionUnit: "次会话",
    subagentUnit: "个子智能体",
    messageUnit: "条消息",
    characterUnit: "字",
    dataMethod: "这些数字怎么算？",
    dataMethodCopy:
      "活跃天数按主会话中发送过消息的本地日期去重；项目数按工作目录匿名去重；最长连续工作把同一主会话中间隔不超过 45 分钟的事件视为一段；模型用量汇总会话记录的处理总量，包含上下文与缓存。",
    prev: "上一条",
    next: "下一条",
    lightTip: "轻建议",
    rawPrivacy: "原始对话不会进入这个页面",
    overviewRecommendations: "本期可以试试",
    overviewSources: "参考",
    overviewSourceLabels: {
      "claude-code-best-practices": "Claude Code 最佳实践",
      "claude-code-subagents": "Subagents",
      "openai-how-we-use-codex": "Codex 实践",
      "openai-introducing-codex": "Codex 介绍",
    },
    overviewUpdated: (date) => `生成于 ${date}`,
    overviewCadence: "每周自动检查 · 新增 3 个会话或 20 条消息后更新",
    overviewCheckState: {
      fresh: "本周已检查",
      eligible: "总览已自动更新",
      "insufficient-new-data": "新增数据不足 · 沿用当前总览",
    },
    overviewState: {
      loading: "正在整理本地行为模式",
      ready: "本地总览已就绪",
      stale: "等待下次定期更新",
      updating: "正在更新总览",
      error: "暂时无法读取总览",
    },
    status: {
      loading: "正在读取本地快照",
      scanning: "正在扫描全部本地会话",
      calculating: "正在计算指标",
      ready: "本地数据已就绪",
      updated: "全部时间范围已更新",
      error: "更新失败 · 已保留上次快照",
    },
    weekday: {
      Monday: "周一",
      Tuesday: "周二",
      Wednesday: "周三",
      Thursday: "周四",
      Friday: "周五",
      Saturday: "周六",
      Sunday: "周日",
    },
    toolNames: {
      shell: "终端",
      other: "其他",
      edit: "编辑",
      read: "读取",
    },
  },
  en: {
    brand: "CODING WRAPPED",
    privacy: "PERSONAL / LOCAL",
    greeting: "HI, SEN",
    activeProjectSummary: (days, projects) =>
      `${days} ACTIVE DAYS · ${projects} PROJECTS`,
    range: { "7d": "7D", "30d": "30D", all: "ALL" },
    rangeAria: "Choose data range",
    languageAria: "Switch interface language",
    lastUpdated: "LAST UPDATED",
    notUpdated: "NOT UPDATED",
    update: "SCAN FACT DATA",
    updating: "SCANNING…",
    dashboardAria: "Coding Wrapped personal dashboard",
    metricsAria: "Coding data overview",
    activeDays: "ACTIVITY CALENDAR",
    activeDaysValue: (days) => `${days} DAYS`,
    activityWindow: (days) => `LAST ${days} DAYS`,
    less: "LESS",
    more: "MORE",
    messagesOnDate: (date, messages) => `${date}, ${messages} messages`,
    sessions: "MAIN SESSIONS",
    sessionsNote: "THREADS YOU STARTED",
    projects: "PROJECTS",
    projectsNote: "COUNTS ONLY",
    messages: "YOUR MESSAGES",
    messagesNote: (chars) => `MEDIAN LENGTH ${chars} CHARS`,
    agentRuns: "AGENT RUNS",
    agentRunsNote: (subagents) => `INCLUDES ${subagents} SUBAGENTS`,
    longestRun: "LONGEST RUN",
    minutes: "MINUTES",
    buildRhythm: "WHEN YOU BUILD",
    buildRhythmNote: "MOST COMMON START TIME",
    toolMix: "AGENT TOOL MIX",
    tokenUsage: "TOKEN USAGE",
    tokenVerified: "RECORDED · CONTEXT + CACHE",
    tokenMissing: "NOT RECORDED",
    output: "OUTPUT",
    cached: "CACHED",
    insightTitle: "CODING INSIGHTS",
    insightEvidence: "NATIVE COPY · LOCAL EVIDENCE",
    logTitle: (name) => `${name}’S CODING ADVENTURE LOG`,
    logSubtitle: "See how you and AI actually get things made together.",
    collection: "INSIGHT DECK",
    collectionNote: "Choose a card to open this period’s story",
    currentInsight: "CURRENT INSIGHT",
    insightBasedOn: (date) => `BUILT FROM LOCAL DATA · ${date}`,
    generateInsight: "GENERATE INSIGHTS",
    generatingInsight: "GENERATING…",
    insightGenerator: "INSIGHT GENERATOR",
    generateDialogTitle: "Generate 4 new insights?",
    generateDialogBody:
      "We’ll analyze new records and add 4 new insights to your deck.",
    tokenCostTitle: "TOKEN",
    tokenCostCopy: "Uses your connected model allowance",
    waitTitle: "WAIT",
    waitCopy: "Usually takes about 1–3 minutes",
    cancelGeneration: "NOT NOW",
    confirmGeneration: "USE TOKENS · GENERATE 4",
    generationComplete: "4 NEW INSIGHTS ADDED",
    generationFailed: "GENERATION FAILED · TRY AGAIN",
    swipeInsight: "SWIPE TO CHANGE INSIGHT",
    periodStats: "THIS PERIOD",
    periodStatsNote: "THE RANGE ONLY CHANGES THE FACTUAL DATA BELOW",
    customize: "CUSTOMIZE",
    closeCustomize: "DONE",
    metricPicker: "CHOOSE VISIBLE DATA",
    metricPickerCount: (count) => `${count} / 8 VISIBLE`,
    recentActivity: "RECENT ACTIVITY",
    metricActive: "ACTIVE DAYS",
    metricProjects: "PROJECTS",
    metricLongest: "LONGEST RUN",
    metricTokens: "MODEL USAGE",
    metricSessions: "MAIN SESSIONS",
    metricSubagents: "SUBAGENTS",
    metricMessages: "YOUR MESSAGES",
    metricPrompt: "MEDIAN PROMPT",
    projectUnit: "PROJECTS",
    minuteUnit: "MINUTES",
    tokenNote: "INCLUDES CONTEXT AND CACHE READS",
    sessionUnit: "SESSIONS",
    subagentUnit: "SUBAGENTS",
    messageUnit: "MESSAGES",
    characterUnit: "CHARACTERS",
    dataMethod: "HOW ARE THESE CALCULATED?",
    dataMethodCopy:
      "Active days are unique local dates with a message in a main session. Projects are anonymized working-directory counts. A continuous run groups events in one main session when gaps stay under 45 minutes. Model usage sums reported processing totals, including context and cache.",
    prev: "PREV",
    next: "NEXT",
    lightTip: "LIGHT TIP",
    rawPrivacy: "RAW TRANSCRIPTS NEVER ENTER THIS VIEW",
    overviewRecommendations: "TRY THIS NEXT",
    overviewSources: "SOURCE",
    overviewSourceLabels: {
      "claude-code-best-practices": "CLAUDE CODE GUIDE",
      "claude-code-subagents": "SUBAGENTS",
      "openai-how-we-use-codex": "CODEX PRACTICE",
      "openai-introducing-codex": "CODEX INTRO",
    },
    overviewUpdated: (date) => `GENERATED ${date}`,
    overviewCadence:
      "AUTO-CHECKS WEEKLY · UPDATES AFTER 3 SESSIONS OR 20 MESSAGES",
    overviewCheckState: {
      fresh: "CHECKED THIS WEEK",
      eligible: "OVERVIEW UPDATED AUTOMATICALLY",
      "insufficient-new-data": "NOT ENOUGH NEW DATA · KEEPING THIS OVERVIEW",
    },
    overviewState: {
      loading: "READING LOCAL BEHAVIOR PATTERNS",
      ready: "LOCAL OVERVIEW READY",
      stale: "WAITING FOR THE NEXT SCHEDULED UPDATE",
      updating: "UPDATING OVERVIEW",
      error: "OVERVIEW IS TEMPORARILY UNAVAILABLE",
    },
    status: {
      loading: "LOADING LOCAL SNAPSHOT",
      scanning: "SCANNING ALL LOCAL SESSIONS",
      calculating: "CALCULATING METRICS",
      ready: "LOCAL DATA READY",
      updated: "ALL DATA RANGES UPDATED",
      error: "UPDATE FAILED · LAST SNAPSHOT KEPT",
    },
    weekday: {
      Monday: "MON",
      Tuesday: "TUE",
      Wednesday: "WED",
      Thursday: "THU",
      Friday: "FRI",
      Saturday: "SAT",
      Sunday: "SUN",
    },
    toolNames: {
      shell: "SHELL",
      other: "OTHER",
      edit: "EDIT",
      read: "READ",
    },
  },
};

function compactNumber(value) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  })
    .format(value)
    .toUpperCase();
}

function phraseMessageCount(metrics, phrase) {
  return (
    metrics?.prompts?.phrase_counts?.find((item) => item.phrase === phrase)
      ?.messages ?? 0
  );
}

function formatUpdated(value, lang) {
  if (!value) return dashboardCopy[lang].notUpdated;
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date(value))
    .replace(",", " ·")
    .toUpperCase();
}

function insightCardsFromMetrics(metrics, lang) {
  const coverage = metrics?.coverage ?? {};
  const rhythm = metrics?.rhythm ?? {};
  const prompts = metrics?.prompts ?? {};
  const shortPercent = coverage.user_messages
    ? Math.round((prompts.under_50_characters / coverage.user_messages) * 100)
    : 0;
  const continueCount = phraseMessageCount(metrics, "continue / 继续");
  const longestMinutes = Math.round(rhythm.longest_active_segment_minutes ?? 0);
  const longestStart = rhythm.longest_active_segment_started_at
    ? new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: lang === "en",
      }).format(new Date(rhythm.longest_active_segment_started_at))
    : "—";

  const zhCards = [
    {
      id: "agent-conductor",
      theme: "warm",
      index: "01",
      profileTitle: "智能体总指挥",
      title: `${coverage.sessions ?? 0} 次开场，${coverage.subagent_sessions ?? 0} 路接力`,
      subtitle: `你开启了 ${coverage.sessions ?? 0} 个主会话，又让 ${coverage.subagent_sessions ?? 0} 个子智能体接力工作。`,
      rows: [
        ["你怎么做", "把问题交给主智能体，再让任务继续往下拆。"],
        ["AI 怎么做", "研究、实现和检查，被分给不同角色接力完成。"],
        ["你的风格", "你更像在指挥一支临时乐团，而不是独自敲代码。"],
      ],
      tip: "给每个子智能体写清角色、交付格式和验收动作。",
      image: "/assets/agent-orchestra-warm.png",
      imageAlt: "一位指挥者面对由多个 AI 机器人组成的像素乐团",
    },
    {
      id: "night-runner",
      theme: "blue",
      index: "02",
      profileTitle: "夜间长跑者",
      title: `${longestMinutes} 分钟，一路做到底`,
      subtitle: `最长活跃段从 ${longestStart} 开始，持续了 ${longestMinutes} 分钟。`,
      rows: [
        ["你怎么做", `${longestStart} 开始，把一条工作线连续推进到底。`],
        ["AI 怎么做", "持续读取、修改和执行，陪你把上下文做深。"],
        ["你的风格", "一旦进入状态，你更愿意把一件事连续做透。"],
      ],
      tip: "长任务每推进一段就跑测试或截图，让验证跟着进度走。",
      image: "/assets/night-runner-blue.png",
      imageAlt: "夜晚，一位使用者和机器人沿发光路线持续工作",
    },
    {
      id: "short-commander",
      theme: "pink",
      index: "03",
      profileTitle: "短句指挥官",
      title: `${shortPercent}% 消息不到 50 字`,
      subtitle: `${coverage.user_messages ?? 0} 条消息里，有 ${prompts.under_50_characters ?? 0} 条不到 50 字。`,
      rows: [
        ["你怎么做", "先给一句方向，再看 AI 怎样展开。"],
        ["AI 怎么做", "短输入也会启动读取、拆解、修改和验证。"],
        ["你的风格", "你控制方向和节奏，把展开空间留给 AI。"],
      ],
      tip: "短句不用变长，只补一个文件、完成标准或验证动作。",
      image: "/assets/prompt-machine-pink.png",
      imageAlt: "一个短指令进入像素机器后被扩展成多道工作流程",
    },
    {
      id: "continue-button",
      theme: "green",
      index: "04",
      profileTitle: "继续按钮本人",
      title: `${continueCount} 次「继续」，保持惯性`,
      subtitle: `过去这段时间，你在 ${continueCount} 条消息里说过 continue / 继续。`,
      rows: [
        ["你怎么做", "方向没变时，用一句“继续”维持工作的惯性。"],
        ["AI 怎么做", "沿着已有上下文继续读取、修改和检查。"],
        ["你的风格", "你喜欢在同一条线上校准，而不是反复重写需求。"],
      ],
      tip: "继续前让 AI 用一行报：已完成、未验证、下一步。",
      image: "/assets/continue-steps-green.png",
      imageAlt: "一位使用者鼓励机器人沿着像素台阶继续前进",
    },
  ];

  if (lang === "zh") return zhCards;

  return [
    {
      id: "agent-conductor",
      theme: "warm",
      index: "01",
      profileTitle: "AGENT CONDUCTOR",
      title: `${coverage.sessions ?? 0} starts, ${coverage.subagent_sessions ?? 0} agents`,
      subtitle: `You opened ${coverage.sessions ?? 0} main sessions and let ${coverage.subagent_sessions ?? 0} subagents carry the work forward.`,
      rows: [
        ["You did", "Gave the problem to a lead agent, then let the work branch."],
        ["Agent did", "Split research, implementation, and checks across roles."],
        ["Your style", "You conduct a temporary ensemble instead of coding alone."],
      ],
      tip: "Give each agent a role, output format, and acceptance check.",
      image: "/assets/agent-orchestra-warm.png",
      imageAlt: "A pixel conductor facing an orchestra of AI agents",
    },
    {
      id: "night-runner",
      theme: "blue",
      index: "02",
      profileTitle: "NIGHT RUNNER",
      title: `${longestMinutes} minutes, one continuous run`,
      subtitle: `Your longest active stretch began at ${longestStart} and lasted ${longestMinutes} minutes.`,
      rows: [
        ["You did", `Started at ${longestStart} and kept one workstream moving.`],
        ["Agent did", "Kept reading, editing, and running in the same context."],
        ["Your style", "Once you find the thread, you follow it all the way through."],
      ],
      tip: "Run a test or capture a screenshot at each milestone.",
      image: "/assets/night-runner-blue.png",
      imageAlt: "A person and an AI robot following a glowing route at night",
    },
    {
      id: "short-commander",
      theme: "pink",
      index: "03",
      profileTitle: "SHORT-PROMPT COMMANDER",
      title: `${shortPercent}% under 50 characters`,
      subtitle: `${prompts.under_50_characters ?? 0} of your ${coverage.user_messages ?? 0} messages were shorter than 50 characters.`,
      rows: [
        ["You did", "Gave one clear direction, then watched the agent expand it."],
        ["Agent did", "Turned short input into reading, editing, and verification."],
        ["Your style", "You set direction and tempo, leaving room for expansion."],
      ],
      tip: "Keep it short; add one file, finish line, or verification step.",
      image: "/assets/prompt-machine-pink.png",
      imageAlt: "A short prompt expanding into several workflows inside a pixel machine",
    },
    {
      id: "continue-button",
      theme: "green",
      index: "04",
      profileTitle: "THE CONTINUE BUTTON",
      title: `${continueCount} “continues”, momentum intact`,
      subtitle: `You used continue / 继续 in ${continueCount} messages during this period.`,
      rows: [
        ["You did", "Used one word to preserve momentum when the direction held."],
        ["Agent did", "Continued reading, editing, and checking the same context."],
        ["Your style", "You calibrate one workstream instead of rewriting the brief."],
      ],
      tip: "Before continuing, ask for one line: done, unverified, next.",
      image: "/assets/continue-steps-green.png",
      imageAlt: "A person encouraging a robot up a sequence of pixel steps",
    },
  ];
}

function generatedInsightFromMetrics(metrics, lang, sequence) {
  const coverage = metrics?.coverage ?? {};
  const rhythm = metrics?.rhythm ?? {};
  const behavior = metrics?.behavior ?? {};
  const toolEntries = Object.entries(behavior.tool_categories ?? {}).sort(
    (a, b) => b[1] - a[1],
  );
  const [topTool = "shell", topToolCount = 0] = toolEntries[0] ?? [];
  const startHour = String(rhythm.most_common_start_hour ?? 0).padStart(2, "0");
  const weekday =
    dashboardCopy[lang].weekday[rhythm.most_common_start_weekday] ??
    rhythm.most_common_start_weekday ??
    "—";
  const variant = sequence % 4;

  const zhVariants = [
    {
      id: `generated-start-window-${sequence}`,
      theme: "blue",
      profileTitle: "晚间启动器",
      title: `${startHour}:00，是你的开工暗号`,
      subtitle: `你最常在 ${startHour}:00 附近开启新会话，共出现 ${rhythm.sessions_started_in_that_hour ?? 0} 次。`,
      rows: [
        ["你怎么做", "到了熟悉的时间，就更容易把问题交给 AI。"],
        ["AI 怎么做", "从一张空白上下文开始，迅速接住当天的第一条线。"],
        ["你的风格", "你有一个稳定的启动窗口，晚间更容易进入建造状态。"],
      ],
      tip: "在高频开工时间前留一张“今晚只完成什么”的便签。",
      image: "/assets/night-runner-blue.png",
      imageAlt: "夜晚，一位使用者和机器人沿发光路线开始工作",
    },
    {
      id: `generated-weekday-${sequence}`,
      theme: "warm",
      profileTitle: "星期节奏捕手",
      title: `${weekday}，你的高频开工日`,
      subtitle: `${weekday}开启了 ${rhythm.sessions_started_that_weekday ?? 0} 个主会话，是这段时间最常出现的开工日。`,
      rows: [
        ["你怎么做", "在固定的星期节奏里，更容易启动新的工作线。"],
        ["AI 怎么做", "在这些高频日承接更多新任务，再分派给子智能体。"],
        ["你的风格", "你的创造力不是随机出现，它已经形成了一点周期。"],
      ],
      tip: "把需要深度展开的任务提前放到这个高频日。",
      image: "/assets/agent-orchestra-warm.png",
      imageAlt: "像素指挥者在固定节奏下启动一支 AI 乐团",
    },
    {
      id: `generated-tool-${sequence}`,
      theme: "pink",
      profileTitle: "工具链驾驶员",
      title: `${topToolCount} 次 ${dashboardCopy.zh.toolNames[topTool] ?? topTool}`,
      subtitle: `在所有智能体动作里，${dashboardCopy.zh.toolNames[topTool] ?? topTool}是最常使用的工具类型。`,
      rows: [
        ["你怎么做", "把目标交出去，让 AI 直接进入可执行的工作环境。"],
        ["AI 怎么做", "频繁调用工具，把讨论转成读取、修改和验证。"],
        ["你的风格", "你更看重事情真的发生，而不是只停在建议里。"],
      ],
      tip: "高频工具动作后补一个结果检查，能让执行链更可靠。",
      image: "/assets/prompt-machine-pink.png",
      imageAlt: "像素机器把一条指令转换成连续的工具动作",
    },
    {
      id: `generated-message-volume-${sequence}`,
      theme: "green",
      profileTitle: "持续校准者",
      title: `${coverage.user_messages ?? 0} 条消息，慢慢调到对`,
      subtitle: `你在这个周期发出了 ${coverage.user_messages ?? 0} 条消息，让工作在多轮校准中持续向前。`,
      rows: [
        ["你怎么做", "先推动一小步，再根据结果继续修正方向。"],
        ["AI 怎么做", "保留已有上下文，在每轮反馈后继续推进。"],
        ["你的风格", "你把协作当成连续调参，而不是一次性交付。"],
      ],
      tip: "每三轮停一次，用一句话重申目标和当前差距。",
      image: "/assets/continue-steps-green.png",
      imageAlt: "一位使用者和机器人沿像素台阶逐步校准方向",
    },
  ];

  const enVariants = [
    {
      id: `generated-start-window-${sequence}`,
      theme: "blue",
      profileTitle: "EVENING STARTER",
      title: `${startHour}:00 is your start signal`,
      subtitle: `You most often opened a new session around ${startHour}:00, with ${rhythm.sessions_started_in_that_hour ?? 0} starts in this period.`,
      rows: [
        ["You did", "Reached a familiar hour and handed the first problem to AI."],
        ["Agent did", "Started from a clean context and picked up the day’s first thread."],
        ["Your style", "You have a reliable window for getting into build mode."],
      ],
      tip: "Before that window, leave one note describing tonight’s finish line.",
      image: "/assets/night-runner-blue.png",
      imageAlt: "A person and robot beginning a glowing route at night",
    },
    {
      id: `generated-weekday-${sequence}`,
      theme: "warm",
      profileTitle: "WEEKLY RHYTHM FINDER",
      title: `${weekday} is your launch day`,
      subtitle: `You opened ${rhythm.sessions_started_that_weekday ?? 0} main sessions on ${weekday}, your most common start day in this period.`,
      rows: [
        ["You did", "Started new workstreams inside a recurring weekly rhythm."],
        ["Agent did", "Picked up more new tasks and delegated them across agents."],
        ["Your style", "Your creative momentum already has a little calendar shape."],
      ],
      tip: "Reserve this day for work that benefits from deeper expansion.",
      image: "/assets/agent-orchestra-warm.png",
      imageAlt: "A pixel conductor starting an AI orchestra on a steady rhythm",
    },
    {
      id: `generated-tool-${sequence}`,
      theme: "pink",
      profileTitle: "TOOLCHAIN DRIVER",
      title: `${topToolCount} ${dashboardCopy.en.toolNames[topTool] ?? topTool} actions`,
      subtitle: `${dashboardCopy.en.toolNames[topTool] ?? topTool} was the most common tool category across all agent actions.`,
      rows: [
        ["You did", "Set the goal and let AI enter an executable environment."],
        ["Agent did", "Used tools repeatedly to turn discussion into working changes."],
        ["Your style", "You care more about things happening than advice staying abstract."],
      ],
      tip: "Pair frequent tool runs with a visible result check.",
      image: "/assets/prompt-machine-pink.png",
      imageAlt: "A pixel machine turning one instruction into a chain of tool actions",
    },
    {
      id: `generated-message-volume-${sequence}`,
      theme: "green",
      profileTitle: "STEADY CALIBRATOR",
      title: `${coverage.user_messages ?? 0} messages, tuned over time`,
      subtitle: `You sent ${coverage.user_messages ?? 0} messages this period, keeping the work moving through repeated calibration.`,
      rows: [
        ["You did", "Moved one step, inspected the result, and adjusted direction."],
        ["Agent did", "Kept the existing context and advanced after each correction."],
        ["Your style", "You treat collaboration like continuous tuning, not one-shot delivery."],
      ],
      tip: "Every three rounds, restate the goal and the remaining gap in one line.",
      image: "/assets/continue-steps-green.png",
      imageAlt: "A person and robot calibrating their direction across pixel steps",
    },
  ];

  return (lang === "zh" ? zhVariants : enVariants)[variant];
}

function localizedInsightsFromStore(insightState, lang) {
  if (!Array.isArray(insightState?.insights)) return [];

  return insightState.insights
    .map((record, index) => {
      const localized =
        record.copy?.[lang] ?? record.copy?.zh ?? record.copy?.en;
      if (!localized) return null;

      return {
        id: record.id,
        batchId: record.batch_id,
        createdAt: record.created_at,
        theme: record.theme,
        composition: record.composition,
        index: String(index + 1).padStart(2, "0"),
        profileTitle: localized.profile_title,
        title: localized.title,
        subtitle: localized.subtitle,
        rows: localized.rows.map((row) => [row.label, row.body]),
        tip: localized.tip,
        image: record.image,
        imageAlt: localized.image_alt,
        sourceIds: record.source_ids ?? [],
      };
    })
    .filter(Boolean);
}

function persistableInsightCopy(card) {
  return {
    profile_title: card.profileTitle,
    title: card.title,
    subtitle: card.subtitle,
    rows: card.rows.map(([label, body], index) => ({
      key: ["you_did", "agent_did", "your_style"][index],
      label,
      body,
    })),
    tip: card.tip,
    image_alt: card.imageAlt,
  };
}

function buildPersistableInsightBatch(metrics, sequenceStart) {
  const sourceIdsByVariant = [
    ["claude-code-best-practices"],
    ["claude-code-best-practices"],
    ["openai-introducing-codex"],
    ["claude-code-best-practices"],
  ];
  const compositionsByVariant = [
    "horizontal-night-route",
    "tiered-orchestra",
    "vertical-cutaway-machine",
    "diagonal-platform-journey",
  ];

  return Array.from({ length: 4 }, (_, index) => {
    const sequence = sequenceStart + index;
    const variant = sequence % 4;
    const zhCard = generatedInsightFromMetrics(metrics, "zh", sequence);
    const enCard = generatedInsightFromMetrics(metrics, "en", sequence);

    return {
      id: zhCard.id,
      theme: zhCard.theme,
      composition: compositionsByVariant[variant],
      image_source: zhCard.image,
      source_ids: sourceIdsByVariant[variant],
      evidence: {
        sequence,
        snapshot_generated_at: metrics?.analysis?.generated_at ?? null,
      },
      copy: {
        zh: persistableInsightCopy(zhCard),
        en: persistableInsightCopy(enCard),
      },
    };
  });
}

function buildActivityCalendar(metrics, range) {
  const activity = metrics?.rhythm?.activity_by_date ?? [];
  const values = new Map(activity.map((item) => [item.date, item.messages]));
  const baseDate = metrics?.analysis?.generated_at
    ? new Date(metrics.analysis.generated_at)
    : new Date();
  const end = new Date(
    Date.UTC(
      baseDate.getUTCFullYear(),
      baseDate.getUTCMonth(),
      baseDate.getUTCDate(),
    ),
  );
  const requestedDays = range === "7d" ? 7 : range === "30d" ? 35 : 84;
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - requestedDays + 1);

  if (range !== "7d") {
    start.setUTCDate(start.getUTCDate() - start.getUTCDay());
  }

  const cells = [];
  for (
    const date = new Date(start);
    date <= end;
    date.setUTCDate(date.getUTCDate() + 1)
  ) {
    const key = date.toISOString().slice(0, 10);
    cells.push({ date: key, messages: values.get(key) ?? 0 });
  }

  const max = Math.max(1, ...cells.map((item) => item.messages));
  return cells.map((item) => ({
    ...item,
    level:
      item.messages === 0
        ? 0
        : Math.min(4, Math.max(1, Math.ceil((item.messages / max) * 4))),
  }));
}

function MetricBlock({ className = "", label, value, note, children }) {
  return (
    <section className={`metric-block ${className}`}>
      <p className="metric-label">{label}</p>
      {value ? <p className="metric-value">{value}</p> : null}
      {note ? <p className="metric-note">{note}</p> : null}
      {children}
    </section>
  );
}

function Dashboard() {
  const [range, setRange] = useState("30d");
  const [lang, setLang] = useState("zh");
  const [metrics, setMetrics] = useState(null);
  const [activeInsight, setActiveInsight] = useState(0);
  const [status, setStatus] = useState("loading");
  const [messageKey, setMessageKey] = useState("loading");
  const touchStartX = useRef(null);
  const copy = dashboardCopy[lang];

  const loadSnapshot = async (nextRange, refresh = false) => {
    setStatus("loading");
    setMessageKey(refresh ? "scanning" : "loading");

    try {
      const response = refresh
        ? await fetch(`/api/refresh?range=${nextRange}`, { method: "POST" })
        : await fetch(`/api/metrics?range=${nextRange}`, {
            cache: "no-store",
          });
      if (!response.ok) throw new Error("Snapshot unavailable");
      const nextMetrics = await response.json();
      setMessageKey("calculating");
      await new Promise((resolve) => window.setTimeout(resolve, 260));
      setMetrics(nextMetrics);
      setStatus("ready");
      setMessageKey(refresh ? "updated" : "ready");
    } catch {
      setStatus("error");
      setMessageKey("error");
    }
  };

  useEffect(() => {
    loadSnapshot(range);
  }, [range]);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en";
  }, [lang]);

  const insights = metrics ? insightCardsFromMetrics(metrics, lang) : [];
  const insight = insights[activeInsight] ?? insights[0];
  const coverage = metrics?.coverage ?? {};
  const rhythm = metrics?.rhythm ?? {};
  const tokens = metrics?.tokens ?? {};
  const toolEntries = Object.entries(metrics?.behavior?.tool_categories ?? {});
  const toolTotal = toolEntries.reduce((sum, [, count]) => sum + count, 0);
  const activityCalendar = buildActivityCalendar(metrics, range);
  const windowDays = metrics?.analysis?.days ?? activityCalendar.length;
  const message = copy.status[messageKey];

  const showInsight = (nextIndex) => {
    if (!insights.length) return;
    setActiveInsight((nextIndex + insights.length) % insights.length);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") showInsight(activeInsight - 1);
      if (event.key === "ArrowRight") showInsight(activeInsight + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeInsight, insights.length]);

  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(distance) > 45) {
      showInsight(activeInsight + (distance < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-frame" aria-label={copy.dashboardAria}>
        <header className="dashboard-header">
          <div className="dashboard-brand">
            <p>{copy.brand}</p>
            <span>{copy.privacy}</span>
          </div>

          <div className="dashboard-greeting">
            <p>{copy.greeting}</p>
            <span>
              {copy.activeProjectSummary(
                coverage.active_days ?? "—",
                coverage.projects ?? "—",
              )}
            </span>
          </div>

          <div className="dashboard-controls">
            <div className="language-tabs" aria-label={copy.languageAria}>
              {[
                ["zh", "中文"],
                ["en", "EN"],
              ].map(([id, label]) => (
                <button
                  type="button"
                  key={id}
                  className={lang === id ? "is-active" : ""}
                  aria-pressed={lang === id}
                  onClick={() => {
                    setLang(id);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <nav className="range-tabs" aria-label={copy.rangeAria}>
              {dashboardRanges.map((id) => (
                <button
                  type="button"
                  key={id}
                  className={range === id ? "is-active" : ""}
                  aria-pressed={range === id}
                  onClick={() => {
                    setRange(id);
                    setActiveInsight(0);
                  }}
                >
                  {copy.range[id]}
                </button>
              ))}
            </nav>
            <div className="updated-at">
              <span>{copy.lastUpdated}</span>
              <strong>
                {formatUpdated(metrics?.analysis?.generated_at, lang)}
              </strong>
            </div>
            <button
              className={`refresh-button status-${status}`}
              type="button"
              disabled={status === "loading"}
              onClick={() => loadSnapshot(range, true)}
            >
              {status === "loading" ? copy.updating : copy.update}
            </button>
          </div>
        </header>

        <div className="dashboard-body">
          <section className="metrics-grid" aria-label={copy.metricsAria}>
            <MetricBlock className="metric-activity" label={copy.activeDays}>
              <div className="activity-summary">
                <p>{copy.activeDaysValue(coverage.active_days ?? "—")}</p>
                <span>{copy.activityWindow(windowDays)}</span>
              </div>
              <div className="calendar-layout">
                <div
                  className="activity-calendar"
                  aria-label={copy.activeDays}
                >
                  {activityCalendar.map((item) => (
                    <span
                      key={item.date}
                      className={`calendar-cell level-${item.level}`}
                      title={copy.messagesOnDate(item.date, item.messages)}
                      aria-label={copy.messagesOnDate(
                        item.date,
                        item.messages,
                      )}
                    />
                  ))}
                </div>
                <div className="calendar-legend" aria-hidden="true">
                  <span>{copy.less}</span>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <i key={level} className={`level-${level}`} />
                  ))}
                  <span>{copy.more}</span>
                </div>
              </div>
            </MetricBlock>

            <MetricBlock
              className="metric-sessions"
              label={copy.sessions}
              value={String(coverage.sessions ?? "—")}
              note={copy.sessionsNote}
            />

            <MetricBlock
              className="metric-projects"
              label={copy.projects}
              value={String(coverage.projects ?? "—")}
              note={copy.projectsNote}
            />

            <MetricBlock
              className="metric-messages"
              label={copy.messages}
              value={String(coverage.user_messages ?? "—")}
              note={copy.messagesNote(
                metrics?.prompts?.median_characters ?? "—",
              )}
            />

            <MetricBlock
              className="metric-agent-runs"
              label={copy.agentRuns}
              value={String(coverage.agent_runs ?? "—")}
              note={copy.agentRunsNote(coverage.subagent_sessions ?? "—")}
            />

            <MetricBlock
              className="metric-run"
              label={copy.longestRun}
              value={`${Math.round(rhythm.longest_active_segment_minutes ?? 0)}`}
              note={copy.minutes}
            />

            <MetricBlock className="metric-rhythm" label={copy.buildRhythm}>
              <div className="rhythm-inline">
                <strong>
                  {copy.weekday[rhythm.most_common_start_weekday] ?? "—"}
                </strong>
                <span>
                  {Number.isFinite(rhythm.most_common_start_hour)
                    ? `${String(rhythm.most_common_start_hour).padStart(2, "0")}:00`
                    : "—"}
                </span>
              </div>
              <p className="chart-caption">{copy.buildRhythmNote}</p>
            </MetricBlock>

            <MetricBlock className="metric-tools" label={copy.toolMix}>
              <div className="tool-list">
                {toolEntries.slice(0, 4).map(([name, count]) => (
                  <div key={name}>
                    <span>{copy.toolNames[name] ?? name.toUpperCase()}</span>
                    <strong>
                      {toolTotal ? Math.round((count / toolTotal) * 100) : 0}%
                    </strong>
                  </div>
                ))}
              </div>
            </MetricBlock>

            <MetricBlock
              className="metric-token"
              label={copy.tokenUsage}
              value={compactNumber(tokens.total_tokens)}
              note={
                tokens.status === "verified"
                  ? copy.tokenVerified
                  : copy.tokenMissing
              }
            >
              <div className="token-breakdown">
                <span>
                  {copy.output}{" "}
                  <strong>{compactNumber(tokens.output_tokens)}</strong>
                </span>
                <span>
                  {copy.cached}{" "}
                  <strong>{compactNumber(tokens.cached_input_tokens)}</strong>
                </span>
              </div>
            </MetricBlock>
          </section>

          <aside
            className={`insight-panel theme-${insight?.theme ?? "warm"}`}
            aria-label="Coding Insights"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <header className="insight-header">
              <div>
                <p>{copy.insightTitle}</p>
                <span>{copy.insightEvidence}</span>
              </div>
              <div className="insight-navigation">
                <button
                  type="button"
                  onClick={() => showInsight(activeInsight - 1)}
                >
                  {copy.prev}
                </button>
                <strong>
                  {insight?.index ?? "—"} <span>/ 04</span>
                </strong>
                <button
                  type="button"
                  onClick={() => showInsight(activeInsight + 1)}
                >
                  {copy.next}
                </button>
              </div>
            </header>

            {insight ? (
              <section className="insight-content">
                <div className="insight-overview">
                  <div className="insight-title-group">
                    <p>{insight.profileTitle}</p>
                    <h2>{insight.title}</h2>
                    <span>{insight.subtitle}</span>
                  </div>

                  <figure className="insight-visual">
                    <img src={insight.image} alt={insight.imageAlt} />
                  </figure>
                </div>

                <div className="insight-rows">
                  {insight.rows.map(([label, rowCopy]) => (
                    <div key={label}>
                      <strong>{label}</strong>
                      <p>{rowCopy}</p>
                    </div>
                  ))}
                </div>

                <footer className="insight-tip">
                  <span>{copy.lightTip}</span>
                  <p>{insight.tip}</p>
                </footer>
              </section>
            ) : (
              <div className="dashboard-loading">
                <p>{message}</p>
              </div>
            )}
          </aside>
        </div>

        <footer className="dashboard-status">
          <span className={`status-light is-${status}`} />
          <p>{message}</p>
          <span>{copy.rawPrivacy}</span>
        </footer>
      </section>
    </main>
  );
}

function DashboardRpg() {
  const [range, setRange] = useState("30d");
  const [lang, setLang] = useState("zh");
  const [profileName, setProfileName] = useState("YOU");
  const [metrics, setMetrics] = useState(null);
  const [insightMetrics, setInsightMetrics] = useState(null);
  const [storedInsightData, setStoredInsightData] = useState(null);
  const [insightStatus, setInsightStatus] = useState("loading");
  const [overviewData, setOverviewData] = useState(null);
  const [overviewSources, setOverviewSources] = useState([]);
  const [overviewLoadStatus, setOverviewLoadStatus] = useState("loading");
  const [overviewUpdateInfo, setOverviewUpdateInfo] = useState(null);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [generationNotice, setGenerationNotice] = useState("");
  const [activeInsight, setActiveInsight] = useState(0);
  const [status, setStatus] = useState("loading");
  const [messageKey, setMessageKey] = useState("loading");
  const [customizing, setCustomizing] = useState(false);
  const [visibleMetrics, setVisibleMetrics] = useState([
    "active",
    "projects",
    "longest",
    "tokens",
    "sessions",
    "subagents",
    "messages",
    "prompt",
  ]);
  const touchStartX = useRef(null);
  const suppressCarouselClick = useRef(false);
  const copy = dashboardCopy[lang];

  const loadSnapshot = async (nextRange) => {
    setStatus("loading");
    setMessageKey("loading");

    try {
      const response = await fetch(`/api/metrics?range=${nextRange}`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Snapshot unavailable");
      const nextMetrics = await response.json();
      setMessageKey("calculating");
      await new Promise((resolve) => window.setTimeout(resolve, 220));
      setMetrics(nextMetrics);
      setStatus("ready");
      setMessageKey("ready");
    } catch {
      setStatus("error");
      setMessageKey("error");
    }
  };

  const scanLatestRecords = async () => {
    setStatus("loading");
    setMessageKey("scanning");

    try {
      const responses = await Promise.all(
        dashboardRanges.map((id) =>
          fetch(`/api/refresh?range=${id}`, { method: "POST" }),
        ),
      );
      if (responses.some((response) => !response.ok)) {
        throw new Error("Local scan failed");
      }

      const snapshots = await Promise.all(
        responses.map((response) => response.json()),
      );
      const snapshotByRange = Object.fromEntries(
        dashboardRanges.map((id, index) => [id, snapshots[index]]),
      );

      setMessageKey("calculating");
      await new Promise((resolve) => window.setTimeout(resolve, 220));
      setMetrics(snapshotByRange[range]);
      setStatus("ready");
      setMessageKey("updated");
    } catch {
      setStatus("error");
      setMessageKey("error");
    }
  };

  const loadInsightSnapshot = async () => {
    setInsightStatus("loading");

    try {
      const [metricsResponse, insightsResponse] = await Promise.all([
        fetch("/api/metrics?range=30d", { cache: "no-store" }),
        fetch("/api/insights", { cache: "no-store" }),
      ]);
      if (!metricsResponse.ok || !insightsResponse.ok) {
        throw new Error("Insight snapshot unavailable");
      }
      const [nextMetrics, nextInsights] = await Promise.all([
        metricsResponse.json(),
        insightsResponse.json(),
      ]);
      await new Promise((resolve) => window.setTimeout(resolve, 320));
      setInsightMetrics(nextMetrics);
      setStoredInsightData(nextInsights);
      setActiveInsight(0);
      setInsightStatus("ready");
    } catch {
      setInsightStatus("error");
    }
  };

  const loadOverviewSnapshot = async () => {
    setOverviewLoadStatus("loading");

    try {
      const [overviewResponse, sourcesResponse] = await Promise.all([
        fetch("/api/overview/auto-refresh", {
          method: "POST",
          cache: "no-store",
        }),
        fetch("/api/sources", { cache: "no-store" }),
      ]);
      if (!overviewResponse.ok || !sourcesResponse.ok) {
        throw new Error("Overview snapshot unavailable");
      }

      const [overviewResult, nextSources] = await Promise.all([
        overviewResponse.json(),
        sourcesResponse.json(),
      ]);
      const nextOverview = overviewResult?.overview;
      setOverviewData(nextOverview);
      setOverviewUpdateInfo(overviewResult?.update ?? null);
      setOverviewSources(nextSources?.sources ?? []);
      setOverviewLoadStatus(
        nextOverview?.status === "updating" ? "updating" : "ready",
      );
    } catch {
      try {
        const fallbackResponse = await fetch("/api/overview", {
          cache: "no-store",
        });
        if (!fallbackResponse.ok) {
          throw new Error("Overview fallback unavailable");
        }
        setOverviewData(await fallbackResponse.json());
        setOverviewUpdateInfo(null);
        setOverviewLoadStatus("ready");
      } catch {
        setOverviewLoadStatus("error");
      }
    }
  };

  const confirmGenerateInsight = async () => {
    setGenerateDialogOpen(false);
    setGenerationNotice("");
    setInsightStatus("generating");

    try {
      const response = await fetch("/api/metrics?range=30d", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Insight snapshot unavailable");
      const nextMetrics = await response.json();
      const currentCount = storedInsightData?.insights?.length ?? 0;
      const nextBatch = buildPersistableInsightBatch(
        nextMetrics,
        Math.max(0, currentCount - 4),
      );

      await new Promise((resolve) => window.setTimeout(resolve, 900));
      const saveResponse = await fetch("/api/insights/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_snapshot: `dashboard-30d@${nextMetrics?.analysis?.generated_at ?? "unknown"}`,
          insights: nextBatch,
        }),
      });
      if (!saveResponse.ok) throw new Error("Insight batch save failed");
      const nextInsightData = await saveResponse.json();

      setInsightMetrics(nextMetrics);
      setStoredInsightData(nextInsightData);
      setActiveInsight(currentCount);
      setGenerateDialogOpen(false);
      setInsightStatus("ready");
      setGenerationNotice("complete");
      window.setTimeout(() => setGenerationNotice(""), 3200);
    } catch {
      setGenerateDialogOpen(false);
      setInsightStatus("error");
      setGenerationNotice("error");
    }
  };

  useEffect(() => {
    loadSnapshot(range);
  }, [range]);

  useEffect(() => {
    loadInsightSnapshot();
  }, []);

  useEffect(() => {
    loadOverviewSnapshot();
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/config", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Config unavailable");
        return response.json();
      })
      .then((config) => {
        if (!active) return;
        const profile = config?.profile ?? {};
        if (typeof profile.display_name === "string" && profile.display_name) {
          setProfileName(profile.display_name);
        }
        if (profile.default_locale === "zh" || profile.default_locale === "en") {
          setLang(profile.default_locale);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en";
  }, [lang]);

  const insights = localizedInsightsFromStore(storedInsightData, lang);
  const insight = insights[activeInsight] ?? insights[0];
  const coverage = metrics?.coverage ?? {};
  const rhythm = metrics?.rhythm ?? {};
  const prompts = metrics?.prompts ?? {};
  const tokens = metrics?.tokens ?? {};
  const localizedOverview =
    overviewData?.copy?.[lang] ??
    overviewData?.copy?.zh ??
    overviewData?.copy?.en ??
    null;
  const overviewSourceMap = new Map(
    overviewSources.map((source) => [source.id, source]),
  );
  const overviewGeneratedAt = overviewData?.generated_at
    ? new Date(overviewData.generated_at)
    : null;
  const overviewStaleAfterDays =
    overviewData?.refresh_policy?.stale_after_days ?? 7;
  const overviewIsStale =
    overviewGeneratedAt &&
    Date.now() - overviewGeneratedAt.getTime() >
      overviewStaleAfterDays * 24 * 60 * 60 * 1000;
  const overviewDisplayStatus =
    overviewLoadStatus === "ready" &&
    (overviewIsStale ||
      overviewUpdateInfo?.reason === "insufficient-new-data")
      ? "stale"
      : overviewLoadStatus;
  const overviewStatusLabel =
    copy.overviewCheckState[overviewUpdateInfo?.reason] ??
    copy.overviewState[overviewDisplayStatus];
  const activityLimit = range === "7d" ? 7 : range === "30d" ? 30 : 35;
  const activityDots = buildActivityCalendar(metrics, range).slice(
    -activityLimit,
  );
  const message = copy.status[messageKey];

  useEffect(() => {
    if (!generateDialogOpen) return undefined;
    const handleEscape = (event) => {
      if (event.key === "Escape") setGenerateDialogOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [generateDialogOpen]);

  const showInsight = (nextIndex) => {
    if (!insights.length) return;
    setActiveInsight((nextIndex + insights.length) % insights.length);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") showInsight(activeInsight - 1);
      if (event.key === "ArrowRight") showInsight(activeInsight + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeInsight, insights.length]);

  const handlePointerStart = (event) => {
    touchStartX.current = event.clientX;
    suppressCarouselClick.current = false;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerEnd = (event) => {
    if (touchStartX.current === null) return;
    const distance = event.clientX - touchStartX.current;
    if (Math.abs(distance) > 45) {
      suppressCarouselClick.current = true;
      showInsight(activeInsight + (distance < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  const toggleMetric = (id) => {
    setVisibleMetrics((current) => {
      if (!current.includes(id)) return [...current, id];
      if (current.length === 1) return current;
      return current.filter((item) => item !== id);
    });
  };

  const carouselSlot = (index) => {
    const delta = (index - activeInsight + insights.length) % insights.length;
    if (delta === 0) return "is-current";
    if (delta === 1) return "is-next";
    if (delta === 2) return "is-far";
    return "is-previous";
  };

  const metricOptions = [
    ["active", copy.metricActive],
    ["projects", copy.metricProjects],
    ["longest", copy.metricLongest],
    ["tokens", copy.metricTokens],
    ["sessions", copy.metricSessions],
    ["subagents", copy.metricSubagents],
    ["messages", copy.metricMessages],
    ["prompt", copy.metricPrompt],
  ];

  const visibleMetricOptions = metricOptions.filter(([id]) =>
    visibleMetrics.includes(id),
  );

  const renderMetricCard = (id) => {
    if (id === "active") {
      return (
        <section className="rpg-stat-card is-active-days" key={id}>
          <div className="rpg-active-summary">
            <p>{copy.metricActive}</p>
            <strong>{coverage.active_days ?? "—"}</strong>
            <span>{copy.activityWindow(metrics?.analysis?.days ?? "—")}</span>
          </div>
          <div className="rpg-activity-dots" aria-label={copy.recentActivity}>
            {activityDots.map((item) => (
              <i
                key={item.date}
                className={`level-${item.level}`}
                title={copy.messagesOnDate(item.date, item.messages)}
                aria-label={copy.messagesOnDate(item.date, item.messages)}
                data-label={copy.messagesOnDate(item.date, item.messages)}
                role="img"
                tabIndex="0"
              />
            ))}
          </div>
        </section>
      );
    }

    const cards = {
      projects: {
        label: copy.metricProjects,
        value: coverage.projects,
        note: copy.projectUnit,
      },
      longest: {
        label: copy.metricLongest,
        value: Math.round(rhythm.longest_active_segment_minutes ?? 0),
        note: copy.minuteUnit,
      },
      tokens: {
        label: copy.metricTokens,
        value: compactNumber(tokens.total_tokens),
        note: copy.tokenNote,
      },
      sessions: {
        label: copy.metricSessions,
        value: coverage.sessions,
        note: copy.sessionUnit,
      },
      subagents: {
        label: copy.metricSubagents,
        value: coverage.subagent_sessions,
        note: copy.subagentUnit,
      },
      messages: {
        label: copy.metricMessages,
        value: coverage.user_messages,
        note: copy.messageUnit,
      },
      prompt: {
        label: copy.metricPrompt,
        value: prompts.median_characters,
        note: copy.characterUnit,
      },
    };
    const card = cards[id];
    if (!card) return null;

    return (
      <section className={`rpg-stat-card rpg-metric-${id}`} key={id}>
        <p>{card.label}</p>
        <strong>{card.value ?? "—"}</strong>
        <span>{card.note}</span>
      </section>
    );
  };

  return (
    <main className="rpg-page">
      <header className="rpg-header">
        <div className="rpg-brand">
          <span className="rpg-brand-mark" aria-hidden="true">
            CW
          </span>
          <div>
            <p>{copy.brand}</p>
            <span>{copy.privacy}</span>
          </div>
        </div>

        <div className="rpg-log-title">
          <p>{copy.logTitle(profileName)}</p>
          <span>{copy.logSubtitle}</span>
        </div>

        <div className="rpg-controls">
          <button
            className={`rpg-refresh status-${status}`}
            type="button"
            disabled={status === "loading"}
            onClick={scanLatestRecords}
          >
            {status === "loading" ? copy.updating : copy.update}
          </button>
        </div>
      </header>

      <section
        className={`rpg-overview is-${overviewDisplayStatus}`}
        aria-labelledby="coding-overview-title"
      >
        <header>
          <div>
            <p>{localizedOverview?.eyebrow ?? copy.overviewRecommendations}</p>
            <span>
              {copy.overviewUpdated(
                formatUpdated(overviewData?.generated_at, lang),
              )}
            </span>
            <span className="rpg-overview-cadence">
              {copy.overviewCadence}
            </span>
          </div>
          <strong>
            <i aria-hidden="true" />
            {overviewStatusLabel}
          </strong>
        </header>

        {localizedOverview ? (
          <div className="rpg-overview-body">
            <div className="rpg-overview-narrative">
              <h2 id="coding-overview-title">{localizedOverview.title}</h2>
              <p>{localizedOverview.summary}</p>
            </div>

            <div
              className="rpg-overview-recommendations"
              aria-label={copy.overviewRecommendations}
            >
              {localizedOverview.recommendations
                .slice(0, 3)
                .map((recommendation, index) => (
                  <article key={recommendation.id}>
                    <div>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <p>{copy.overviewRecommendations}</p>
                    </div>
                    <h3>{recommendation.title}</h3>
                    <p>{recommendation.body}</p>
                    <footer>
                      <span>{copy.overviewSources}</span>
                      <div>
                        {recommendation.source_ids
                          .map((sourceId) => overviewSourceMap.get(sourceId))
                          .filter(Boolean)
                          .map((source) => (
                            <a
                              key={source.id}
                              href={source.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {copy.overviewSourceLabels[source.id] ??
                                source.publisher}
                            </a>
                          ))}
                      </div>
                    </footer>
                  </article>
                ))}
            </div>
          </div>
        ) : (
          <div className="rpg-overview-message" role="status">
            {copy.overviewState[overviewDisplayStatus]}
          </div>
        )}
      </section>

      <div className="rpg-workspace">
        <aside className="rpg-deck" aria-label={copy.collection}>
          <header>
            <p>{copy.collection}</p>
            <span>{copy.collectionNote}</span>
          </header>

          <div className="rpg-deck-list">
            {insights.map((card, index) => (
              <button
                type="button"
                key={card.id}
                className={index === activeInsight ? "is-active" : ""}
                aria-pressed={index === activeInsight}
                onClick={() => showInsight(index)}
              >
                <span>{card.index}</span>
                <strong>{card.profileTitle}</strong>
              </button>
            ))}
          </div>

          <div className={`rpg-data-status is-${status}`}>
            <i aria-hidden="true" />
            <span>{message}</span>
          </div>
        </aside>

        <section
          className={`rpg-insight theme-${insight?.theme ?? "warm"}`}
          aria-label={copy.insightTitle}
        >
          <header className="rpg-insight-header">
            <div className="rpg-insight-heading">
              <div>
                <p>{copy.currentInsight}</p>
                <span>
                  {insight?.index ?? "—"} /{" "}
                  {String(insights.length).padStart(2, "0")}
                </span>
              </div>
              <span className="rpg-insight-source">
                {copy.insightBasedOn(
                  formatUpdated(
                    insightMetrics?.analysis?.generated_at,
                    lang,
                  ),
                )}
              </span>
            </div>

            <div className="rpg-insight-controls">
              <button
                className="rpg-generate"
                type="button"
                disabled={
                  insightStatus === "loading" ||
                  insightStatus === "generating"
                }
                onClick={() => setGenerateDialogOpen(true)}
              >
                {insightStatus === "generating"
                  ? copy.generatingInsight
                  : copy.generateInsight}
              </button>

              <nav aria-label={copy.insightTitle}>
                <button
                  type="button"
                  onClick={() => showInsight(activeInsight - 1)}
                >
                  {copy.prev}
                </button>
                <button
                  type="button"
                  onClick={() => showInsight(activeInsight + 1)}
                >
                  {copy.next}
                </button>
              </nav>
            </div>

            <span className="rpg-swipe-hint">{copy.swipeInsight}</span>
          </header>

          {insightStatus === "generating" ? (
            <div className="rpg-generation-progress" role="status">
              <strong>{copy.generatingInsight}</strong>
              <span>{copy.waitCopy}</span>
            </div>
          ) : null}

          {insight ? (
            <>
              <div
                className="rpg-carousel"
                aria-live="polite"
                onPointerDown={handlePointerStart}
                onPointerUp={handlePointerEnd}
              >
                {insights.map((card, index) => (
                  <button
                    type="button"
                    key={card.id}
                    className={`rpg-carousel-card ${carouselSlot(index)} theme-${card.theme}`}
                    aria-label={card.profileTitle}
                    aria-current={index === activeInsight ? "true" : undefined}
                    onClick={() => {
                      if (suppressCarouselClick.current) {
                        suppressCarouselClick.current = false;
                        return;
                      }
                      showInsight(index);
                    }}
                  >
                    <img src={card.image} alt={card.imageAlt} />
                  </button>
                ))}
              </div>

              <div className="rpg-insight-copy">
                <div className="rpg-insight-title">
                  <p>{insight.profileTitle}</p>
                  <h1>{insight.title}</h1>
                  <span>{insight.subtitle}</span>
                </div>

                <div className="rpg-behavior-grid">
                  {insight.rows.map(([label, rowCopy]) => (
                    <div key={label}>
                      <strong>{label}</strong>
                      <p>{rowCopy}</p>
                    </div>
                  ))}
                </div>

                <div className="rpg-tip">
                  <span>{copy.lightTip}</span>
                  <p>{insight.tip}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="rpg-loading">{message}</div>
          )}
        </section>

        <aside className="rpg-stats">
          <header>
            <div>
              <p>{copy.periodStats}</p>
              <span>{copy.periodStatsNote}</span>
            </div>
            <div className="rpg-stats-controls">
              <nav className="rpg-range" aria-label={copy.rangeAria}>
                {dashboardRanges.map((id) => (
                  <button
                    type="button"
                    key={id}
                    className={range === id ? "is-active" : ""}
                    aria-pressed={range === id}
                    onClick={() => setRange(id)}
                  >
                    {copy.range[id]}
                  </button>
                ))}
              </nav>
              <button
                type="button"
                aria-expanded={customizing}
                onClick={() => setCustomizing((value) => !value)}
              >
                {customizing ? copy.closeCustomize : copy.customize}
              </button>
            </div>
          </header>

          {customizing ? (
            <fieldset className="rpg-metric-picker">
              <legend>
                {copy.metricPicker} · {copy.metricPickerCount(visibleMetrics.length)}
              </legend>
              {metricOptions.map(([id, label]) => (
                <label key={id}>
                  <input
                    type="checkbox"
                    checked={visibleMetrics.includes(id)}
                    onChange={() => toggleMetric(id)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>
          ) : null}

          <div
            className={`rpg-stat-list count-${visibleMetricOptions.length}`}
          >
            {visibleMetricOptions.map(([id]) => renderMetricCard(id))}
          </div>

          <details className="rpg-method">
            <summary>{copy.dataMethod}</summary>
            <p>{copy.dataMethodCopy}</p>
          </details>

          <footer>
            <span>{formatUpdated(metrics?.analysis?.generated_at, lang)}</span>
            <strong>{copy.rawPrivacy}</strong>
          </footer>
        </aside>
      </div>

      {generateDialogOpen ? (
        <div
          className="rpg-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setGenerateDialogOpen(false);
            }
          }}
        >
          <section
            className="rpg-generate-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="generate-dialog-title"
            aria-describedby="generate-dialog-description"
          >
            <p className="rpg-dialog-kicker">{copy.insightGenerator}</p>
            <h2 id="generate-dialog-title">{copy.generateDialogTitle}</h2>
            <p id="generate-dialog-description">
              {copy.generateDialogBody}
            </p>

            <div className="rpg-generation-facts">
              {[
                [copy.tokenCostTitle, copy.tokenCostCopy],
                [copy.waitTitle, copy.waitCopy],
              ].map(([label, value]) => (
                <div key={label}>
                  <strong>{label}</strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>

            <footer>
              <button
                type="button"
                onClick={() => setGenerateDialogOpen(false)}
              >
                {copy.cancelGeneration}
              </button>
              <button
                className="is-primary"
                type="button"
                autoFocus
                onClick={(event) => {
                  event.stopPropagation();
                  confirmGenerateInsight();
                }}
              >
                {copy.confirmGeneration}
              </button>
            </footer>
          </section>
        </div>
      ) : null}

      {generationNotice ? (
        <div
          className={`rpg-generation-toast is-${generationNotice}`}
          role="status"
        >
          {generationNotice === "complete"
            ? copy.generationComplete
            : copy.generationFailed}
        </div>
      ) : null}
    </main>
  );
}

function ValidationCard({ card, exportScale = 1 }) {
  return (
    <main className={`sample-page export-${exportScale}x`}>
      <article
        className={`validation-card lang-${card.lang} theme-${card.theme} title-${card.titleScale ?? "default"}`}
        aria-label={card.ariaLabel}
      >
        <section className="validation-copy">
          <header className="validation-meta">
            <span>CODING WRAPPED · {card.meta}</span>
            <span>{card.range}</span>
          </header>

          <p className="validation-profile">{card.profileTitle}</p>
          <h1 className="validation-title">{card.title}</h1>
          <p className="validation-subtitle">{card.subtitle}</p>

          <section className="validation-rows" aria-label="Behavior breakdown">
            {card.rows.map(([label, text]) => (
              <div className="validation-row" key={label}>
                <span>{label}</span>
                <p>{text}</p>
              </div>
            ))}
          </section>

          <footer className="validation-tip">
            <span>{card.tipLabel}</span>
            <p>{card.tip}</p>
          </footer>
        </section>

        <figure className="validation-illustration">
          <img src={card.image} alt={card.imageAlt} />
        </figure>
      </article>
    </main>
  );
}

function ExportCard({ card, slice }) {
  return (
    <main className={`page-shell${slice ? ` capture-slice-${slice}` : ""}`}>
      <article className="wrapped-card" aria-label={card.ariaLabel}>
        <header className="card-meta">
          <span>CODING WRAPPED · {card.meta}</span>
          <span>LAST 30 DAYS</span>
        </header>

        <section className="hero-copy">
          <div className="hero-title">
            <p className="eyebrow">{card.eyebrow}</p>
            <h1>
              {card.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
          </div>
          <div className="hero-summary">
            <p>{card.summary}</p>
            <span className="flow-label">{card.flow}</span>
          </div>
        </section>

        <figure className="illustration-frame">
          <img src={card.image} alt={card.imageAlt} />
        </figure>

        <section className="fact-rows" aria-label="数据解释">
          {card.facts.map(([label, text]) => (
            <div className="fact-row" key={label}>
              <span>{label}</span>
              <p>{text}</p>
            </div>
          ))}
        </section>

        <footer className="takeaway">
          <div className="card-number">{card.meta.slice(0, 2)}</div>
          <p>
            <strong>轻建议：</strong>
            {card.advice}
          </p>
        </footer>
      </article>
    </main>
  );
}

function WrappedViewer() {
  const params = new URLSearchParams(window.location.search);
  const initialStory = params.get("story") === "2" ? 1 : 0;
  const [activeIndex, setActiveIndex] = useState(initialStory);
  const [shareStatus, setShareStatus] = useState("");
  const touchStartX = useRef(null);
  const activeStory = stories[activeIndex];

  const showStory = (nextIndex) => {
    const normalized = (nextIndex + stories.length) % stories.length;
    setActiveIndex(normalized);
    setShareStatus("");
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        showStory(activeIndex - 1);
      }
      if (event.key === "ArrowRight") {
        showStory(activeIndex + 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("story", String(activeIndex + 1));
    window.history.replaceState(null, "", url);
  }, [activeIndex]);

  const shareCurrentStory = async () => {
    const shareData = {
      title: `Coding Wrapped · ${activeStory.title}`,
      text: "这是我的 Coding Wrapped。",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("分享面板已打开");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus("链接已复制");
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        setShareStatus("暂时无法分享，请直接复制浏览器地址");
      }
    }
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(distance) > 45) {
      showStory(activeIndex + (distance < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  return (
    <main className="viewer-shell">
      <header className="viewer-header">
        <div>
          <p>CODING WRAPPED</p>
          <span>真实本地记录 · 四种个人风格</span>
        </div>
        <p className="viewer-counter">
          {activeStory.number} <span>/ 04</span>
        </p>
      </header>

      <section
        className="viewer-stage"
        aria-label="Coding Wrapped 故事浏览器"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          className="story-nav story-nav-previous"
          type="button"
          onClick={() => showStory(activeIndex - 1)}
        >
          上一张
        </button>

        <figure className="viewer-card">
          <img
            key={activeStory.image}
            src={activeStory.image}
            alt={`Coding Wrapped 第 ${activeStory.number} 张：${activeStory.title}`}
          />
        </figure>

        <button
          className="story-nav story-nav-next"
          type="button"
          onClick={() => showStory(activeIndex + 1)}
        >
          下一张
        </button>
      </section>

      <footer className="viewer-footer">
        <nav className="story-tabs" aria-label="选择故事">
          {stories.map((story, index) => (
            <button
              className={index === activeIndex ? "is-active" : ""}
              type="button"
              key={story.number}
              aria-current={index === activeIndex ? "page" : undefined}
              onClick={() => showStory(index)}
            >
              <span>{story.number}</span>
              {story.title}
            </button>
          ))}
        </nav>

        <div className="viewer-actions">
          <a href={activeStory.image} download={activeStory.download}>
            下载这一张
          </a>
          <button type="button" onClick={shareCurrentStory}>
            分享链接
          </button>
        </div>

        <p className="share-status" aria-live="polite">
          {shareStatus}
        </p>
      </footer>
    </main>
  );
}

export function App() {
  const params = new URLSearchParams(window.location.search);
  const cardNumber = params.get("card");
  const slice = params.get("slice");
  const sample = params.get("sample");
  const exportScale = params.get("export") === "2" ? 2 : 1;
  const view = params.get("view");

  const sampleKey = sample === "zh" ? "blue" : sample;
  const isExportPage =
    Boolean(sampleKey && validationCards[sampleKey]) ||
    cardNumber === "1" ||
    cardNumber === "2";

  useEffect(() => {
    document.documentElement.classList.toggle("export-page", isExportPage);
    document.body.classList.toggle("export-page", isExportPage);
    return () => {
      document.documentElement.classList.remove("export-page");
      document.body.classList.remove("export-page");
    };
  }, [isExportPage]);

  if (sampleKey && validationCards[sampleKey]) {
    return (
      <ValidationCard
        card={validationCards[sampleKey]}
        exportScale={exportScale}
      />
    );
  }

  if (cardNumber === "1" || cardNumber === "2") {
    return <ExportCard card={wrappedCards[cardNumber]} slice={slice} />;
  }

  if (view === "cards") {
    return <WrappedViewer />;
  }

  return <DashboardRpg />;
}
