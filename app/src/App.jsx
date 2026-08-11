import * as Dialog from "@radix-ui/react-dialog";
import { ArrowDown, ExternalLink, Play, X } from "lucide-react";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const PROJECT_VIDEOS = [
  { id: "Xc6p7WxNs8Q", label: "Main showcase" },
  { id: "EIzCjA4LbQU", label: "Combat clip 02" },
  { id: "fGbMmU9d6NM", label: "Combat clip 03" },
  { id: "nGm_EFrSYK8", label: "Combat clip 04" },
];

const focusAreas = [
  {
    number: "01",
    title: "Combat animation",
    copy: "I focus on readable poses, purposeful timing, and impact that makes every hit easy to follow.",
  },
  {
    number: "02",
    title: "Cinematic sequences",
    copy: "I use camera movement, pacing, and character performance to give each scene a clear mood and direction.",
  },
  {
    number: "03",
    title: "Commission work",
    copy: "I listen to the brief, work from references, and use feedback to shape the animation around the project.",
  },
];

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Andrew Le, back to top">
        <span className="brand-mark">AL</span>
        <span className="brand-name">Andrew Le</span>
      </a>

      <nav className="site-nav" aria-label="Main navigation">
        <a href="#work">Work</a>
        <a href="#focus">Focus</a>
        <a href="#about">About</a>
      </nav>

      <p className="header-role">Roblox Animator</p>
    </header>
  );
}

function Intro({ reduceMotion }) {
  return (
    <section className="intro" id="top">
      <motion.div
        className="intro-inner"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <p className="eyebrow"><span /> Roblox animator / Andrew Le</p>
        <h1>
          Hello, I'm Andrew.
          <span>I animate for Roblox.</span>
        </h1>

        <div className="intro-copy">
          <p>
            I focus on <strong>combat and cinematic sequences</strong> that feel clear,
            intentional, and alive.
          </p>
          <p>
            <strong>I've started since 2023</strong>, with Moon Animator as the foundation
            of my commission work.
          </p>
          <p>
            I'm now learning <strong>Blender</strong> for more control and polish. Below is
            a showcase of my work and the kind of animation I care about.
          </p>
        </div>

        <a className="intro-scroll" href="#work">
          View my work <ArrowDown size={16} />
        </a>
      </motion.div>
    </section>
  );
}

function VideoShowcase({ reduceMotion }) {
  const [activeVideo, setActiveVideo] = useState(PROJECT_VIDEOS[0]);

  return (
    <Dialog.Root>
      <motion.div
        className="project-gallery"
        initial={reduceMotion ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {PROJECT_VIDEOS.map((video, index) => {
          const previewUrl = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&mute=1&loop=1&playlist=${video.id}&controls=0&rel=0&playsinline=1`;

          return (
            <article
              className={`project-media ${index === 0 ? "project-media-primary" : "project-media-secondary"}`}
              key={video.id}
            >
              <div className="project-toolbar">
                <span><i aria-hidden="true" /> Moving preview</span>
                <span>{video.label}</span>
              </div>

              <div className="project-video">
                <img
                  className="video-fallback"
                  src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                  alt={`${video.label} from the Combat Encounter Animation Project`}
                />
                {!reduceMotion && (
                  <iframe
                    className="video-preview"
                    src={previewUrl}
                    title={`Muted moving preview: ${video.label}`}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    loading={index === 0 ? "eager" : "lazy"}
                    tabIndex="-1"
                  />
                )}
                <span className="video-shade" aria-hidden="true" />

                <Dialog.Trigger asChild>
                  <button
                    className="watch-button"
                    data-video-trigger
                    data-video-id={video.id}
                    type="button"
                    aria-label={`Watch ${video.label} with sound`}
                    onClick={() => setActiveVideo(video)}
                  >
                    <span><Play size={18} fill="currentColor" /></span>
                    Watch with sound
                  </button>
                </Dialog.Trigger>
              </div>

              {index === 0 && (
                <div className="project-timeline" aria-hidden="true">
                  <motion.span
                    data-motion="playhead"
                    animate={reduceMotion ? { left: 0 } : { left: ["0%", "calc(100% - 72px)"] }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 5.5, ease: "linear", repeat: Infinity }}
                  />
                </div>
              )}
            </article>
          );
        })}
      </motion.div>

      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content
          className="dialog-content"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            document.querySelector(`[data-video-id="${activeVideo.id}"]`)?.focus();
          }}
        >
          <div className="dialog-heading">
            <div>
              <Dialog.Title>Combat Encounter Animation Project</Dialog.Title>
              <Dialog.Description>{activeVideo.label} / Roblox animation showcase</Dialog.Description>
            </div>
            <Dialog.Close className="dialog-close" aria-label="Close video">
              <X size={20} />
            </Dialog.Close>
          </div>
          <div className="dialog-video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
              title={`Combat Encounter Animation Project: ${activeVideo.label}`}
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

function Work({ reduceMotion }) {
  return (
    <section className="work-section" id="work">
      <div className="section-label">
        <span>01</span>
        <p>Selected work</p>
      </div>

      <div className="project-layout">
        <VideoShowcase reduceMotion={reduceMotion} />

        <motion.div
          className="project-copy"
          initial={reduceMotion ? false : { opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <p className="project-kind">Roblox animation / Combat</p>
          <h2>Combat Encounter Animation Project</h2>
          <p>
            A combat-focused Roblox Studio showcase built around readable action,
            purposeful timing, and impact. The goal is simple: every movement should
            communicate intent before the next hit lands.
          </p>

          <dl className="project-details">
            <div><dt>Focus</dt><dd>Combat animation</dd></div>
            <div><dt>Foundation</dt><dd>Moon Animator</dd></div>
            <div><dt>Format</dt><dd>Roblox showcase</dd></div>
          </dl>

          <a href={`https://youtu.be/${PROJECT_VIDEOS[0].id}`} target="_blank" rel="noreferrer">
            Open main showcase on YouTube <ExternalLink size={15} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function Focus({ reduceMotion }) {
  return (
    <section className="focus-section" id="focus">
      <div className="section-label">
        <span>02</span>
        <p>What I focus on</p>
      </div>

      <div className="focus-heading">
        <h2>Motion should tell you what matters.</h2>
        <p>
          The work comes first, followed by a clear explanation of what I bring to a project.
        </p>
      </div>

      <div className="focus-list">
        {focusAreas.map((area, index) => (
          <motion.article
            key={area.number}
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
          >
            <span>{area.number}</span>
            <h3>{area.title}</h3>
            <p>{area.copy}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function About({ reduceMotion }) {
  return (
    <section className="about-section" id="about">
      <motion.div
        className="about-inner"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className="section-label section-label-dark">
          <span>03</span>
          <p>Where I'm going</p>
        </div>

        <h2>
          Moon Animator is my foundation.
          <span>Blender is where I'm heading.</span>
        </h2>

        <div className="about-grid">
          <p>
            I'm still learning how to present my work, but I take the work itself seriously.
            I listen carefully, communicate, and work hard to turn a project's needs and ideas
            into animation that feels alive.
          </p>
          <p>
            Learning Blender is the next step in gaining more control over motion and bringing
            more polish into future projects.
          </p>
        </div>
      </motion.div>
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
          <Intro reduceMotion={reduceMotion} />
          <Work reduceMotion={reduceMotion} />
          <Focus reduceMotion={reduceMotion} />
          <About reduceMotion={reduceMotion} />
        </main>
        <footer>
          <a className="brand footer-brand" href="#top">
            <span className="brand-mark">AL</span>
            <span className="brand-name">Andrew Le</span>
          </a>
          <p>Roblox animator / I've started since 2023</p>
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
