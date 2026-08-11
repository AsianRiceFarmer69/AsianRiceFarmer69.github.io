import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import {
  ArrowRight,
  ChevronDown,
  Clapperboard,
  Code2,
  ExternalLink,
  Film,
  Layers3,
  Moon,
  Play,
  Sparkles,
  Sun,
  WandSparkles,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import AnimatedButton from "./components/ui/AnimatedButton";
import AnimatedNumber from "./components/ui/AnimatedNumber";

const VIDEO_ID = "Xc6p7WxNs8Q";

const navigation = [
  { value: "work", label: "Work" },
  { value: "process", label: "Process" },
  { value: "about", label: "About" },
];

const services = [
  {
    icon: Clapperboard,
    title: "Combat",
    copy: "Readable attacks, reactions, timing, and choreography.",
  },
  {
    icon: Film,
    title: "Cinematics",
    copy: "Camera-led sequences built around story and impact.",
  },
  {
    icon: Layers3,
    title: "Commissions",
    copy: "Animation shaped around your brief, references, and notes.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Listen",
    summary: "Your idea comes first.",
    detail:
      "I start with the action, mood, references, and constraints so I understand the version you already have in your head.",
  },
  {
    number: "02",
    title: "Animate",
    summary: "Build the motion clearly.",
    detail:
      "I block the important poses and timing in Moon Animator, then shape the movement so every beat reads inside Roblox.",
  },
  {
    number: "03",
    title: "Polish",
    summary: "Refine through feedback.",
    detail:
      "I respond to notes, tighten the performance, and keep learning Blender to bring more control and polish into future work.",
  },
];

function MotionAvatar({ reduceMotion }) {
  const loop = reduceMotion ? undefined : { repeat: Infinity, ease: "easeInOut" };
  const [frame, setFrame] = useState(24);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const frameTimer = window.setInterval(() => {
      setFrame((current) => (current >= 96 ? 24 : current + 8));
    }, 900);
    return () => window.clearInterval(frameTimer);
  }, [reduceMotion]);

  return (
    <div className="motion-avatar" role="img" aria-label="Animated Roblox-style character rig">
      <span className="avatar-orbit avatar-orbit-one" aria-hidden="true" />
      <span className="avatar-orbit avatar-orbit-two" aria-hidden="true" />
      <svg className="avatar-rig" viewBox="0 0 180 180" aria-hidden="true">
        <motion.g
          className="rig-group"
          data-motion="avatar"
          animate={reduceMotion ? undefined : { y: [2, -5, 2], rotate: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 2.4, ...loop }}
          style={{ transformOrigin: "90px 96px" }}
        >
          <motion.rect
            className="rig-limb rig-arm-left"
            x="34"
            y="77"
            width="38"
            height="15"
            rx="7"
            animate={reduceMotion ? undefined : { rotate: [20, -24, 20] }}
            transition={{ duration: 1.2, ...loop }}
            style={{ transformBox: "fill-box", transformOrigin: "100% 50%" }}
          />
          <motion.rect
            className="rig-limb rig-arm-right"
            x="108"
            y="77"
            width="38"
            height="15"
            rx="7"
            animate={reduceMotion ? undefined : { rotate: [-20, 24, -20] }}
            transition={{ duration: 1.2, ...loop }}
            style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}
          />
          <motion.rect
            className="rig-limb rig-leg-left"
            x="66"
            y="111"
            width="18"
            height="42"
            rx="8"
            animate={reduceMotion ? undefined : { rotate: [-8, 10, -8] }}
            transition={{ duration: 1.2, ...loop }}
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
          />
          <motion.rect
            className="rig-limb rig-leg-right"
            x="96"
            y="111"
            width="18"
            height="42"
            rx="8"
            animate={reduceMotion ? undefined : { rotate: [10, -8, 10] }}
            transition={{ duration: 1.2, ...loop }}
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
          />
          <rect className="rig-body" x="65" y="69" width="50" height="53" rx="11" />
          <motion.circle
            className="rig-head"
            cx="90"
            cy="48"
            r="20"
            animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
            transition={{ duration: 1.2, ...loop }}
            style={{ transformOrigin: "90px 48px" }}
          />
          <path className="rig-face" d="M82 49h16M90 41v16" />
        </motion.g>
      </svg>
      <div className="avatar-frame">
        <span>FRAME</span> <AnimatedNumber value={frame} />
      </div>
      <span className="avatar-playhead" data-motion="playhead" aria-hidden="true" />
    </div>
  );
}

function ProfileSidebar({ reduceMotion }) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <aside
      className="profile-card"
      data-sidebar
      data-details-open={detailsOpen ? "true" : "false"}
    >
      <div className="profile-summary">
        <MotionAvatar reduceMotion={reduceMotion} />
        <div className="profile-title">
          <p className="profile-kicker">Roblox animation</p>
          <h1>Andrew Le</h1>
          <span>Roblox Animator</span>
        </div>
      </div>

      <button
        className="details-toggle"
        data-sidebar-toggle
        type="button"
        aria-expanded={detailsOpen}
        aria-controls="profile-details"
        onClick={() => setDetailsOpen((open) => !open)}
      >
        <span>{detailsOpen ? "Hide details" : "Show details"}</span>
        <motion.span animate={{ rotate: detailsOpen ? 180 : 0 }}>
          <ChevronDown size={16} />
        </motion.span>
      </button>

      <div
        className="profile-details-wrap"
        data-sidebar-details
        data-open={detailsOpen ? "true" : "false"}
      >
        <div className="profile-details" id="profile-details">
          <div className="profile-divider" />
          <dl className="profile-facts">
            <div>
              <dt>Focus</dt>
              <dd>Combat &amp; cinematics</dd>
            </div>
            <div>
              <dt>Experience</dt>
              <dd>Commissions since 2023</dd>
            </div>
            <div>
              <dt>Tools</dt>
              <dd>Moon Animator + Blender</dd>
            </div>
          </dl>

          <div className="profile-status">
            <span className="status-pulse" aria-hidden="true" />
            Building better motion, one frame at a time.
          </div>

          <a
            className="source-link"
            href="https://github.com/AsianRiceFarmer69/AsianRiceFarmer69.github.io"
            target="_blank"
            rel="noreferrer"
          >
            <Code2 size={15} /> View source <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </aside>
  );
}

function TiltShowcase({ children, reduceMotion }) {
  const cardRef = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 260, damping: 24 });
  const springY = useSpring(rotateY, { stiffness: 260, damping: 24 });

  function handlePointerMove(event) {
    if (reduceMotion || event.pointerType === "touch") return;
    const bounds = cardRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    rotateY.set(horizontal * 8);
    rotateX.set(vertical * -6);
  }

  function resetTilt() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.article
      ref={cardRef}
      className="showcase-card"
      data-testid="tilt-showcase"
      data-interactive="project-card"
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 1100 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      {children}
    </motion.article>
  );
}

function VideoShowcase({ reduceMotion }) {
  const previewUrl = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&rel=0&playsinline=1`;

  return (
    <Dialog.Root>
      <TiltShowcase reduceMotion={reduceMotion}>
        <div className="video-stage">
          <img
            className="video-fallback"
            src={`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
            alt="Combat Encounter Animation Project in Roblox Studio"
          />
          {!reduceMotion && (
            <iframe
              className="video-preview"
              src={previewUrl}
              title="Muted moving preview of the Combat Encounter Animation Project"
              allow="autoplay; encrypted-media; picture-in-picture"
              loading="eager"
              tabIndex="-1"
            />
          )}
          <span className="video-vignette" aria-hidden="true" />
          <span className="moving-badge">
            <span aria-hidden="true" /> Moving preview
          </span>
          <Dialog.Trigger asChild>
            <AnimatedButton
              className="watch-button"
              data-video-trigger
              type="button"
              aria-label="Watch Combat Encounter Animation Project with sound"
            >
              <span className="watch-icon"><Play size={18} fill="currentColor" /></span>
              Watch with sound
            </AnimatedButton>
          </Dialog.Trigger>
        </div>

        <div className="showcase-caption">
          <div>
            <p>Roblox Studio / Combat animation</p>
            <h3>Combat Encounter Animation Project</h3>
          </div>
          <a
            href={`https://youtu.be/${VIDEO_ID}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Open the project on YouTube"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </TiltShowcase>

      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div className="dialog-heading">
            <div>
              <Dialog.Title>Combat Encounter Animation Project</Dialog.Title>
              <Dialog.Description>Roblox Studio animation showcase</Dialog.Description>
            </div>
            <Dialog.Close className="dialog-close" aria-label="Close video">
              <X size={20} />
            </Dialog.Close>
          </div>
          <div className="dialog-video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
              title="Combat Encounter Animation Project: Roblox Studio showcase"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function PanelHeading({ eyebrow, title, id, children }) {
  return (
    <header className="panel-heading">
      <p>{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      <span className="heading-line" aria-hidden="true" />
      {children && <div className="panel-lead">{children}</div>}
    </header>
  );
}

function WorkPanel({ reduceMotion }) {
  return (
    <motion.section
      className="panel work-panel"
      aria-labelledby="work-heading"
      initial={reduceMotion ? false : { opacity: 0, x: 34 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, x: -24 }}
      transition={{ duration: 0.34, ease: [0.2, 0.75, 0.25, 1] }}
    >
      <PanelHeading eyebrow="Selected work" title="Roblox Animation" id="work-heading">
        <p>
          I animate readable combat and cinematic sequences for Roblox projects.
        </p>
      </PanelHeading>

      <VideoShowcase reduceMotion={reduceMotion} />

      <div className="kinetic-strip" aria-hidden="true">
        <motion.div
          className="kinetic-track"
          animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        >
          <span>COMBAT ANIMATION&nbsp; / &nbsp;CINEMATICS&nbsp; / &nbsp;ROBLOX COMMISSIONS&nbsp; / &nbsp;</span>
          <span>COMBAT ANIMATION&nbsp; / &nbsp;CINEMATICS&nbsp; / &nbsp;ROBLOX COMMISSIONS&nbsp; / &nbsp;</span>
        </motion.div>
      </div>

      <div className="service-grid">
        {services.map(({ icon: Icon, title, copy }, index) => (
          <motion.article
            className="service-card"
            key={title}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + index * 0.07 }}
            whileHover={reduceMotion ? undefined : { y: -8, rotate: index === 1 ? 0.7 : -0.7 }}
          >
            <span className="service-icon"><Icon size={20} /></span>
            <div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
            <ArrowRight className="service-arrow" size={17} aria-hidden="true" />
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

function ProcessPanel({ reduceMotion }) {
  const [activeStep, setActiveStep] = useState(0);
  const selected = processSteps[activeStep];

  return (
    <motion.section
      className="panel process-panel"
      aria-labelledby="process-heading"
      initial={reduceMotion ? false : { opacity: 0, x: 34 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, x: -24 }}
      transition={{ duration: 0.34, ease: [0.2, 0.75, 0.25, 1] }}
    >
      <PanelHeading eyebrow="From idea to impact" title="My Process" id="process-heading">
        <p>Click a step to see how I approach a commission.</p>
      </PanelHeading>

      <div className="process-layout">
        <div className="process-list" aria-label="Animation process steps">
          {processSteps.map((step, index) => (
            <button
              type="button"
              className="process-step"
              data-active={activeStep === index ? "true" : "false"}
              onClick={() => setActiveStep(index)}
              key={step.number}
            >
              <span>{step.number}</span>
              <div>
                <strong>{step.title}</strong>
                <small>{step.summary}</small>
              </div>
              <ArrowRight size={17} />
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            className="process-detail"
            key={selected.number}
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12, scale: 0.985 }}
            transition={{ duration: 0.24 }}
          >
            <span className="detail-number">{selected.number}</span>
            <WandSparkles size={30} aria-hidden="true" />
            <h3>{selected.title}</h3>
            <p>{selected.detail}</p>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="tool-path">
        <div>
          <span>Foundation / since 2023</span>
          <strong>Moon Animator</strong>
        </div>
        <div className="tool-path-line" aria-hidden="true">
          <motion.span
            initial={reduceMotion ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: 0.2 }}
          />
          <ArrowRight size={18} />
        </div>
        <div>
          <span>Learning now</span>
          <strong>Blender</strong>
        </div>
      </div>
    </motion.section>
  );
}

function AboutPanel({ reduceMotion }) {
  return (
    <motion.section
      className="panel about-panel"
      aria-labelledby="about-heading"
      initial={reduceMotion ? false : { opacity: 0, x: 34 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, x: -24 }}
      transition={{ duration: 0.34, ease: [0.2, 0.75, 0.25, 1] }}
    >
      <PanelHeading eyebrow="The animator behind the work" title="About Me" id="about-heading" />

      <div className="about-layout">
        <motion.blockquote
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          “I care more about understanding what you need and turning the version in your
          head into animation that feels alive.”
        </motion.blockquote>
        <div className="about-copy">
          <p>
            I have completed Roblox animation commissions with Moon Animator since 2023.
            I focus on clear action, purposeful timing, and communication throughout the work.
          </p>
          <p>
            I am now learning Blender so I can push my control and polish further. I may still
            be learning how to present the work, but I take the work itself seriously.
          </p>
        </div>
      </div>

      <div className="principles">
        {["Listen carefully", "Communicate clearly", "Polish the motion"].map((item, index) => (
          <motion.div
            key={item}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 + index * 0.08 }}
            whileHover={reduceMotion ? undefined : { y: -7 }}
          >
            <span>0{index + 1}</span>
            <strong>{item}</strong>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function PortfolioNav({ activeTab, theme, onThemeChange }) {
  return (
    <nav className="portfolio-nav" aria-label="Portfolio sections">
      <Tabs.List className="tab-list">
        {navigation.map((item) => (
          <Tabs.Trigger className="tab-trigger" value={item.value} key={item.value}>
            {item.label}
            {activeTab === item.value && (
              <motion.span
                className="tab-active"
                layoutId="active-navigation"
                transition={{ type: "spring", stiffness: 430, damping: 34 }}
              />
            )}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <span className="nav-divider" aria-hidden="true" />
      <motion.button
        className="theme-toggle"
        type="button"
        whileTap={{ rotate: 22, scale: 0.9 }}
        onClick={onThemeChange}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
            transition={{ duration: 0.18 }}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </nav>
  );
}

function App() {
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState("work");
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem("andrew-portfolio-theme") || "dark";
    } catch {
      return "dark";
    }
  });
  const [cursorVisible, setCursorVisible] = useState(false);
  const cursorX = useMotionValue(-300);
  const cursorY = useMotionValue(-300);
  const cursorSpringX = useSpring(cursorX, { stiffness: 180, damping: 26, mass: 0.45 });
  const cursorSpringY = useSpring(cursorY, { stiffness: 180, damping: 26, mass: 0.45 });

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      theme === "dark" ? "#101011" : "#ebe7dd",
    );
    try {
      window.localStorage.setItem("andrew-portfolio-theme", theme);
    } catch {
      // The theme still works if storage is unavailable.
    }
  }, [theme]);

  function handlePointerMove(event) {
    if (reduceMotion || event.pointerType === "touch") return;
    cursorX.set(event.clientX - 115);
    cursorY.set(event.clientY - 115);
    setCursorVisible(true);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="site-canvas"
        data-theme={theme}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setCursorVisible(false)}
      >
        <a className="skip-link" href="#portfolio-content">Skip to portfolio</a>
        <div className="ambient ambient-one" aria-hidden="true" />
        <div className="ambient ambient-two" aria-hidden="true" />
        {!reduceMotion && (
          <motion.div
            className="cursor-aura"
            data-testid="cursor-aura"
            style={{ x: cursorSpringX, y: cursorSpringY }}
            animate={{ opacity: cursorVisible ? 1 : 0 }}
            aria-hidden="true"
          />
        )}

        <div className="portfolio-shell">
          <ProfileSidebar reduceMotion={reduceMotion} />

          <Tabs.Root
            className="content-card"
            value={activeTab}
            onValueChange={setActiveTab}
            id="portfolio-content"
          >
            <PortfolioNav
              activeTab={activeTab}
              theme={theme}
              onThemeChange={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            />

            <div className="content-inner">
              <AnimatePresence mode="wait" initial={false}>
                {activeTab === "work" && (
                  <Tabs.Content className="tab-content" value="work" forceMount key="work">
                    <WorkPanel reduceMotion={reduceMotion} />
                  </Tabs.Content>
                )}
                {activeTab === "process" && (
                  <Tabs.Content className="tab-content" value="process" forceMount key="process">
                    <ProcessPanel reduceMotion={reduceMotion} />
                  </Tabs.Content>
                )}
                {activeTab === "about" && (
                  <Tabs.Content className="tab-content" value="about" forceMount key="about">
                    <AboutPanel reduceMotion={reduceMotion} />
                  </Tabs.Content>
                )}
              </AnimatePresence>
            </div>
          </Tabs.Root>
        </div>

        <p className="site-credit">
          <Sparkles size={13} aria-hidden="true" /> Andrew Le / Roblox Animator
        </p>
      </div>
    </MotionConfig>
  );
}

export default App;
