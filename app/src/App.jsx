import * as Dialog from "@radix-ui/react-dialog";
import { Clapperboard, MessageCircle, Play, Sparkles, X } from "lucide-react";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const PROJECT_VIDEOS = [
  { id: "Xc6p7WxNs8Q", label: "Main showcase" },
  { id: "EIzCjA4LbQU", label: "Combat clip 02" },
  { id: "fGbMmU9d6NM", label: "Combat clip 03" },
  { id: "nGm_EFrSYK8", label: "Combat clip 04" },
];

const expertise = [
  {
    icon: Sparkles,
    title: "Combat animation",
    copy: "Readable poses, purposeful timing, and impact that makes each hit easy to follow.",
    tags: ["Combat", "Timing", "Choreography"],
  },
  {
    icon: Clapperboard,
    title: "Cinematic sequences",
    copy: "Camera movement and pacing shaped around the story and feeling of the scene.",
    tags: ["Cinematics", "Camera", "Roblox"],
  },
  {
    icon: MessageCircle,
    title: "Commission workflow",
    copy: "Moon Animator is my foundation, and I am learning Blender for more control and polish.",
    tags: ["Moon Animator", "Blender", "Feedback"],
  },
];

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Andrew Le, back to top">
        <span>AL</span>
        <strong>Andrew Le</strong>
      </a>
      <nav aria-label="Main navigation">
        <a href="#expertise">Skills</a>
        <a href="#work">Work</a>
      </nav>
    </header>
  );
}

function MovingLines({ reduceMotion }) {
  return (
    <motion.svg
      className="ambient-wave"
      data-motion="ambient-wave"
      viewBox="0 0 900 240"
      preserveAspectRatio="none"
      aria-hidden="true"
      animate={reduceMotion ? { x: 0 } : { x: ["-5%", "5%", "-5%"] }}
      transition={reduceMotion ? { duration: 0 } : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      {Array.from({ length: 12 }, (_, index) => (
        <path
          d="M-80 180C90 65 220 225 390 120S665 40 980 150"
          key={index}
          transform={`translate(0 ${index * 5})`}
        />
      ))}
    </motion.svg>
  );
}

function Expertise({ reduceMotion }) {
  return (
    <section className="expertise-section" id="expertise">
      <MovingLines reduceMotion={reduceMotion} />
      <div className="section-heading">
        <p>Expertise</p>
        <h2>What I do</h2>
      </div>

      <div className="expertise-grid">
        {expertise.map(({ icon: Icon, title, copy, tags }) => (
          <article key={title}>
            <Icon size={23} strokeWidth={1.7} />
            <h3>{title}</h3>
            <p>{copy}</p>
            <ul aria-label={`${title} skills`}>
              {tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectGallery() {
  const [activeVideo, setActiveVideo] = useState(PROJECT_VIDEOS[0]);

  return (
    <Dialog.Root>
      <div className="project-grid">
        {PROJECT_VIDEOS.map((video) => (
          <article key={video.id}>
            <Dialog.Trigger asChild>
              <button
                className="project-card"
                data-video-trigger
                data-video-id={video.id}
                type="button"
                aria-label={`Watch ${video.label} with sound`}
                onClick={() => setActiveVideo(video)}
              >
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                  alt={`${video.label} from the Combat Encounter Animation Project`}
                />
                <span className="project-overlay" aria-hidden="true" />
                <span className="project-play"><Play size={18} fill="currentColor" /></span>
                <span className="project-label">{video.label}</span>
              </button>
            </Dialog.Trigger>
          </article>
        ))}
      </div>

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

function Work() {
  return (
    <section className="work-section" id="work">
      <div className="work-heading">
        <div className="section-heading">
          <p>Selected project</p>
          <h2>Combat Encounter</h2>
        </div>
        <p>
          Four clips from one Roblox animation project, focused on readable combat,
          intentional timing, and impact. Click any clip to watch with sound.
        </p>
      </div>
      <ProjectGallery />
    </section>
  );
}

function App() {
  const reduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-canvas" id="top">
        <a className="skip-link" href="#work">Skip to work</a>
        <Header />
        <main>
          <Expertise reduceMotion={reduceMotion} />
          <Work />
        </main>
        <footer>
          <p>Andrew Le / Roblox Animator / Since 2023</p>
        </footer>
      </div>
    </MotionConfig>
  );
}

export default App;
