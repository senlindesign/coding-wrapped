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
  assert.equal(
    LINKS.practiceLibrary,
    "https://github.com/senlindesign/coding-wrapped/blob/accf079/skills/coding-wrapped/references/coding-best-practices.md",
  );
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
  const slogan = source.indexOf("Observe the way you ");
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

test("how it works uses an optimized dedicated three-step illustration", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  assert.match(source, /how-it-works-flow-v2\.webp/);
  assert.doesNotMatch(source, /Coding Wrapped app icon showing a robot reading a notebook/);
  await readFile(new URL("../public/assets/how-it-works-flow-v2.webp", import.meta.url));
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
  assert.doesNotMatch(styles, /hero-title-pixel-scan/);
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
  const overviewIllustration = await stat(new URL("../public/assets/illustrations/overview-calibration-loop.webp", import.meta.url));
  assert.match(source, /OVERVIEW_PATTERNS/);
  assert.match(source, /overview-sources/);
  assert.match(source, /overview-calibration-loop\.webp/);
  assert.doesNotMatch(source, /A pixel-art person directing a fleet of coding agents/);
  assert.ok(overviewIllustration.size > 0);
  assert.match(source, /insight-deck-toolbar/);
  assert.match(source, /insight-card-preview--main/);
  assert.match(source, /insight-card-preview--left/);
  assert.match(source, /insight-card-preview--right/);
  assert.match(source, /insight-story__headline/);
  assert.match(source, /Use left and right arrow keys or swipe/);
  assert.match(source, /onPointerDown=\{handlePointerDown\}/);
  assert.match(source, /onPointerUp=\{handlePointerUp\}/);
  assert.match(source, /onWheel=\{handleWheel\}/);
  assert.match(source, /wheelDistance\.current/);
  assert.doesNotMatch(source, /handleTouchEnd|touchStartX/);
  assert.match(styles, /\.insight-card-preview--main\s*\{[^}]*aspect-ratio:\s*3\s*\/\s*2/s);
  assert.match(styles, /\.insight-image-stage\s*\{[^}]*touch-action:\s*pan-y/s);
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
  assert.match(styles, /\.page-dock\.is-quiet\s*\{[^}]*translate3d\(calc\(50vw - 100% - 18px\)/s);
  assert.doesNotMatch(styles, /\.page-dock\.is-quiet\s*\{[^}]*left:\s*auto/s);
  assert.match(styles, /@media \(max-width: 820px\)[\s\S]*\.page-dock\.is-quiet\s*\{[^}]*translate3d\(-50%/s);
});

test("motion system smooths dock, view, deck, popover, and data transitions", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  for (const token of ["--motion-fast", "--motion-medium", "--motion-slow", "--ease-standard", "--ease-emphasized"]) {
    assert.match(styles, new RegExp(token));
  }
  assert.match(source, /contentPhase/);
  assert.match(source, /is-leaving/);
  assert.match(source, /is-entering/);
  assert.match(styles, /\.product-content\.is-leaving/);
  assert.match(styles, /\.product-content\.is-entering/);
  assert.match(styles, /@keyframes insight-side-enter-left/);
  assert.match(styles, /@keyframes metric-card-enter/);
  assert.match(styles, /@keyframes popover-enter/);
  assert.match(styles, /@keyframes toast-lifecycle/);
});

test("intentional controls use quiet semantic Cuelume feedback", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(packageJson.dependencies.cuelume, "^0.2.2");
  assert.match(source, /import \{ bind, play, setVolume \} from "cuelume"/);
  assert.match(source, /setVolume\(0\.32\);\s*bind\(\);/s);
  assert.match(source, /className="button button--primary" data-cuelume-hover="tick" data-cuelume-toggle="pulse"[^>]*>\s*<span>Install Skill<\/span>/s);
  assert.match(source, /data-cuelume-toggle="pulse"/);
  assert.match(source, /data-cuelume-hover="tick"/);
  assert.match(source, /data-cuelume-release="scan"/);
  assert.match(source, /play\("page"\)/);
  assert.match(source, /play\("toggle"\)/);
  assert.match(source, /play\(showCustomizer \? "droplet" : "bloom"\)/);
  assert.match(source, /play\("success"\)[\s\S]*Install command copied/);
  assert.match(source, /play\("error"\)[\s\S]*Select the command/);
});

test("demo and information panels share one responsive alignment contract", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  assert.match(styles, /--layout-gutter:\s*clamp\(16px, 2vw, 32px\)/);
  assert.match(styles, /--layout-max:\s*1420px/);
  assert.match(styles, /\.demo-stage\s*\{[^}]*padding:\s*0 var\(--layout-gutter\) 96px/s);
  assert.match(styles, /\.information-stage\s*\{[^}]*padding:\s*36px var\(--layout-gutter\) 150px/s);
  assert.match(styles, /\.product-window\s*\{[^}]*max-width:\s*var\(--layout-max\)[^}]*width:\s*100%/s);
  assert.match(styles, /\.practice-tips-window,\s*\.process-window,\s*\.install-window\s*\{[^}]*max-width:\s*var\(--layout-max\)[^}]*width:\s*100%/s);
});

test("process and install panels keep balanced desktop columns", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  assert.match(styles, /\.process-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) minmax\(0, 1fr\)/s);
  assert.match(styles, /\.process-layout > img\s*\{[^}]*max-width:\s*100%[^}]*width:\s*100%/s);
  assert.match(styles, /\.install-layout\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/s);
  assert.doesNotMatch(styles, /\.install-layout\s*\{[^}]*0\.86fr[^}]*1\.14fr/s);
});

test("practice tips module explains provenance and links the source-of-truth library", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const image = await stat(new URL("../public/assets/practice-tip-next-session.webp", import.meta.url));
  const tips = source.indexOf("<PracticeTipsWindow />");
  const process = source.indexOf("<ProcessWindow />");
  const install = source.indexOf("<InstallWindow onCopy={copyInstall} />");
  assert.ok(process > 0 && process < tips && tips < install);
  assert.match(source, /USEFUL TIPS/);
  assert.match(source, /Small tips for your next coding session\./);
  assert.match(source, /Official guidance/);
  assert.match(source, /Practitioner playbooks/);
  assert.match(source, /Expert conversations/);
  assert.match(source, /View the practice library/);
  assert.match(source, /next coding session\. <a className="practice-library-link"/);
  assert.match(styles, /\.practice-tips-window\s*\{[^}]*background:\s*#fdf7eb/s);
  assert.match(styles, /\.practice-tips-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) minmax\(0, 1fr\)/s);
  assert.match(styles, /\.process-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) minmax\(0, 1fr\)/s);
  assert.doesNotMatch(styles, /\.practice-tips-visual\s*\{[^}]*border-right:/s);
  assert.match(styles, /\.practice-source-types\s*\{[^}]*display:\s*grid[^}]*width:\s*100%/s);
  assert.match(styles, /\.practice-tip-example\s*\{[^}]*width:\s*100%/s);
  assert.ok(image.size > 0);
});

test("information panels reveal smoothly as they enter the viewport", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  assert.match(source, /function useScrollReveal/);
  assert.match(source, /rootMargin: "0px 0px -8% 0px"/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /process-window scroll-reveal/);
  assert.match(source, /practice-tips-window scroll-reveal/);
  assert.match(source, /install-window scroll-reveal/);
  assert.match(styles, /\.scroll-reveal\s*\{[^}]*opacity:\s*0[^}]*translateY\(34px\)/s);
  assert.match(styles, /\.scroll-reveal\.is-revealed\s*\{[^}]*opacity:\s*1/s);
  assert.doesNotMatch(styles, /\.scroll-reveal\s*\{[^}]*filter:\s*blur/s);
});

test("expensive demo updates pause when the preview leaves the viewport", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  assert.match(source, /const \[isInView, setIsInView\] = useState\(false\)/);
  assert.match(source, /if \(!revealed \|\| !isInView \|\| reducedMotion\) return undefined/);
  assert.match(source, /if \(reducedMotion \|\| !isActive\) return undefined/);
  assert.match(source, /if \(reducedMotion \|\| userControlled \|\| !isActive\) return undefined/);
});

test("large below-fold images are lazy, async decoded, and dimensioned", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  assert.match(source, /overview-calibration-loop\.webp[\s\S]*width="1536"/);
  assert.match(source, /loading="lazy"[\s\S]*how-it-works-flow-v2\.webp/);
  assert.match(source, /loading="lazy"[\s\S]*practice-tip-next-session\.webp/);
  assert.match(source, /loading="lazy"[^>]*src=\{insight\.image\}/);
  assert.match(source, /decoding="async"/);
});

test("install actions mirror the hero arrow feedback", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  assert.match(source, /<span>Copy command<\/span><img[^>]*button__arrow/);
  assert.match(source, /<span>Read the docs<\/span><img[^>]*button__arrow/);
  assert.match(styles, /\.button:hover \.button__arrow/);
  assert.match(styles, /\.information-stage\s*\{[^}]*gap:\s*30px/s);
  assert.match(styles, /\.process-window\s*\{[^}]*background:\s*var\(--panel-cream\);[^}]*border:\s*var\(--line\)/s);
});

test("information panels use the pale retro palette and the footer repeats the slogan", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  assert.match(styles, /--panel-cream:\s*#fbf7ed/);
  assert.match(styles, /--pink-soft:\s*#f4d7dc/);
  assert.match(styles, /--blue-soft:\s*#cfe8e6/);
  assert.match(styles, /\.privacy-strip\s*\{[^}]*background:\s*var\(--pink-soft\)/s);
  assert.match(styles, /\.install-layout pre\s*\{[^}]*background:\s*var\(--blue-soft\)/s);
  assert.match(styles, /\.install-actions \.button--primary\s*\{[^}]*background:\s*var\(--blue-soft\)/s);
  assert.match(styles, /\.install-actions \.button--secondary\s*\{[^}]*background:\s*#fffaf0;[^}]*color:\s*var\(--ink\)/s);
  assert.match(source, /<strong>Coding Wrapped<\/strong><span className="pixel-slogan">Observe the way you build<\/span>/);
  assert.match(styles, /\.page-footer\s*\{[^}]*padding:\s*18px 7vw;/s);
  assert.doesNotMatch(styles, /\.page-footer\s*\{[^}]*padding:[^;}]*78px/s);
  assert.match(styles, /@media \(max-width: 520px\)[\s\S]*\.page-footer\s*\{[^}]*padding:\s*18px 20px;/s);
});

test("the complete slogan drops its period and renders in a local pixel font", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const entry = await readFile(new URL("../src/main.jsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  assert.equal((source.match(/pixel-slogan/g) ?? []).length, 2);
  assert.match(source, /hero-lede__lead pixel-slogan">Observe the way you build<\/p>/);
  assert.doesNotMatch(source, /Observe the way you build\./);
  assert.match(entry, /@fontsource-variable\/pixelify-sans/);
  assert.match(styles, /\.pixel-slogan\s*\{[^}]*font-family:\s*"Pixelify Sans Variable"/s);
  assert.doesNotMatch(styles, /rainbow-build|rainbow-word/);
});

test("supported agent marks stay inline with the hero story", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  assert.match(source, /Now works with/);
  assert.match(source, /function InlineAgent/);
  assert.match(source, /Observe the way you /);
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
