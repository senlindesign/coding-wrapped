import { useEffect, useRef, useState } from "react";
import { bind, play, setVolume } from "cuelume";
import { INSTALL_COMMAND, INSIGHTS, LINKS, METRICS } from "./content.js";

const AGENTS = [
  { name: "Codex", icon: "/assets/brand/codex.svg", slug: "codex" },
  { name: "Claude Code", icon: "/assets/brand/claudecode.svg", slug: "claude" },
];

const DOCK_ITEMS = [
  { label: "Coding Wrapped", icon: "/assets/coding-wrapped-app.webp", href: "#top" },
  { label: "GitHub", icon: "/assets/dock/github.webp", href: LINKS.github, external: true },
  { label: "About Sen", icon: "/assets/dock/sen-profile.webp", href: LINKS.profile, external: true },
  { label: "Support the project", icon: "/assets/dock/support-coffee.webp", href: LINKS.support, external: true },
];

const DEMO_VIEWS = [
  { id: "overview", label: "Coding overview" },
  { id: "insight", label: "Insight deck" },
  { id: "data", label: "Behavior data" },
];

const OVERVIEW_PATTERNS = [
  { title: "Short prompts", copy: "Point, inspect, then adjust instead of writing the whole route upfront." },
  { title: "Long runs", copy: "Stay inside one thread long enough for decisions to compound." },
  { title: "Calibration", copy: "Use small corrections to keep a trusted agent loop moving." },
];

const METRIC_PRESETS = [
  [0, 1, 2, 3],
  [0, 1, 2, 3, 4, 5],
  [0, 1, 2, 3, 4, 5, 6, 7],
];

const ACTIVITY_DAYS = [
  0, 1, 1, 2, 0, 1, 0,
  1, 2, 1, 3, 2, 0, 1,
  2, 3, 1, 2, 3, 1, 0,
  0, 2, 3, 2, 1, 2, 0,
  1, 2,
];

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!media) return undefined;
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  return reducedMotion;
}

function useScrollActivity(idleDelay = 220) {
  const [isScrolling, setIsScrolling] = useState(false);
  const idleTimer = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, idleDelay);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.clearTimeout(idleTimer.current);
    };
  }, [idleDelay]);

  return isScrolling;
}

function useScrollReveal() {
  const elementRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (!element || prefersReducedMotion || !window.IntersectionObserver) {
      setRevealed(true);
      return undefined;
    }

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { elementRef, revealed };
}

function WindowFrame({ children, className = "", id, title }) {
  return (
    <section className={`window-frame ${className}`} id={id}>
      <header className="window-titlebar">
        <div className="window-controls" aria-hidden="true">
          <span /><span />
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
      <img alt="" decoding="async" height="32" src={agent.icon} width="32" />
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
          fetchPriority="high"
          height="512"
          src="/assets/coding-wrapped-mascot.webp"
          width="512"
        />
        <h1>Coding Wrapped</h1>
        <div className="hero-lede">
          <p className="hero-lede__lead pixel-slogan">Observe the way you build</p>
          <p className="hero-lede__body">
            Turn local AI-coding history into revealing stories and practical
            next steps. One shot. Nothing leaves your machine.
          </p>
        </div>
        <div className="hero-actions">
          <button className="button button--primary" data-cuelume-hover="tick" data-cuelume-toggle="pulse" onClick={onInstall} type="button">
            <span>Install Skill</span><img alt="" aria-hidden="true" className="button__arrow" height="96" src="/assets/button-arrow.png" width="96" />
          </button>
          <a className="button button--secondary" data-cuelume-hover="tick" data-cuelume-release="scan" href={LINKS.github} rel="noreferrer" target="_blank">
            <span>Go to GitHub</span><img alt="" aria-hidden="true" className="button__arrow" height="96" src="/assets/button-arrow.png" width="96" />
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

function Dock({ compact = false }) {
  return (
    <nav aria-label="Quick links" className={`page-dock ${compact ? "is-compact" : ""}`}>
      {DOCK_ITEMS.map((item) => {
        const content = (
          <>
            <img
              alt=""
              decoding="async"
              height="512"
              src={item.icon}
              width="512"
            />
            <span>{item.label}</span>
          </>
        );

        return (
          <a
            aria-label={item.label}
            data-cuelume-hover="tick"
            data-cuelume-release={item.external ? "scan" : "release"}
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
        <div className="overview-patterns" aria-label="Three coding patterns">
          {OVERVIEW_PATTERNS.map((pattern, index) => (
            <article key={pattern.title} style={{ "--pattern-delay": `${index * 180}ms` }}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><strong>{pattern.title}</strong><p>{pattern.copy}</p></div>
            </article>
          ))}
        </div>
        <div className="overview-sources">
          <span>Sources</span>
          <div><strong>Codex</strong><small>18 sessions</small></div>
          <div><strong>Claude Code</strong><small>5 sessions</small></div>
        </div>
      </div>
      <div className="overview-visual">
        <img
          alt="A pixel-art person making a small correction while one coding agent moves work through a feedback loop"
          decoding="async"
          height="1024"
          loading="lazy"
          src="/assets/illustrations/overview-calibration-loop.webp"
          width="1536"
        />
        <span>Local aggregates only · no transcript leaves your machine</span>
      </div>
    </div>
  );
}

function InsightPanel({ activeIndex, isActive, onChange, onManualInteraction, reducedMotion }) {
  const insight = INSIGHTS[activeIndex];
  const previousIndex = (activeIndex - 1 + INSIGHTS.length) % INSIGHTS.length;
  const nextIndex = (activeIndex + 1) % INSIGHTS.length;
  const pointerStartX = useRef(null);
  const pointerId = useRef(null);
  const wheelDistance = useRef(0);
  const wheelResetTimer = useRef(null);
  const wheelLockedUntil = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const selectInsight = (nextIndex) => {
    onManualInteraction?.();
    play("page");
    onChange(nextIndex);
  };
  const selectRelativeInsight = (offset) => {
    selectInsight((activeIndex + offset + INSIGHTS.length) % INSIGHTS.length);
  };

  useEffect(() => {
    if (reducedMotion || !isActive) return undefined;
    const timer = window.setTimeout(() => {
      onChange((activeIndex + 1) % INSIGHTS.length);
    }, 5200);
    return () => window.clearTimeout(timer);
  }, [activeIndex, isActive, onChange, reducedMotion]);

  useEffect(() => () => window.clearTimeout(wheelResetTimer.current), []);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectRelativeInsight(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectRelativeInsight(1);
    }
  };

  const resetPointerGesture = () => {
    pointerStartX.current = null;
    pointerId.current = null;
    setIsDragging(false);
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerStartX.current = event.clientX;
    pointerId.current = event.pointerId;
    setIsDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerUp = (event) => {
    if (pointerStartX.current === null || pointerId.current !== event.pointerId) return;
    const distance = event.clientX - pointerStartX.current;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    resetPointerGesture();
    if (Math.abs(distance) < 44) return;
    selectRelativeInsight(distance > 0 ? -1 : 1);
  };

  const handleWheel = (event) => {
    if (Math.abs(event.deltaX) < 8 || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    if (Date.now() < wheelLockedUntil.current) return;

    wheelDistance.current += event.deltaX;
    window.clearTimeout(wheelResetTimer.current);
    wheelResetTimer.current = window.setTimeout(() => { wheelDistance.current = 0; }, 180);

    if (Math.abs(wheelDistance.current) < 56) return;
    selectRelativeInsight(wheelDistance.current > 0 ? 1 : -1);
    wheelDistance.current = 0;
    wheelLockedUntil.current = Date.now() + 520;
  };

  return (
    <div
      aria-label="Insight stories. Use left and right arrow keys or swipe to change the story."
      className={`insight-panel insight-panel--${insight.theme}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <header className="insight-deck-toolbar">
        <div>
          <p className="panel-kicker">CURRENT INSIGHT {String(activeIndex + 1).padStart(2, "0")} / 04</p>
          <span>BUILT FROM LOCAL DEMO DATA · AUTO PLAY</span>
        </div>
        <div className="insight-deck-actions">
          <div className="insight-pagination" aria-label="Choose an insight">
            {INSIGHTS.map((item, index) => (
              <button
                aria-label={`Show insight ${index + 1}: ${item.title}`}
                aria-pressed={index === activeIndex}
                className={index === activeIndex ? "is-active" : ""}
                key={item.title}
                onClick={() => selectInsight(index)}
                type="button"
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
          <button onClick={() => selectRelativeInsight(-1)} type="button">PREV</button>
          <button onClick={() => selectRelativeInsight(1)} type="button">NEXT</button>
        </div>
      </header>
      <div
        aria-label="An illustrated insight card stack. Drag or swipe horizontally to change insight."
        className={`insight-image-stage${isDragging ? " is-dragging" : ""}`}
        onDragStart={(event) => event.preventDefault()}
        onPointerCancel={resetPointerGesture}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
      >
        <figure className="insight-card-preview insight-card-preview--left" aria-hidden="true">
          <img
            alt=""
            decoding="async"
            draggable="false"
            height="512"
            key={INSIGHTS[previousIndex].image}
            loading="lazy"
            src={INSIGHTS[previousIndex].image}
            width="768"
          />
        </figure>
        <figure className="insight-card-preview insight-card-preview--main">
          <img
            alt={insight.alt}
            decoding="async"
            draggable="false"
            height="512"
            key={insight.image}
            loading="lazy"
            src={insight.image}
            width="768"
          />
        </figure>
        <figure className="insight-card-preview insight-card-preview--right" aria-hidden="true">
          <img
            alt=""
            decoding="async"
            draggable="false"
            height="512"
            key={INSIGHTS[nextIndex].image}
            loading="lazy"
            src={INSIGHTS[nextIndex].image}
            width="768"
          />
        </figure>
        <span className="insight-swipe-hint">SWIPE OR USE ARROW KEYS</span>
      </div>
      <article className="insight-copy" aria-live="polite">
        <div className="insight-story" key={insight.title}>
          <div className="insight-story__headline">
            <div><p className="panel-kicker">{insight.title}</p><h3>{insight.stat}</h3></div>
            <p>{insight.summary}</p>
          </div>
          <dl>
            <div><dt>You did</dt><dd>{insight.youDid}</dd></div>
            <div><dt>Agent did</dt><dd>{insight.agentDid}</dd></div>
            <div><dt>Your style</dt><dd>{insight.yourStyle}</dd></div>
          </dl>
          <div className="light-tip"><strong>Light tip</strong><span>{insight.tip}</span></div>
        </div>
      </article>
    </div>
  );
}

function ActivityGrid() {
  return (
    <div aria-label="30 day activity grid" className="activity-grid">
      {ACTIVITY_DAYS.map((level, index) => <i className={`is-level-${level}`} key={index} />)}
    </div>
  );
}

function DataPanel({ isActive, onManualInteraction, reducedMotion }) {
  const [selectedMetrics, setSelectedMetrics] = useState(METRIC_PRESETS[0]);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [userControlled, setUserControlled] = useState(false);

  useEffect(() => {
    if (reducedMotion || userControlled || !isActive) return undefined;
    let presetIndex = 0;
    const timer = window.setInterval(() => {
      presetIndex = (presetIndex + 1) % METRIC_PRESETS.length;
      setSelectedMetrics(METRIC_PRESETS[presetIndex]);
    }, 4400);
    return () => window.clearInterval(timer);
  }, [isActive, reducedMotion, userControlled]);

  const toggleMetric = (metricIndex) => {
    play("toggle");
    setUserControlled(true);
    onManualInteraction?.();
    setSelectedMetrics((current) => {
      if (current.includes(metricIndex)) {
        return current.length === 1 ? current : current.filter((item) => item !== metricIndex);
      }
      return [...current, metricIndex].sort((a, b) => a - b);
    });
  };

  const visibleMetrics = METRICS.filter((_, index) => selectedMetrics.includes(index));

  return (
    <div className="data-panel">
      <div className="data-panel__header">
        <div className="data-panel__intro">
          <p className="panel-kicker">YOUR CODING BEHAVIOR</p>
          <h3>Choose the facts that explain the pattern.</h3>
          <p>All blocks are safe aggregates. Select up to eight for the view you want to keep.</p>
        </div>
        <div className="data-customize">
          <button
            aria-expanded={showCustomizer}
            className="metric-toggle"
            onClick={() => {
              play(showCustomizer ? "droplet" : "bloom");
              setShowCustomizer((current) => !current);
              onManualInteraction?.();
            }}
            type="button"
          >
            Customize · {selectedMetrics.length} / {METRICS.length}
          </button>
          {showCustomizer && (
            <div className="metric-customizer" aria-label="Choose visible metrics">
              {METRICS.map((metric, index) => (
                <button
                  aria-pressed={selectedMetrics.includes(index)}
                  className={selectedMetrics.includes(index) ? "is-selected" : ""}
                  key={metric.label}
                  onClick={() => toggleMetric(index)}
                  type="button"
                >
                  <span>{metric.label}</span><b>{selectedMetrics.includes(index) ? "On" : "Off"}</b>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="metric-grid" aria-live="polite">
        {visibleMetrics.map((metric, visibleIndex) => {
          const metricIndex = METRICS.indexOf(metric);
          return (
          <article
            className={`metric-card metric-card--tone-${metricIndex % 4} ${metric.kind === "activity" ? "metric-card--activity" : ""}`}
            key={metric.label}
            style={{ "--metric-delay": `${visibleIndex * 34}ms` }}
            tabIndex={0}
          >
            <div className="metric-card__main">
              <span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.note}</small>
            </div>
            {metric.kind === "activity" && <ActivityGrid />}
          </article>
          );
        })}
      </div>
      <p className="data-source-note">Factual layer · derived locally from session aggregates</p>
    </div>
  );
}

function DemoWindow({ activeIndex, onChange, onUseData, onViewChange, view }) {
  const [revealed, setRevealed] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [manualHoldUntil, setManualHoldUntil] = useState(0);
  const [renderedView, setRenderedView] = useState(view);
  const [contentPhase, setContentPhase] = useState("is-active");
  const reducedMotion = useReducedMotion();
  const activeViewIndex = DEMO_VIEWS.findIndex((item) => item.id === view);

  useEffect(() => {
    const element = document.querySelector("#demo-window");
    if (!element || !window.IntersectionObserver) {
      setRevealed(true);
      setIsInView(true);
      return undefined;
    }

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        const nextIsInView = entry.isIntersecting && entry.intersectionRatio > 0.12;
        setIsInView(nextIsInView);
        if (entry.isIntersecting) {
          setRevealed(true);
        }
      },
      { threshold: [0, 0.12, 0.4] },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!revealed || !isInView || reducedMotion) return undefined;
    const now = Date.now();
    const isHolding = manualHoldUntil > now;
    const timer = window.setTimeout(() => {
      if (isHolding) {
        setManualHoldUntil(0);
        return;
      }
      const nextIndex = (activeViewIndex + 1) % DEMO_VIEWS.length;
      onViewChange(DEMO_VIEWS[nextIndex].id);
    }, isHolding ? manualHoldUntil - now : 6400);
    return () => window.clearTimeout(timer);
  }, [activeViewIndex, isInView, manualHoldUntil, onViewChange, reducedMotion, revealed]);

  useEffect(() => {
    if (view === renderedView) return undefined;
    if (reducedMotion) {
      setRenderedView(view);
      setContentPhase("is-active");
      return undefined;
    }

    setContentPhase("is-leaving");
    const swapTimer = window.setTimeout(() => {
      setRenderedView(view);
      setContentPhase("is-entering");
    }, 170);
    return () => window.clearTimeout(swapTimer);
  }, [reducedMotion, renderedView, view]);

  useEffect(() => {
    if (contentPhase !== "is-entering") return undefined;
    const settleTimer = window.setTimeout(() => setContentPhase("is-active"), 360);
    return () => window.clearTimeout(settleTimer);
  }, [contentPhase]);

  const pauseAutoplayBriefly = () => setManualHoldUntil(Date.now() + 12000);

  const chooseView = (nextView) => {
    play("toggle");
    pauseAutoplayBriefly();
    onViewChange(nextView);
  };

  return (
    <WindowFrame className={`product-window ${revealed ? "is-visible" : ""}`} id="demo-window" title="LIVE DEMO · 127.0.0.1 / coding-wrapped">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <img alt="" decoding="async" height="256" src="/assets/coding-wrapped-app.webp" width="256" />
          <div><strong>CODING WRAPPED</strong><span>PERSONAL / LOCAL</span></div>
        </div>
        <div className="dashboard-title">
          <strong>SEN'S CODING ADVENTURE LOG</strong>
          <span>See how you and AI actually get things made together.</span>
        </div>
        <button data-cuelume-toggle="pulse" onClick={onUseData} type="button">USE MY OWN DATA</button>
      </header>
      <div className="product-toolbar">
        <nav aria-label="Demo views">
          {DEMO_VIEWS.map((item) => (
            <button aria-pressed={view === item.id} className={view === item.id ? "is-active" : ""} key={item.id} onClick={() => chooseView(item.id)} type="button">{item.label}</button>
          ))}
        </nav>
        <span className="demo-status"><i aria-hidden="true" /> LIVE PREVIEW · LOCAL-FIRST</span>
      </div>
      <div className={`product-content ${contentPhase}`} data-view={renderedView}>
        {renderedView === "overview" && <OverviewPanel />}
        {renderedView === "insight" && <InsightPanel activeIndex={activeIndex} isActive={isInView} onChange={onChange} onManualInteraction={pauseAutoplayBriefly} reducedMotion={reducedMotion} />}
        {renderedView === "data" && <DataPanel isActive={isInView} onManualInteraction={pauseAutoplayBriefly} reducedMotion={reducedMotion} />}
      </div>
    </WindowFrame>
  );
}

function ProcessWindow() {
  const { elementRef, revealed } = useScrollReveal();
  return (
    <section className={`process-window scroll-reveal ${revealed ? "is-revealed" : ""}`} aria-labelledby="how-it-works-title" ref={elementRef}>
      <div className="process-layout">
        <img
          alt="A pixel-art flow from scanning local coding logs, to wrapping safe data, to exploring finished insights"
          className="process-illustration"
          decoding="async"
          height="1024"
          loading="lazy"
          src="/assets/how-it-works-flow-v2.webp"
          width="1536"
        />
        <div>
          <p className="panel-kicker">THREE SMALL STEPS</p>
          <h2 id="how-it-works-title">From local traces to a story you recognize.</h2>
          <ol>
            <li><strong>Scan</strong><span>Read standard Claude Code and Codex session folders locally.</span></li>
            <li><strong>Wrap</strong><span>Turn safe aggregates into an overview and four distinct insights.</span></li>
            <li><strong>Explore</strong><span>Open a private localhost dashboard, refresh facts, or export intentionally.</span></li>
          </ol>
        </div>
      </div>
      <footer className="privacy-strip">Raw conversations, source code, project names, local paths and secrets stay out of the website.</footer>
    </section>
  );
}

function PracticeTipsWindow() {
  const { elementRef, revealed } = useScrollReveal();
  return (
    <section className={`practice-tips-window scroll-reveal ${revealed ? "is-revealed" : ""}`} aria-labelledby="practice-tips-title" ref={elementRef}>
      <div className="practice-tips-layout">
        <div className="practice-tips-copy">
          <p className="panel-kicker">USEFUL TIPS</p>
          <h2 id="practice-tips-title">Small tips for your next coding session.</h2>
          <p>
            Coding Wrapped matches patterns in your local aggregates with
            trusted practices, then suggests one lightweight next move for
            your next coding session. <a className="practice-library-link" data-cuelume-hover="tick" data-cuelume-release="scan" href={LINKS.practiceLibrary} rel="noreferrer" target="_blank">
              View the practice library <span aria-hidden="true">→</span>
            </a>
          </p>
          <ul aria-label="Practice source types" className="practice-source-types">
            <li>Official guidance</li>
            <li>Practitioner playbooks</li>
            <li>Expert conversations</li>
          </ul>
          <article className="practice-tip-example">
            <header>
              <span>LIGHT TIP</span>
              <small>MATCHED TO · SHORT PROMPTS</small>
            </header>
            <p>Add one sentence describing what done looks like and one thing that must not change.</p>
            <footer>
              <span>BASED ON</span>
              <a data-cuelume-hover="tick" data-cuelume-release="scan" href="https://learn.chatgpt.com/docs/prompting" rel="noreferrer" target="_blank">OpenAI · Prompting</a>
            </footer>
          </article>
        </div>
        <div className="practice-tips-visual">
          <img
            alt="A pixel-art robot offering one lightweight tip before the coder's next session"
            decoding="async"
            height="1024"
            loading="lazy"
            src="/assets/practice-tip-next-session.webp"
            width="1536"
          />
        </div>
      </div>
    </section>
  );
}

function InstallWindow({ onCopy }) {
  const { elementRef, revealed } = useScrollReveal();
  return (
    <section className={`install-window scroll-reveal ${revealed ? "is-revealed" : ""}`} aria-labelledby="install-title" ref={elementRef}>
      <div className="install-layout">
        <div>
          <p className="panel-kicker">ONE COMMAND · CLAUDE CODE + CODEX</p>
          <h2 id="install-title">Give your coding history a plot.</h2>
          <p>Install the same open Agent Skill on both platforms. No separate product and no cloud account.</p>
        </div>
        <pre><code>{INSTALL_COMMAND}</code></pre>
        <div className="install-actions">
          <button className="button button--primary" data-cuelume-press="press" onClick={onCopy} type="button">
            <span>Copy command</span><img alt="" aria-hidden="true" className="button__arrow" height="96" src="/assets/button-arrow.png" width="96" />
          </button>
          <a className="button button--secondary" data-cuelume-hover="tick" data-cuelume-release="scan" href={LINKS.github} rel="noreferrer" target="_blank">
            <span>Read the docs</span><img alt="" aria-hidden="true" className="button__arrow" height="96" src="/assets/button-arrow.png" width="96" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [view, setView] = useState("overview");
  const [toast, setToast] = useState("");
  const isScrolling = useScrollActivity();

  useEffect(() => {
    setVolume(0.4);
    bind();
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      play("success");
      setToast("Install command copied.");
    } catch {
      play("error");
      setToast("Select the command in the install window to copy it.");
    }
  };

  const openInstall = () => document.querySelector("#install")?.scrollIntoView({ behavior: "smooth" });
  return (
    <main>
      <div aria-hidden="true" className="desktop-background" />
      <Hero onInstall={openInstall} />
      <section className="demo-stage" id="demo">
        <DemoWindow
          activeIndex={activeIndex}
          onChange={setActiveIndex}
          onUseData={openInstall}
          onViewChange={setView}
          view={view}
        />
      </section>
      <section className="information-stage">
        <ProcessWindow />
        <PracticeTipsWindow />
        <div id="install"><InstallWindow onCopy={copyInstall} /></div>
      </section>
      <footer className="page-footer">
        <div><strong>Coding Wrapped</strong><span className="pixel-slogan">Observe the way you build</span></div>
        <a data-cuelume-hover="tick" data-cuelume-release="scan" href={LINKS.github} rel="noreferrer" target="_blank">MIT · OPEN SOURCE</a>
      </footer>
      <Dock compact={isScrolling} />
      {toast && <div aria-live="polite" className="toast" key={toast} role="status">{toast}</div>}
    </main>
  );
}
