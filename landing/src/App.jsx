import { useEffect, useRef, useState } from "react";
import { bind, play, setVolume } from "cuelume";
import "@fontsource/tiny5/latin-400.css";
import { getLocalizedContent, INSTALL_COMMAND, LINKS } from "./content.js";

const AGENTS = [
  { name: "Codex", icon: "/assets/brand/codex.svg", slug: "codex" },
  { name: "Claude Code", icon: "/assets/brand/claudecode.svg", slug: "claude" },
];

const DEMO_VIEW_IDS = ["overview", "insight", "data"];

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

function InlineAgent({ agent, label }) {
  return (
    <span aria-label={`${agent.name} ${label}`} className={`inline-agent inline-agent--${agent.slug}`} tabIndex="0">
      <img alt="" decoding="async" height="32" src={agent.icon} width="32" />
      <strong>{agent.name}</strong>
      <span className="inline-agent__tooltip" role="tooltip">{agent.name} {label}</span>
    </span>
  );
}

function LocaleToggle({ copy, locale, onChange }) {
  return (
    <div aria-label={copy.languageLabel} className="locale-toggle" role="group">
      <button aria-pressed={locale === "en"} onClick={() => onChange("en")} type="button">EN</button>
      <button aria-pressed={locale === "zh"} onClick={() => onChange("zh")} type="button">中文</button>
    </div>
  );
}

function Hero({ copy, onInstall }) {
  return (
    <section className="hero" id="top">
      <div className="hero-content">
        <div className="hero-mascot">
          <img
            alt={copy.hero.mascotAlt}
            className="hero-app-icon"
            fetchPriority="high"
            height="512"
            src="/assets/coding-wrapped-mascot.webp"
            width="512"
          />
          <span aria-hidden="true" className="hero-mascot__eye hero-mascot__eye--left" />
          <span aria-hidden="true" className="hero-mascot__eye hero-mascot__eye--right" />
          <span aria-hidden="true" className="hero-mascot__spark" />
        </div>
        <h1>Coding Wrapped</h1>
        <div className="hero-lede">
          <p className="hero-lede__lead pixel-slogan">{copy.hero.slogan}</p>
          <p className="hero-lede__body">{copy.hero.body}</p>
        </div>
        <div className="hero-actions">
          <button className="button button--primary" data-cuelume-hover="tick" data-cuelume-toggle="pulse" onClick={onInstall} type="button">
            <span>{copy.hero.install}</span><img alt="" aria-hidden="true" className="button__arrow" height="96" src="/assets/button-arrow.png" width="96" />
          </button>
          <a className="button button--secondary" data-cuelume-hover="tick" data-cuelume-release="scan" href={LINKS.github} rel="noreferrer" target="_blank">
            <span>{copy.hero.github}</span><img alt="" aria-hidden="true" className="button__arrow" height="96" src="/assets/button-arrow.png" width="96" />
          </a>
        </div>
        <div className="hero-support-wrap">
          <div aria-hidden="true" className="hero-divider" />
          <div className="hero-support" aria-label={copy.hero.supportedAgents}>
            <span>{copy.hero.nowWorks}</span>
            {AGENTS.map((agent) => <InlineAgent agent={agent} key={agent.name} label={copy.agentSupported} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Dock({ compact = false, copy }) {
  const dockItems = [
    { label: copy.dock[0], icon: "/assets/coding-wrapped-app.webp", href: "#top" },
    { label: copy.dock[1], icon: "/assets/dock/github.webp", href: LINKS.github, external: true },
    { label: copy.dock[2], icon: "/assets/dock/sen-profile.webp", href: LINKS.profile, external: true },
    { label: copy.dock[3], icon: "/assets/dock/support-coffee.webp", href: LINKS.support, external: true },
  ];
  return (
    <nav aria-label={copy.dock[0]} className={`page-dock ${compact ? "is-compact" : ""}`}>
      {dockItems.map((item) => {
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

function OverviewPanel({ copy }) {
  return (
    <div className="demo-overview">
      <div className="overview-copy">
        <p className="panel-kicker">{copy.overview.kicker}</p>
        <h3>{copy.overview.title}</h3>
        <p>{copy.overview.body}</p>
        <div className="overview-patterns" aria-label={copy.overview.patternsLabel}>
          {copy.overview.patterns.map((pattern, index) => (
            <article key={pattern.title} style={{ "--pattern-delay": `${index * 180}ms` }}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><strong>{pattern.title}</strong><p>{pattern.copy}</p></div>
            </article>
          ))}
        </div>
        <div className="overview-sources">
          <span>{copy.overview.sources}</span>
          <div><strong>Codex</strong><small>{copy.overview.sessions[0]}</small></div>
          <div><strong>Claude Code</strong><small>{copy.overview.sessions[1]}</small></div>
        </div>
      </div>
      <div className="overview-visual">
        <img
          alt={copy.overview.privacy}
          decoding="async"
          height="1024"
          loading="lazy"
          src="/assets/illustrations/overview-calibration-loop.webp"
          width="1536"
        />
        <span>{copy.overview.privacy}</span>
      </div>
    </div>
  );
}

function InsightPanel({ activeIndex, copy, insights, isActive, onChange, onManualInteraction, reducedMotion }) {
  const insight = insights[activeIndex];
  const previousIndex = (activeIndex - 1 + insights.length) % insights.length;
  const nextIndex = (activeIndex + 1) % insights.length;
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
    selectInsight((activeIndex + offset + insights.length) % insights.length);
  };

  useEffect(() => {
    if (reducedMotion || !isActive) return undefined;
    const timer = window.setTimeout(() => {
      onChange((activeIndex + 1) % insights.length);
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
      aria-label={copy.insight.label}
      className={`insight-panel insight-panel--${insight.theme}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <header className="insight-deck-toolbar">
        <div>
          <p className="panel-kicker">{copy.insight.current} {String(activeIndex + 1).padStart(2, "0")} / 04</p>
          <span>{copy.insight.built}</span>
        </div>
        <div className="insight-deck-actions">
          <div className="insight-pagination" aria-label={copy.insight.choose}>
            {insights.map((item, index) => (
              <button
                aria-label={`${copy.insight.show} ${index + 1}: ${item.title}`}
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
          <button onClick={() => selectRelativeInsight(-1)} type="button">{copy.insight.previous}</button>
          <button onClick={() => selectRelativeInsight(1)} type="button">{copy.insight.next}</button>
        </div>
      </header>
      <div
        aria-label={copy.insight.imageLabel}
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
            key={insights[previousIndex].image}
            loading="lazy"
            src={insights[previousIndex].image}
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
            key={insights[nextIndex].image}
            loading="lazy"
            src={insights[nextIndex].image}
            width="768"
          />
        </figure>
        <span className="insight-swipe-hint">{copy.insight.swipe}</span>
      </div>
      <article className="insight-copy" aria-live="polite">
        <div className="insight-story" key={insight.title}>
          <div className="insight-story__headline">
            <div><p className="panel-kicker">{insight.title}</p><h3>{insight.stat}</h3></div>
            <p>{insight.summary}</p>
          </div>
          <dl>
            <div><dt>{copy.insight.did[0]}</dt><dd>{insight.youDid}</dd></div>
            <div><dt>{copy.insight.did[1]}</dt><dd>{insight.agentDid}</dd></div>
            <div><dt>{copy.insight.did[2]}</dt><dd>{insight.yourStyle}</dd></div>
          </dl>
          <div className="light-tip"><strong>{copy.insight.tip}</strong><span>{insight.tip}</span></div>
        </div>
      </article>
    </div>
  );
}

function ActivityGrid({ label }) {
  return (
    <div aria-label={label} className="activity-grid">
      {ACTIVITY_DAYS.map((level, index) => <i className={`is-level-${level}`} key={index} />)}
    </div>
  );
}

function DataPanel({ copy, isActive, metrics, onManualInteraction, reducedMotion }) {
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

  const visibleMetrics = metrics.filter((_, index) => selectedMetrics.includes(index));

  return (
    <div className="data-panel">
      <div className="data-panel__header">
        <div className="data-panel__intro">
          <p className="panel-kicker">{copy.data.kicker}</p>
          <h3>{copy.data.title}</h3>
          <p>{copy.data.body}</p>
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
            {copy.data.customize} · {selectedMetrics.length} / {metrics.length}
          </button>
          {showCustomizer && (
            <div className="metric-customizer" aria-label={copy.data.visible}>
              {metrics.map((metric, index) => (
                <button
                  aria-pressed={selectedMetrics.includes(index)}
                  className={selectedMetrics.includes(index) ? "is-selected" : ""}
                  key={metric.label}
                  onClick={() => toggleMetric(index)}
                  type="button"
                >
                  <span>{metric.label}</span><b>{selectedMetrics.includes(index) ? copy.data.on : copy.data.off}</b>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="metric-grid" aria-live="polite">
        {visibleMetrics.map((metric, visibleIndex) => {
          const metricIndex = metrics.indexOf(metric);
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
            {metric.kind === "activity" && <ActivityGrid label={copy.data.activity} />}
          </article>
          );
        })}
      </div>
      <p className="data-source-note">{copy.data.source}</p>
    </div>
  );
}

function DemoWindow({ activeIndex, copy, insights, metrics, onChange, onUseData, onViewChange, view }) {
  const [revealed, setRevealed] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [manualHoldUntil, setManualHoldUntil] = useState(0);
  const [renderedView, setRenderedView] = useState(view);
  const [contentPhase, setContentPhase] = useState("is-active");
  const reducedMotion = useReducedMotion();
  const activeViewIndex = DEMO_VIEW_IDS.findIndex((item) => item === view);

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
      const nextIndex = (activeViewIndex + 1) % DEMO_VIEW_IDS.length;
      onViewChange(DEMO_VIEW_IDS[nextIndex]);
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
    <WindowFrame className={`product-window ${revealed ? "is-visible" : ""}`} id="demo-window" title={copy.demo.title}>
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <img alt="" decoding="async" height="256" src="/assets/coding-wrapped-app.webp" width="256" />
          <div><strong>{copy.demo.brand}</strong><span>{copy.demo.locality}</span></div>
        </div>
        <div className="dashboard-title">
          <strong>{copy.demo.adventure}</strong>
          <span>{copy.demo.subtitle}</span>
        </div>
        <button data-cuelume-toggle="pulse" onClick={onUseData} type="button">{copy.demo.ownData}</button>
      </header>
      <div className="product-toolbar">
        <nav aria-label={copy.demo.viewLabel}>
          {DEMO_VIEW_IDS.map((item, index) => (
            <button aria-pressed={view === item} className={view === item ? "is-active" : ""} key={item} onClick={() => chooseView(item)} type="button">{copy.demo.views[index]}</button>
          ))}
        </nav>
        <span className="demo-status"><i aria-hidden="true" /> {copy.demo.status}</span>
      </div>
      <div className={`product-content ${contentPhase}`} data-view={renderedView}>
        {renderedView === "overview" && <OverviewPanel copy={copy} />}
        {renderedView === "insight" && <InsightPanel activeIndex={activeIndex} copy={copy} insights={insights} isActive={isInView} onChange={onChange} onManualInteraction={pauseAutoplayBriefly} reducedMotion={reducedMotion} />}
        {renderedView === "data" && <DataPanel copy={copy} isActive={isInView} metrics={metrics} onManualInteraction={pauseAutoplayBriefly} reducedMotion={reducedMotion} />}
      </div>
    </WindowFrame>
  );
}

function ProcessWindow({ copy }) {
  const { elementRef, revealed } = useScrollReveal();
  return (
    <section className={`process-window scroll-reveal ${revealed ? "is-revealed" : ""}`} aria-labelledby="how-it-works-title" ref={elementRef}>
      <div className="process-layout">
        <div className="process-story" aria-label={copy.process.alt} role="img">
          <span aria-hidden="true" className="story-sprite story-sprite--process">
            <img
              alt=""
              decoding="async"
              height="1024"
              loading="lazy"
              src="/assets/how-it-works-story-sprite.webp?v=2"
              width="1536"
            />
          </span>
        </div>
        <div>
          <p className="panel-kicker">{copy.process.kicker}</p>
          <h2 id="how-it-works-title">{copy.process.title}</h2>
          <ol>
            {copy.process.rows.map(([title, detail]) => <li key={title}><strong>{title}</strong><span>{detail}</span></li>)}
          </ol>
        </div>
      </div>
      <footer className="privacy-strip">{copy.process.privacy}</footer>
    </section>
  );
}

function PracticeTipsWindow({ copy }) {
  const { elementRef, revealed } = useScrollReveal();
  return (
    <section className={`practice-tips-window scroll-reveal ${revealed ? "is-revealed" : ""}`} aria-labelledby="practice-tips-title" ref={elementRef}>
      <div className="practice-tips-layout">
        <div className="practice-tips-copy">
          <p className="panel-kicker">{copy.tips.kicker}</p>
          <h2 id="practice-tips-title">{copy.tips.title}</h2>
          <p>
            {copy.tips.body} <a className="practice-library-link" data-cuelume-hover="tick" data-cuelume-release="scan" href={LINKS.practiceLibrary} rel="noreferrer" target="_blank">
              {copy.tips.library} <span aria-hidden="true">→</span>
            </a>
          </p>
          <ul aria-label="Practice source types" className="practice-source-types">
            {copy.tips.sourceTypes.map((sourceType) => <li key={sourceType}>{sourceType}</li>)}
          </ul>
          <article className="practice-tip-example">
            <header>
              <span>{copy.tips.lightTip}</span>
              <small>{copy.tips.matched}</small>
            </header>
            <p>{copy.tips.example}</p>
            <footer>
              <span>{copy.tips.basedOn}</span>
              <a data-cuelume-hover="tick" data-cuelume-release="scan" href="https://learn.chatgpt.com/docs/prompting" rel="noreferrer" target="_blank">{copy.tips.source}</a>
            </footer>
          </article>
        </div>
        <div className="practice-tips-visual" aria-label={copy.tips.alt} role="img">
          <span aria-hidden="true" className="story-sprite story-sprite--tips">
            <img
              alt=""
              decoding="async"
              height="1024"
              loading="lazy"
              src="/assets/practice-tips-story-sprite.webp?v=2"
              width="1536"
            />
          </span>
        </div>
      </div>
    </section>
  );
}

function InstallWindow({ copy, onCopy }) {
  const { elementRef, revealed } = useScrollReveal();
  return (
    <section className={`install-window scroll-reveal ${revealed ? "is-revealed" : ""}`} aria-labelledby="install-title" ref={elementRef}>
      <div className="install-layout">
        <div>
          <p className="panel-kicker">{copy.install.kicker}</p>
          <h2 id="install-title">{copy.install.title}</h2>
          <p>{copy.install.body}</p>
        </div>
        <pre><code>{INSTALL_COMMAND}</code></pre>
        <div className="install-actions">
          <button className="button button--primary" data-cuelume-press="press" onClick={onCopy} type="button">
            <span>{copy.install.copy}</span><img alt="" aria-hidden="true" className="button__arrow" height="96" src="/assets/button-arrow.png" width="96" />
          </button>
          <a className="button button--secondary" data-cuelume-hover="tick" data-cuelume-release="scan" href={LINKS.github} rel="noreferrer" target="_blank">
            <span>{copy.install.docs}</span><img alt="" aria-hidden="true" className="button__arrow" height="96" src="/assets/button-arrow.png" width="96" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function App() {
  const [locale, setLocale] = useState(() => {
    try {
      return window.localStorage.getItem("coding-wrapped-locale") === "zh" ? "zh" : "en";
    } catch {
      return "en";
    }
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [view, setView] = useState("overview");
  const [toast, setToast] = useState("");
  const isScrolling = useScrollActivity();
  const { insights, metrics, ui: copy } = getLocalizedContent(locale);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    try {
      window.localStorage.setItem("coding-wrapped-locale", locale);
    } catch {
      // Storage is optional; English remains the first-visit default.
    }
  }, [locale]);

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
      setToast(copy.toast.copied);
    } catch {
      play("error");
      setToast(copy.toast.fallback);
    }
  };

  const openInstall = () => document.querySelector("#install")?.scrollIntoView({ behavior: "smooth" });
  return (
    <main className={`site locale-${locale}`}>
      <div aria-hidden="true" className="desktop-background" />
      <LocaleToggle copy={copy} locale={locale} onChange={setLocale} />
      <Hero copy={copy} onInstall={openInstall} />
      <section className="demo-stage" id="demo">
        <DemoWindow
          activeIndex={activeIndex}
          copy={copy}
          insights={insights}
          metrics={metrics}
          onChange={setActiveIndex}
          onUseData={openInstall}
          onViewChange={setView}
          view={view}
        />
      </section>
      <section className="information-stage">
        <ProcessWindow copy={copy} />
        <PracticeTipsWindow copy={copy} />
        <div id="install"><InstallWindow copy={copy} onCopy={copyInstall} /></div>
      </section>
      <footer className="page-footer">
        <div><strong>Coding Wrapped</strong><span className="pixel-slogan">{copy.hero.slogan}</span></div>
        <a data-cuelume-hover="tick" data-cuelume-release="scan" href={LINKS.github} rel="noreferrer" target="_blank">{copy.footer.license}</a>
      </footer>
      <Dock compact={isScrolling} copy={copy} />
      {toast && <div aria-live="polite" className="toast" key={toast} role="status">{toast}</div>}
    </main>
  );
}
