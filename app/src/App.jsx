import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import {
  ArrowRight,
  Code2,
  ExternalLink,
  Play,
  X,
} from "lucide-react";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import AnimatedButton from "./components/ui/AnimatedButton";
import HighlightGrid from "./components/ui/HighlightGrid";
import StaggerText from "./components/ui/StaggerText";

const overviewTabs = [
  { value: "services", label: "What I do" },
  { value: "workflow", label: "Workflow" },
  { value: "about", label: "About" },
];

const services = [
  {
    number: "01",
    label: "Combat",
    color: "#e94439",
    copy: "Attacks, reactions, and choreography that stay clear and readable.",
  },
  {
    number: "02",
    label: "Cinematics",
    color: "#ef6b47",
    copy: "Camera-led moments shaped around story, tension, and impact.",
  },
  {
    number: "03",
    label: "Commissions",
    color: "#c7322a",
    copy: "Animation built around your brief, references, and feedback.",
  },
];

function VideoDialog() {
  return (
    <Dialog.Root>
      <div className="project-poster">
        <img
          src="https://i.ytimg.com/vi/Xc6p7WxNs8Q/maxresdefault.jpg"
          alt="Combat Encounter Animation Project in Roblox Studio"
        />
        <span className="poster-overlay" />
        <span className="poster-label">Featured work</span>
        <Dialog.Trigger asChild>
          <AnimatedButton
            className="showcase-button"
            type="button"
            aria-label="Play Combat Encounter Animation Project"
          >
            <span className="play-icon" aria-hidden="true">
              <Play size={18} fill="currentColor" />
            </span>
            <span>Play showcase</span>
          </AnimatedButton>
        </Dialog.Trigger>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div className="dialog-header">
            <div>
              <Dialog.Title>Combat Encounter Animation Project</Dialog.Title>
              <Dialog.Description>Roblox Studio combat animation showcase</Dialog.Description>
            </div>
            <Dialog.Close className="dialog-close" aria-label="Close video">
              <X size={20} />
            </Dialog.Close>
          </div>
          <div className="dialog-video">
            <iframe
              src="https://www.youtube-nocookie.com/embed/Xc6p7WxNs8Q?autoplay=1&rel=0"
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

function ServicesPanel() {
  return <HighlightGrid items={services} />;
}

function WorkflowPanel() {
  return (
    <div className="workflow-grid">
      <article className="workflow-step">
        <p>Foundation · Since 2023</p>
        <h3>Moon Animator</h3>
        <span>My main workflow for Roblox commission animation.</span>
      </article>
      <ArrowRight className="workflow-arrow" size={24} aria-hidden="true" />
      <article className="workflow-step workflow-current">
        <p>Learning now</p>
        <h3>Blender</h3>
        <span>My next step toward more control and polish.</span>
      </article>
    </div>
  );
}

function AboutPanel() {
  return (
    <div className="about-panel">
      <p className="about-statement">
        I am not the best at building portfolios. I care more about understanding
        what you need and turning the version in your head into animation that feels alive.
      </p>
      <p className="about-note">
        I bring patience, communication, and consistent effort to every commission.
      </p>
    </div>
  );
}

function Overview() {
  const [activeTab, setActiveTab] = useState("services");
  const reduceMotion = useReducedMotion();

  return (
    <Tabs.Root
      className="overview"
      value={activeTab}
      onValueChange={setActiveTab}
      aria-label="Portfolio overview"
    >
      <div className="overview-heading">
        <p>Quick overview</p>
        <Tabs.List className="tab-list" aria-label="Portfolio details">
          {overviewTabs.map((tab) => (
            <Tabs.Trigger className="tab-trigger" value={tab.value} key={tab.value}>
              {tab.label}
              {activeTab === tab.value && (
                <motion.span
                  className="tab-indicator"
                  layoutId="active-overview-tab"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </div>

      <Tabs.Content className="tab-content" value="services">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          <ServicesPanel />
        </motion.div>
      </Tabs.Content>
      <Tabs.Content className="tab-content" value="workflow">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          <WorkflowPanel />
        </motion.div>
      </Tabs.Content>
      <Tabs.Content className="tab-content" value="about">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          <AboutPanel />
        </motion.div>
      </Tabs.Content>
    </Tabs.Root>
  );
}

function App() {
  const reduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell" id="top">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>

        <header className="site-header">
          <a className="brand" href="#top" aria-label="Andrew Le portfolio home">
            <strong>Andrew Le</strong>
            <span>Roblox Animator</span>
          </a>
          <p className="header-meta">
            <span aria-hidden="true" />
            Animating since 2023
          </p>
        </header>

        <motion.main
          id="main-content"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45 }}
        >
          <section className="intro-project" aria-labelledby="hero-title">
            <motion.div
              className="intro-copy"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.2, 0.75, 0.25, 1] }}
            >
              <p className="eyebrow">Roblox animation commissions</p>
              <h1 id="hero-title">
                <StaggerText delay={0.03}>Combat and cinematics,</StaggerText>
                <span className="accent-line">
                  <StaggerText delay={0.16}>made for Roblox.</StaggerText>
                </span>
              </h1>
              <p className="intro-lead">
                I animate readable fight sequences and cinematic moments for Roblox projects.
              </p>
              <p className="experience-note">
                Moon Animator has been my commission foundation since 2023. I am now
                learning Blender for more control and polish.
              </p>
            </motion.div>

            <motion.article
              className="project-card"
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.2, 0.75, 0.25, 1] }}
              aria-labelledby="project-title"
            >
              <VideoDialog />
              <div className="project-caption">
                <div>
                  <p>Roblox Studio · Combat animation</p>
                  <h2 id="project-title">Combat Encounter Animation Project</h2>
                </div>
                <a
                  className="youtube-link"
                  href="https://youtu.be/Xc6p7WxNs8Q"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Watch Combat Encounter Animation Project on YouTube"
                >
                  <ExternalLink size={18} />
                </a>
                <p className="project-description">
                  A showcase built around readable action, purposeful timing, and impact.
                </p>
              </div>
            </motion.article>
          </section>

          <Overview />
        </motion.main>

        <footer className="site-footer">
          <p>© {new Date().getFullYear()} Andrew Le</p>
          <a
            href="https://github.com/AsianRiceFarmer69/AsianRiceFarmer69.github.io"
            target="_blank"
            rel="noreferrer"
          >
            <Code2 size={16} /> View source
          </a>
        </footer>
      </div>
    </MotionConfig>
  );
}

export default App;
