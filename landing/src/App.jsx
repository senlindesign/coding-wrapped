import { useEffect, useState } from "react";
import { INSTALL_COMMAND, INSIGHTS, LINKS, METRICS } from "./content.js";

const AGENTS = [
  { name: "Codex", icon: "/assets/brand/codex.svg", slug: "codex" },
  { name: "Claude Code", icon: "/assets/brand/claudecode.svg", slug: "claude" },
];

const DOCK_ITEMS = [
  { label: "Coding Wrapped", icon: "/assets/coding-wrapped-app.webp", href: "#top" },
  { label: "GitHub", icon: "/assets/dock/github.webp", href: LINKS.github, external: true },
  { label: "Sen", icon: "/assets/dock/sen-profile.webp", href: LINKS.profile, external: true },
  { label: "Buy Me a Coffee", icon: "/assets/dock/support-coffee.webp", href: LINKS.support },
];

const DEMO_VIEWS = [
  { id: "overview", label: "Overview", description: "See the pattern behind your month before opening individual stories." },
  { id: "insight", label: "Insight deck", description: "Move through four illustrated moments built from safe aggregates." },
  { id: "data", label: "Behavior data", description: "Check the factual blocks that support every observation." },
];

function WindowFrame({ children, className = "", id, title, controls = true }) {
  return (
    <section className={`window-frame ${className}`} id={id}>
      <header className="window-titlebar">
        <div className="window-controls" aria-hidden="true">
          {controls && <><span /><span /></>}
        </div>
        <span>{title}</span>
        <div className="window-titlebar-spacer" />
      </header>
      {children}
    </section>
  );
}

function InlineAgent({ agent }) {
  return (
    <span aria-label={`${agent.name} supported`} className={`inline-agent inline-agent--${agent.slug}`} tabIndex="0">
      <img alt="" src={agent.icon} />
      <strong>{agent.name}</strong>
      <span className="inline-agent__tooltip" role="tooltip">{agent.name} supported</span>
    </span>
  );
}

function Hero({ onInstall }) {
  return (
    <section className="hero" id="top">
      <div className="hero-content">
        <img
          alt="Coding Wrapped — a pixel robot reading its coding log"
          className="hero-app-icon"
          src="/assets/coding-wrapped-mascot.webp"
        />
        <h1>Coding Wrapped</h1>
        <div className="hero-lede">
          <p className="hero-lede__lead">Observe the way you build.</p>
          <p className="hero-lede__body">
            Turn local AI-coding history into revealing stories and practical
            next steps. One shot. Nothing leaves your machine.
          </p>
        </div>
        <div className="hero-actions">
          <button className="button button--primary" onClick={onInstall} type="button">
            <span>Install Skill</span><img alt="" aria-hidden="true" className="button__arrow" src="/assets/button-arrow.png" />
          </button>
          <a className="button button--secondary" href={LINKS.github} rel="noreferrer" target="_blank">
            <span>Go to GitHub</span><img alt="" aria-hidden="true" className="button__arrow" src="/assets/button-arrow.png" />
          </a>
        </div>
        <div className="hero-support-wrap">
          <div aria-hidden="true" className="hero-divider" />
          <div className="hero-support" aria-label="Supported coding agents">
            <span>Now works with</span>
            {AGENTS.map((agent) => <InlineAgent agent={agent} key={agent.name} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Dock({ onUnavailable }) {
  return (
    <nav aria-label="Quick links" className="page-dock">
      {DOCK_ITEMS.map((item) => {
        const content = (
          <>
            <img alt="" src={item.icon} />
            <span>{item.label}</span>
          </>
        );

        if (!item.href) {
          return (
            <button aria-label={`${item.label} — link coming soon`} key={item.label} onClick={onUnavailable} type="button">
              {content}
            </button>
          );
        }

        return (
          <a
            aria-label={item.label}
            href={item.href}
            key={item.label}
            rel={item.external ? "noreferrer" : undefined}
            target={item.external ? "_blank" : undefined}
          >
            {content}
          </a>
        );
      })}
    </nav>
  );
}

function OverviewPanel() {
  return (
    <div className="demo-overview">
      <div className="overview-copy">
        <p className="panel-kicker">YOUR CODING OVERVIEW</p>
        <h3>You steer by correction, not by specification.</h3>
        <p>
          Across 23 sessions, your short prompts kept work moving while the
          agent carried the implementation detail. Your clearest pattern is a
          fast loop: point, inspect, adjust, continue.
        </p>
        <div className="mini-metrics">
          {METRICS.slice(0, 3).map((metric) => (
            <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>
          ))}
        </div>
      </div>
      <div className="overview-visual">
        <img alt="A pixel-art person directing a fleet of coding agents" src={INSIGHTS[0].image} />
      </div>
    </div>
  );
}

function InsightPanel({ activeIndex, onChange }) {
  const insight = INSIGHTS[activeIndex];
  return (
    <div className={`insight-panel insight-panel--${insight.theme}`}>
      <div className="insight-image-wrap">
        <img alt={insight.alt} src={insight.image} />
        <div className="insight-pagination" aria-label="Choose an insight">
          {INSIGHTS.map((item, index) => (
            <button
              aria-label={`Show insight ${index + 1}: ${item.title}`}
              aria-pressed={index === activeIndex}
              className={index === activeIndex ? "is-active" : ""}
              key={item.title}
              onClick={() => onChange(index)}
              type="button"
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>
      <article className="insight-copy">
        <p className="panel-kicker">INSIGHT {String(activeIndex + 1).padStart(2, "0")} / 04</p>
        <h3>{insight.title}</h3>
        <p className="insight-stat">{insight.stat}</p>
        <dl>
          <div><dt>You did</dt><dd>{insight.youDid}</dd></div>
          <div><dt>Agent did</dt><dd>{insight.agentDid}</dd></div>
          <div><dt>Your style</dt><dd>{insight.yourStyle}</dd></div>
        </dl>
        <div className="light-tip"><strong>Light tip</strong><span>{insight.tip}</span></div>
      </article>
    </div>
  );
}

function DataPanel() {
  return (
    <div className="data-panel">
      <div className="data-panel__intro">
        <p className="panel-kicker">THE FACTUAL LAYER</p>
        <h3>A dashboard made from aggregates, not transcripts.</h3>
        <p>Choose the blocks that matter to you. The private source material stays out of the page.</p>
      </div>
      <div className="metric-grid">
        {METRICS.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.note}</small>
          </article>
        ))}
      </div>
    </div>
  );
}

function DemoWindow({ activeIndex, onChange, onViewChange, view }) {
  const [revealed, setRevealed] = useState(false);
  const [tourPaused, setTourPaused] = useState(false);
  const activeViewIndex = DEMO_VIEWS.findIndex((item) => item.id === view);
  const activeView = DEMO_VIEWS[activeViewIndex];

  useEffect(() => {
    const element = document.querySelector("#demo-window");
    if (!element || !window.IntersectionObserver) {
      setRevealed(true);
      return undefined;
    }

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!revealed || tourPaused) return undefined;
    const timer = window.setTimeout(() => {
      const nextIndex = (activeViewIndex + 1) % DEMO_VIEWS.length;
      onViewChange(DEMO_VIEWS[nextIndex].id);
    }, 6200);
    return () => window.clearTimeout(timer);
  }, [activeViewIndex, onViewChange, revealed, tourPaused]);

  const chooseView = (nextView) => {
    setTourPaused(true);
    onViewChange(nextView);
  };

  return (
    <WindowFrame className={`product-window ${revealed ? "is-visible" : ""}`} id="demo-window" title="127.0.0.1 / coding-wrapped">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <img alt="" src="/assets/coding-wrapped-app.webp" />
          <div><strong>CODING WRAPPED</strong><span>PERSONAL / LOCAL</span></div>
        </div>
        <div className="dashboard-title">
          <strong>SEN'S CODING ADVENTURE LOG</strong>
          <span>See how you and AI actually get things made together.</span>
        </div>
        <button type="button">SCAN FACT DATA</button>
      </header>
      <div className="product-toolbar">
        <nav aria-label="Demo views">
          {DEMO_VIEWS.map((item) => (
            <button aria-pressed={view === item.id} className={view === item.id ? "is-active" : ""} key={item.id} onClick={() => chooseView(item.id)} type="button">{item.label}</button>
          ))}
        </nav>
        <span className="demo-status">SYNTHETIC DEMO · LOCAL-FIRST</span>
      </div>
      <div className="demo-coach" aria-live="polite">
        <div className="demo-coach__copy">
          <span>INTERACTIVE DEMO</span>
          <strong>{activeView.label}</strong>
          <small>{activeView.description}</small>
        </div>
        <div className="demo-coach__steps" aria-label="Demo tour progress">
          {DEMO_VIEWS.map((item, index) => (
            <button
              aria-label={`Open ${item.label}`}
              aria-pressed={view === item.id}
              className={view === item.id ? "is-active" : ""}
              key={item.id}
              onClick={() => chooseView(item.id)}
              type="button"
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
        <button className="demo-coach__toggle" onClick={() => setTourPaused((paused) => !paused)} type="button">
          {tourPaused ? "Resume tour" : "Pause tour"}
        </button>
        {!tourPaused && <span className="demo-coach__timer" key={view} />}
      </div>
      <div className="product-content" key={view}>
        {view === "overview" && <OverviewPanel />}
        {view === "insight" && <InsightPanel activeIndex={activeIndex} onChange={onChange} />}
        {view === "data" && <DataPanel />}
      </div>
    </WindowFrame>
  );
}

function ProcessWindow() {
  return (
    <WindowFrame className="process-window" title="How it works">
      <div className="process-layout">
        <img
          alt="A pixel-art flow from scanning local coding logs, to wrapping safe data, to exploring finished insights"
          className="process-illustration"
          src="/assets/how-it-works-flow.png"
        />
        <div>
          <p className="panel-kicker">THREE SMALL STEPS</p>
          <h2>From local traces to a story you recognize.</h2>
          <ol>
            <li><strong>Scan</strong><span>Read standard Claude Code and Codex session folders locally.</span></li>
            <li><strong>Wrap</strong><span>Turn safe aggregates into an overview and four distinct insights.</span></li>
            <li><strong>Explore</strong><span>Open a private localhost dashboard, refresh facts, or export intentionally.</span></li>
          </ol>
        </div>
      </div>
      <footer className="privacy-strip">Raw conversations, source code, project names, local paths and secrets stay out of the website.</footer>
    </WindowFrame>
  );
}

function InstallWindow({ onCopy }) {
  return (
    <WindowFrame className="install-window" title="Install Coding Wrapped">
      <div className="install-layout">
        <div>
          <p className="panel-kicker">ONE COMMAND · CLAUDE CODE + CODEX</p>
          <h2>Give your coding history a plot.</h2>
          <p>Install the same open Agent Skill on both platforms. No separate product and no cloud account.</p>
        </div>
        <pre><code>{INSTALL_COMMAND}</code></pre>
        <div className="install-actions">
          <button className="button button--primary" onClick={onCopy} type="button">Copy command</button>
          <a className="button button--secondary" href={LINKS.github} rel="noreferrer" target="_blank">Read the docs</a>
        </div>
      </div>
    </WindowFrame>
  );
}

export function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [view, setView] = useState("overview");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setToast("Install command copied.");
    } catch {
      setToast("Select the command in the install window to copy it.");
    }
  };

  const openInstall = () => document.querySelector("#install")?.scrollIntoView({ behavior: "smooth" });
  return (
    <main>
      <div aria-hidden="true" className="desktop-background" />
      <Hero onInstall={openInstall} />
      <section className="demo-stage" id="demo">
        <DemoWindow activeIndex={activeIndex} onChange={setActiveIndex} onViewChange={setView} view={view} />
      </section>
      <section className="information-stage">
        <ProcessWindow />
        <div id="install"><InstallWindow onCopy={copyInstall} /></div>
      </section>
      <footer className="page-footer">
        <div><strong>Coding Wrapped</strong></div>
        <a href={LINKS.github} rel="noreferrer" target="_blank">MIT · OPEN SOURCE</a>
      </footer>
      <Dock onUnavailable={() => setToast("Buy Me a Coffee link coming soon.")} />
      {toast && <div aria-live="polite" className="toast" role="status">{toast}</div>}
    </main>
  );
}
