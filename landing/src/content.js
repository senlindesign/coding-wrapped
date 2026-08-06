export const LINKS = {
  github: "https://github.com/senlindesign/coding-wrapped",
  profile: "https://github.com/senlindesign",
  support: null,
};

export const INSTALL_COMMAND = `npx skills add senlindesign/coding-wrapped \\
  --skill coding-wrapped \\
  --agent claude-code \\
  --agent codex \\
  --global`;

export const INSIGHTS = [
  {
    title: "The tiny-prompt commander",
    stat: "49% of your messages stayed under 50 characters.",
    youDid: "You pointed in a direction, then waited to see how the agent expanded it.",
    agentDid: "Short inputs often started a full implementation loop.",
    yourStyle: "You control rhythm and direction while leaving the expansion space to AI.",
    tip: "Add one finish line before a short command to save a confirmation loop.",
    image: "/assets/illustrations/agent-orchestra-warm.webp",
    alt: "A pixel-art person directing a group of cream robots",
    theme: "warm",
  },
  {
    title: "The night-shift navigator",
    stat: "Your longest session ran for 160 focused minutes.",
    youDid: "Once momentum arrived, you stayed with one thread instead of switching projects.",
    agentDid: "The agent kept context and accumulated decisions across a long run.",
    yourStyle: "You work in deep expeditions rather than evenly spaced check-ins.",
    tip: "Leave a one-line checkpoint before the final late-night push.",
    image: "/assets/illustrations/night-runner-blue.webp",
    alt: "A pixel-art night runner scene with a car and coding agent",
    theme: "blue",
  },
  {
    title: "The prompt machine operator",
    stat: "One short sentence routinely became a multi-step build.",
    youDid: "You used compact requests to keep decisions moving quickly.",
    agentDid: "The agent inferred missing steps and assembled a production line around them.",
    yourStyle: "You prefer steering the system to documenting the entire route first.",
    tip: "Name the one thing that must not change when the task is sensitive.",
    image: "/assets/illustrations/prompt-machine-pink.webp",
    alt: "A pixel-art workshop where a person hands prompts to several robots",
    theme: "pink",
  },
  {
    title: "The continue-button native",
    stat: "You said “continue” 10 times across active builds.",
    youDid: "When the direction felt right, you protected momentum with a single word.",
    agentDid: "The agent treated continuity as permission to preserve the working plan.",
    yourStyle: "You calibrate early, then let a trusted loop keep running.",
    tip: "Pair “continue” with one status line: done, blocked, and next.",
    image: "/assets/illustrations/continue-steps-green.webp",
    alt: "A pixel-art library of coding robots and continuing work",
    theme: "green",
  },
];

export const METRICS = [
  { label: "Active days", value: "18", note: "of the last 30" },
  { label: "Sessions", value: "23", note: "across 13 projects" },
  { label: "Longest run", value: "160m", note: "one continuous thread" },
  { label: "Messages", value: "111", note: "safe aggregate only" },
  { label: "Top model", value: "GPT-5", note: "52% of turns" },
  { label: "Tool calls", value: "286", note: "terminal led the mix" },
];
