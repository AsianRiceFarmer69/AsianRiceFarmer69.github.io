import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowRight,
  Check,
  ExternalLink,
  Film,
  MessageCircle,
  Play,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import CardSpotlight from "./components/ui/CardSpotlight";
import GooeyInput from "./components/ui/GooeyInput";

const VIDEO_ID = "Xc6p7WxNs8Q";

const capabilities = [
  {
    icon: Zap,
    title: "Combat that reads",
    copy: "Clear poses, deliberate timing, and impact players can understand at a glance.",
  },
  {
    icon: Film,
    title: "Cinematics with purpose",
    copy: "Camera-led sequences shaped around the feeling and story of the moment.",
  },
  {
    icon: MessageCircle,
    title: "Built around your brief",
    copy: "References, feedback, and communication stay part of the animation process.",
  },
];

const steps = [
  ["01", "Listen", "We define the action, mood, references, and constraints."],
  ["02", "Animate", "I block readable poses and shape the timing in Moon Animator."],
  ["03", "Polish", "Feedback becomes tighter motion, stronger impact, and a cleaner result."],
];

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Andrew Le, back to top">
        <span className="brand-mark">AL</span>
        <span className="brand-name">andrew le</span>
      </a>

      <nav className="site-nav" aria-label="Main navigation">
        <a href="#work">Work</a>
        <a href="#process">Process</a>
        <a href="#about">About</a>
      </nav>

      <a className="availability" href="#brief">
        <span aria-hidden="true" /> Start a brief
      </a>
    </header>
  );
}

function VideoDialog({ reduceMotion }) {
  const previewUrl = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&rel=0&playsinline=1`;

  return (
    <Dialog.Root>
      <motion.article
        className="hero-showcase"
        data-interactive="project-card"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, delay: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="showcase-toolbar">
          <span>Featured project</span>
          <span>Roblox Studio · 2026</span>
        </div>

        <div className="showcase-media">
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
          <span className="video-shade" aria-hidden="true" />
          <Dialog.Trigger asChild>
            <button
              className="watch-button"
              data-video-trigger
              type="button"
              aria-label="Watch showcase with sound"
            >
              <span><Play size={17} fill="currentColor" /></span>
              Watch film
            </button>
          </Dialog.Trigger>
        </div>

        <div className="showcase-caption">
          <div>
            <p>Combat encounter</p>
            <h2>Readable action. Purposeful impact.</h2>
          </div>
          <a
            href={`https://youtu.be/${VIDEO_ID}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Open project on YouTube"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </motion.article>

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

function Hero({ reduceMotion }) {
  return (
    <section className="hero" id="work">
      <svg className="hero-ribbons" viewBox="0 0 1440 760" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-80 560C260 350 430 690 760 480S1210 210 1540 400" />
        <path d="M-120 620C240 430 430 750 790 540S1230 300 1550 470" />
        <path d="M-100 490C220 270 460 610 760 390S1180 120 1530 310" />
      </svg>

      <div className="hero-inner" id="top">
        <motion.div
          className="hero-copy"
          initial={reduceMotion ? false : { opacity: 0, x: -22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.62, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <p className="eyebrow"><span /> Andrew Le · Roblox Animator</p>
          <h1>
            Roblox animation.
            <span>Made to hit.</span>
          </h1>
          <p className="hero-lead">
            Combat and cinematic sequences built for readable action, deliberate timing,
            and memorable impact.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#featured">
              View the work <ArrowRight size={17} />
            </a>
            <a className="text-link" href="#process">See the process</a>
          </div>
          <dl className="hero-facts">
            <div><dt>Since</dt><dd>2023</dd></div>
            <div><dt>Foundation</dt><dd>Moon Animator</dd></div>
            <div><dt>Expanding into</dt><dd>Blender</dd></div>
          </dl>
        </motion.div>

        <VideoDialog reduceMotion={reduceMotion} />
      </div>
    </section>
  );
}

function Capabilities({ reduceMotion }) {
  return (
    <section className="capabilities" id="featured">
      <div className="section-heading">
        <p>Animation, engineered for the moment</p>
        <h2>Every frame has a job.</h2>
      </div>

      <div className="capability-grid">
        {capabilities.map(({ icon: Icon, title, copy }, index) => (
          <motion.div
            className="capability-entry"
            key={title}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
          >
            <CardSpotlight className="capability-card">
              <span className="capability-icon"><Icon size={23} /></span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <span className="card-line" aria-hidden="true" />
            </CardSpotlight>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Process({ reduceMotion }) {
  return (
    <section className="process-section" id="process">
      <div className="process-grid" aria-hidden="true" />
      <div className="process-horizon" aria-hidden="true" />
      <div className="process-intro">
        <div>
          <p><span>3 steps</span> Simple process. Clear communication.</p>
          <h2>From your idea to motion that feels alive.</h2>
        </div>
        <p className="process-aside">
          No confusing handoff. Your brief, your references, and your feedback stay visible
          through the entire animation.
        </p>
      </div>

      <div className="process-steps">
        {steps.map(([number, title, copy], index) => (
          <motion.article
            key={number}
            initial={reduceMotion ? false : { opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ delay: index * 0.1, duration: 0.42 }}
          >
            <span>{number}</span>
            <div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about-section" id="about">
      <div>
        <p className="section-kicker">Behind the animation</p>
        <h2>I take the work seriously.</h2>
      </div>
      <div className="about-copy">
        <p>
          I have completed Roblox animation commissions with Moon Animator since 2023.
          I listen carefully, communicate clearly, and work hard to turn your references
          and ideas into animation that feels alive.
        </p>
        <p>
          I am now learning Blender to gain more control and bring more polish into future work.
        </p>
        <ul>
          <li><Check size={17} /> Combat choreography</li>
          <li><Check size={17} /> Cinematic sequences</li>
          <li><Check size={17} /> Feedback-led commissions</li>
        </ul>
      </div>
    </section>
  );
}

function BriefTest() {
  const [status, setStatus] = useState("");

  return (
    <section className="brief-section" id="brief">
      <span className="test-label"><Sparkles size={14} /> Interaction test</span>
      <h2>What are you building?</h2>
      <p>Try the Aceternity-style Gooey Input. This demo does not send or save anything.</p>
      <GooeyInput
        onSubmit={(idea) => setStatus(`Test received: “${idea}” — nothing was sent.`)}
      />
      <p className="brief-status" role="status" aria-live="polite">
        {status || "Click “Start a brief,” type an idea, and press Send."}
      </p>
    </section>
  );
}

function App() {
  const reduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-canvas">
        <a className="skip-link" href="#work">Skip to portfolio</a>
        <Header />
        <main>
          <Hero reduceMotion={reduceMotion} />
          <Capabilities reduceMotion={reduceMotion} />
          <Process reduceMotion={reduceMotion} />
          <About />
          <BriefTest />
        </main>
        <footer>
          <a className="brand footer-brand" href="#top">
            <span className="brand-mark">AL</span>
            <span className="brand-name">andrew le</span>
          </a>
          <p>Roblox animator · I’ve started since 2023</p>
          <a
            href="https://github.com/AsianRiceFarmer69/AsianRiceFarmer69.github.io"
            target="_blank"
            rel="noreferrer"
          >
            View source <ExternalLink size={14} />
          </a>
        </footer>
      </div>
    </MotionConfig>
  );
}

export default App;
