import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { INSTALL_COMMAND, INSIGHTS, LINKS, METRICS } from "../src/content.js";

test("public demo contains exactly four distinct insights", () => {
  assert.equal(INSIGHTS.length, 4);
  assert.equal(new Set(INSIGHTS.map((item) => item.image)).size, 4);
  assert.equal(new Set(INSIGHTS.map((item) => item.theme)).size, 4);
});

test("demo content is synthetic and public-safe", () => {
  const serialized = JSON.stringify({ INSIGHTS, METRICS });
  for (const forbidden of ["/Users/", "~/.claude", "~/.codex", "project name", "api_key"]) {
    assert.equal(serialized.includes(forbidden), false);
  }
});

test("installation and repository destinations stay canonical", () => {
  assert.match(INSTALL_COMMAND, /--agent claude-code/);
  assert.match(INSTALL_COMMAND, /--agent codex/);
  assert.equal(LINKS.github, "https://github.com/senlindesign/coding-wrapped");
  assert.equal(LINKS.profile, "https://www.linkedin.com/in/senlinbebop");
  assert.equal(LINKS.support, "https://buymeacoffee.com/senlin");
});

test("landing hero exposes only the two supported agents", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  assert.match(source, /name: "Codex"/);
  assert.match(source, /name: "Claude Code"/);
  assert.doesNotMatch(source, /name: "Cursor"/);
  assert.doesNotMatch(source, /name: "Antigravity"/);
  assert.doesNotMatch(source, /Open the program/);
});

test("landing uses the reading robot as its browser icon", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const favicon = await stat(new URL("../public/favicon.png", import.meta.url));
  const touchIcon = await stat(new URL("../public/apple-touch-icon.png", import.meta.url));
  assert.match(html, /rel="icon"[^>]*href="\/favicon\.png"/);
  assert.match(html, /rel="apple-touch-icon"[^>]*href="\/apple-touch-icon\.png"/);
  assert.ok(favicon.size > 0);
  assert.ok(touchIcon.size > 0);
});

test("landing dock contains four pixel-style destinations", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  assert.match(source, /function Dock/);
  for (const label of ["Coding Wrapped", "GitHub", "About Sen", "Support the project"]) {
    assert.match(source, new RegExp(label));
  }
  assert.match(source, /href: LINKS\.profile, external: true/);
  assert.match(source, /href: LINKS\.support, external: true/);
  for (const asset of ["github.webp", "sen-profile.webp", "support-coffee.webp"]) {
    await readFile(new URL(`../public/assets/dock/${asset}`, import.meta.url));
  }
});

test("hero follows the product story, CTA, then support hierarchy", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const title = source.indexOf("<h1>Coding Wrapped</h1>");
  const slogan = source.indexOf("Observe the way you build.");
  const actions = source.indexOf('className="hero-actions"');
  const support = source.indexOf('className="hero-support-wrap"');
  assert.ok(title < slogan && slogan < actions && actions < support);
  assert.match(source, /One shot\. Nothing leaves your machine\./);
  assert.doesNotMatch(source, /Your coding agents remember more than you think/);
  assert.doesNotMatch(source, /A LOCAL-FIRST AGENT SKILL/);
  await readFile(new URL("../public/assets/button-arrow.png", import.meta.url));
});

test("hero CTA labels stay centered before the hover arrow appears", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  assert.match(styles, /\.hero-actions \.button\s*\{[^}]*padding-inline:\s*42px/s);
  assert.doesNotMatch(styles, /\.hero-actions \.button\s*\{[^}]*padding-right:/s);
  assert.match(styles, /\.button__arrow\s*\{[^}]*position:\s*absolute/s);
});

test("how it works uses a dedicated three-step illustration", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  assert.match(source, /how-it-works-flow\.png/);
  assert.doesNotMatch(source, /Coding Wrapped app icon showing a robot reading a notebook/);
  await readFile(new URL("../public/assets/how-it-works-flow.png", import.meta.url));
});

test("supported agents use their official color artwork", async () => {
  const [codex, claude] = await Promise.all([
    readFile(new URL("../public/assets/brand/codex.svg", import.meta.url), "utf8"),
    readFile(new URL("../public/assets/brand/claudecode.svg", import.meta.url), "utf8"),
  ]);
  assert.match(codex, /#B1A7FF/);
  assert.match(codex, /#3941FF/);
  assert.match(claude, /#D97757/);
});

test("hero keeps the mascot standalone and avoids the retired metal badges", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  assert.match(source, /coding-wrapped-mascot\.webp/);
  assert.doesNotMatch(source, /metal-badge/);
  assert.doesNotMatch(styles, /agent-logo__metal/);
});

test("hero keeps its static title while preserving restrained mascot hover motion", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  assert.match(source, /<h1>Coding Wrapped<\/h1>/);
  assert.doesNotMatch(source, /AnimatedHeroTitle|hero-title__pixel/);
  assert.doesNotMatch(styles, /Pixelify Sans|hero-title-pixel-scan/);
  assert.match(styles, /\.hero-app-icon:hover/);
  assert.match(styles, /rotate\(7deg\) scale\(1\.14\)/);
});

test("live preview rotates through three direct product views without tour chrome", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  for (const view of ["overview", "insight", "data"]) {
    assert.match(source, new RegExp(`id: "${view}"`));
  }
  assert.match(source, /LIVE PREVIEW · LOCAL-FIRST/);
  assert.match(source, /setManualHoldUntil\(Date\.now\(\) \+ 12000\)/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(source, /INTERACTIVE DEMO|Tour \{|Next view|Resume|Pause/);
});

test("preview restores complete overview, insight deck, and behavior controls", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  assert.match(source, /OVERVIEW_PATTERNS/);
  assert.match(source, /overview-sources/);
  assert.match(source, /insight-deck-toolbar/);
  assert.match(source, /insight-card-preview--main/);
  assert.match(source, /insight-card-preview--left/);
  assert.match(source, /insight-card-preview--right/);
  assert.match(source, /insight-story__headline/);
  assert.match(source, /Use left and right arrow keys or swipe/);
  assert.match(source, /Customize · \{selectedMetrics\.length\} \/ \{METRICS\.length\}/);
  assert.match(source, /ACTIVITY_DAYS/);
  assert.equal(METRICS.length, 8);
  assert.match(styles, /\.metric-card--tone-0/);
  assert.match(styles, /\.metric-card--tone-3/);
  assert.match(source, /USE MY OWN DATA/);
  assert.match(source, /quiet=\{demoInView\}/);
  assert.match(styles, /\.page-dock\.is-quiet/);
  assert.doesNotMatch(styles, /\.demo-coach__progress/);
});

test("dock stays opaque and only collapses beside the desktop demo", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  assert.match(styles, /\.page-dock\s*\{[^}]*background:\s*var\(--paper\)/s);
  assert.doesNotMatch(styles, /\.page-dock\.is-quiet\s*\{[^}]*opacity:/s);
  assert.match(styles, /@media \(max-width: 820px\)[\s\S]*\.page-dock\.is-quiet\s*\{[^}]*left:\s*50%/s);
});

test("install actions mirror the hero arrow feedback", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  assert.match(source, /<span>Copy command<\/span><img[^>]*button__arrow/);
  assert.match(source, /<span>Read the docs<\/span><img[^>]*button__arrow/);
  assert.match(styles, /\.button:hover \.button__arrow/);
  assert.match(styles, /\.information-stage\s*\{[^}]*gap:\s*30px/s);
  assert.match(styles, /\.process-window\s*\{[^}]*background:\s*#efe1bd;[^}]*border:\s*var\(--line\)/s);
});

test("supported agent marks stay inline with the hero story", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  assert.match(source, /Now works with/);
  assert.match(source, /function InlineAgent/);
  assert.match(source, /Observe the way you build\./);
  assert.match(source, /Turn local AI-coding history into revealing stories/);
  assert.doesNotMatch(source, /hero-agent-row/);
});

test("short desktop viewports keep the hero clear of the dock", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  assert.match(styles, /@media \(min-width: 821px\) and \(max-height: 760px\)/);
  assert.match(styles, /\.hero\s*\{[^}]*align-items:\s*flex-end;[^}]*min-height:\s*100vh;[^}]*padding:\s*22px 24px 194px;/s);
  assert.match(styles, /\.hero-content\s*\{[^}]*transform:\s*none/s);
  assert.match(styles, /\.hero h1\s*\{[^}]*clamp\(60px, 8\.2vw, 116px\)/s);
  assert.match(styles, /\.hero h1\s*\{[^}]*clamp\(64px, 7\.6vw, 92px\)/s);
  assert.match(styles, /\.page-dock\s*\{[^}]*bottom:\s*50px/s);
  assert.match(styles, /overscroll-behavior-y: none/);
  assert.doesNotMatch(styles, /body\s*\{[^}]*overflow:\s*hidden/s);
});
