import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Box,
  Clapperboard,
  Menu,
  MousePointer2,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import Reveal from "./components/Reveal";

const ImpactScene = lazy(() => import("./components/ImpactScene"));

const navigation = [
  { label: "Work", href: "#work" },
  { label: "Workflow", href: "#workflow" },
  { label: "About", href: "#about" },
];

const process = [
  {
    number: "01",
    title: "Listen",
    copy: "We lock in the mood, references, timing, and the feeling you want the scene to leave behind.",
    icon: MousePointer2,
  },
  {
    number: "02",
    title: "Build",
    copy: "I block the important poses first, then shape the choreography and camera around a clear visual rhythm.",
    icon: Box,
  },
  {
    number: "03",
    title: "Polish",
    copy: "Feedback passes refine the weight, flow, and small details until the animation feels ready to ship.",
    icon: Sparkles,
  },
];

function VideoEmbed() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="video-frame">
      {isPlaying ? (
        <iframe
          src="https://www.youtube-nocookie.com/embed/Xc6p7WxNs8Q?autoplay=1&rel=0"
          title="Combat Encounter Project: Roblox Studio Showcase"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          className="video-poster"
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label="Play Combat Encounter Project video"
        >
          <img
            src="https://i.ytimg.com/vi/Xc6p7WxNs8Q/maxresdefault.jpg"
            alt="Combat Encounter Project Roblox animation showcase"
            loading="lazy"
          />
          <span className="poster-shade" />
          <span className="poster-badge">Project film · 01</span>
          <span className="poster-action">
            <span className="play-button">
              <Play size={25} fill="currentColor" />
            </span>
            <span>Play showcase</span>
          </span>
        </button>
      )}
    </div>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="ARF Motion home">
        <span className="brand-mark">A</span>
        <span className="brand-copy">
          <strong>ARF</strong>
          <small>Motion</small>
        </span>
      </a>

      <nav className="desktop-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <button
        className="menu-button"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((value) => !value)}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {navigation.map((item, index) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                <span>0{index + 1}</span>
                {item.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function App() {
  return (
    <div className="site-shell" id="top">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />

      <main id="main-content">
        <section className="hero section-pad" aria-labelledby="hero-title">
          <div className="hero-copy">
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              Andrew Le · Roblox Animator
            </motion.p>
            <motion.h1
              id="hero-title"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.2, 0.75, 0.25, 1] }}
            >
              Combat,
              <span>built to land.</span>
            </motion.h1>
            <motion.p
              className="hero-intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
            >
              I create combat animation and cinematic sequences for Roblox—turning
              rough ideas into moments players can feel.
            </motion.p>
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26 }}
            >
              <a className="button button-dark" href="#work">
                View featured work <ArrowDown size={17} />
              </a>
              <a className="text-link" href="#workflow">
                See my workflow <ArrowUpRight size={16} />
              </a>
            </motion.div>
          </div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.12, ease: [0.2, 0.75, 0.25, 1] }}
          >
            <div className="visual-label">
              <span className="status-dot" /> Interactive impact study
            </div>
            <Suspense fallback={<div className="scene-fallback">Loading 3D scene…</div>}>
              <ImpactScene />
            </Suspense>
            <div className="visual-hint">
              <MousePointer2 size={15} /> Drag to explore
            </div>
            <div className="visual-index">03D</div>
          </motion.div>

          <div className="hero-facts" aria-label="Experience highlights">
            <div>
              <span>01</span>
              <strong>Since 2023</strong>
              <small>Commission experience</small>
            </div>
            <div>
              <span>02</span>
              <strong>Moon → Blender</strong>
              <small>An expanding workflow</small>
            </div>
            <div>
              <span>03</span>
              <strong>Combat + Cinematics</strong>
              <small>Motion with intent</small>
            </div>
          </div>
        </section>

        <section className="project-section section-pad" id="work" aria-labelledby="project-title">
          <div className="section-kicker light-kicker">
            <span>Selected work</span>
            <span>01 / 01</span>
          </div>

          <Reveal className="project-heading">
            <div>
              <p className="project-type">Featured project · Roblox Studio</p>
              <h2 id="project-title">Combat Encounter Animation Project</h2>
            </div>
            <a
              className="circle-link"
              href="https://youtu.be/Xc6p7WxNs8Q"
              target="_blank"
              rel="noreferrer"
              aria-label="Watch Combat Encounter Animation Project on YouTube"
            >
              <ArrowUpRight size={24} />
            </a>
          </Reveal>

          <Reveal className="video-shell" delay={0.08}>
            <VideoEmbed />
          </Reveal>

          <div className="project-details">
            <Reveal className="project-summary">
              <p>
                A first look at the combat-focused direction of my portfolio. This Roblox
                Studio showcase is built around readable action, purposeful timing, and the
                energy of an encounter in motion.
              </p>
            </Reveal>
            <Reveal className="project-meta" delay={0.08}>
              <div>
                <span>Focus</span>
                <strong>Combat animation</strong>
              </div>
              <div>
                <span>Platform</span>
                <strong>Roblox Studio</strong>
              </div>
              <div>
                <span>Format</span>
                <strong>Showcase reel</strong>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="process-section section-pad" aria-labelledby="process-title">
          <div className="section-kicker">
            <span>How I work</span>
            <span>Simple. Collaborative. Focused.</span>
          </div>
          <Reveal className="process-heading">
            <h2 id="process-title">
              Your idea first.
              <span>Then every frame.</span>
            </h2>
            <p>
              Good animation starts before the timeline. I want to understand the feeling
              you are chasing, then make each creative choice support it.
            </p>
          </Reveal>

          <div className="process-grid">
            {process.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal className="process-card" delay={index * 0.07} key={item.number}>
                  <div className="card-topline">
                    <span>{item.number}</span>
                    <Icon size={21} strokeWidth={1.7} />
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="workflow-section section-pad" id="workflow" aria-labelledby="workflow-title">
          <div className="workflow-copy">
            <div className="section-kicker light-kicker">
              <span>Workflow evolution</span>
              <span>2023 → Next</span>
            </div>
            <Reveal>
              <h2 id="workflow-title">
                Built in Roblox.
                <span>Growing in Blender.</span>
              </h2>
              <p className="workflow-intro">
                Moon Animator has been the foundation of my commission workflow since 2023.
                Now I am bringing Blender into the process to gain more control, push the
                polish further, and keep growing with every project.
              </p>
            </Reveal>
          </div>

          <div className="workflow-track">
            <Reveal className="workflow-step">
              <div className="workflow-marker">
                <span />
              </div>
              <div className="workflow-step-copy">
                <small>Foundation · 2023—Now</small>
                <h3>Moon Animator</h3>
                <p>
                  The tool that shaped my Roblox commission workflow and taught me how to
                  iterate quickly inside Studio.
                </p>
              </div>
              <Clapperboard size={28} strokeWidth={1.4} />
            </Reveal>

            <Reveal className="workflow-step current" delay={0.1}>
              <div className="workflow-marker">
                <span />
              </div>
              <div className="workflow-step-copy">
                <small>New direction · In progress</small>
                <h3>Blender</h3>
                <p>
                  A growing workflow for deeper control, cleaner motion, and more ambitious
                  animation work.
                </p>
              </div>
              <Box size={28} strokeWidth={1.4} />
            </Reveal>
          </div>
        </section>

        <section className="about-section section-pad" id="about" aria-labelledby="about-title">
          <div className="section-kicker">
            <span>A note from me</span>
            <span>Honest work over hype</span>
          </div>
          <Reveal className="about-layout">
            <h2 id="about-title">
              Portfolios are not my strongest skill.
              <span>Listening is.</span>
            </h2>
            <div className="about-copy">
              <p>
                I work hard to understand what you need and turn the version in your head
                into something that feels alive. Your goals, your references, and the dream
                behind the project matter to me.
              </p>
              <p>
                I am still learning, especially as I move into Blender, but I bring patience,
                effort, and care to the work. Every project is another chance to make something
                better than the last.
              </p>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer section-pad">
        <div className="footer-mark">ARF</div>
        <div className="footer-copy">
          <strong>Roblox animation with weight, rhythm, and intent.</strong>
          <small>© {new Date().getFullYear()} Andrew Le. Built for the next encounter.</small>
        </div>
        <a href="#top" className="back-to-top" aria-label="Back to top">
          <ArrowUpRight size={18} />
        </a>
      </footer>
    </div>
  );
}

export default App;
