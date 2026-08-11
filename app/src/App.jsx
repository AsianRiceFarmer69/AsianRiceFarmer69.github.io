import * as Dialog from "@radix-ui/react-dialog";
import { Box, Clapperboard, Play, Sparkles, X } from "lucide-react";
import { useState } from "react";

const PROJECT_VIDEOS = [
  { id: "Xc6p7WxNs8Q", label: "Main showcase" },
  { id: "EIzCjA4LbQU", label: "Combat clip 02" },
  { id: "fGbMmU9d6NM", label: "Combat clip 03" },
  { id: "nGm_EFrSYK8", label: "Combat clip 04" },
];

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="ARF_0503, Roblox Animator, back to top">
        <span>ARF</span>
        <strong>ARF_0503</strong>
        <small>/ Roblox Animator / Since 2023</small>
      </a>
    </header>
  );
}

function Expertise() {
  return (
    <section className="expertise-section" id="expertise">
      <div className="section-heading">
        <p>About</p>
        <h2>Commission workflow</h2>
      </div>
      <div className="workflow-grid">
        <article>
          <Clapperboard aria-hidden="true" size={23} strokeWidth={1.7} />
          <h3>Moon Animator</h3>
          <p>My previous animation workflow.</p>
        </article>
        <article>
          <Box aria-hidden="true" size={23} strokeWidth={1.7} />
          <h3>Blender</h3>
          <p>My current animation workflow.</p>
        </article>
        <article>
          <Sparkles aria-hidden="true" size={23} strokeWidth={1.7} />
          <h3>Animation events</h3>
          <p>I use Moon Animator to add VFX and sound events, then test the animation in game.</p>
        </article>
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
  return (
    <div className="site-canvas" id="top">
      <a className="skip-link" href="#work">Skip to work</a>
      <Header />
      <main>
        <Expertise />
        <Work />
      </main>
    </div>
  );
}

export default App;
