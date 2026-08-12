import * as Dialog from "@radix-ui/react-dialog";
import { Box, Clapperboard, Play, Sparkles, X } from "lucide-react";
import { useState } from "react";

const PROJECTS = [
  {
    id: "combat-encounter",
    title: "Combat Encounter",
    description: "Four clips from one Roblox animation project. Click any clip to watch.",
    videos: [
      { id: "Xc6p7WxNs8Q", label: "Main showcase" },
      { id: "EIzCjA4LbQU", label: "Combat clip 02" },
      { id: "fGbMmU9d6NM", label: "Combat clip 03" },
      { id: "nGm_EFrSYK8", label: "Combat clip 04" },
    ],
  },
  {
    id: "fps-project",
    title: "FPS Project",
    description: "Four animation clips and two development screenshots from my FPS project.",
    videos: [
      { id: "TB0oHccSFOY", label: "FPS clip 01" },
      { id: "nc6DqCFRbn4", label: "FPS clip 02" },
      { id: "iKawZ5HKZ7E", label: "FPS clip 03" },
      { id: "3dsFml4PJFc", label: "FPS clip 04" },
    ],
    stills: [
      { src: "/projects/fps/blender-pistol-animation.png", alt: "FPS character and pistol animation setup in Blender" },
      { src: "/projects/fps/roblox-testing.png", alt: "FPS pistol animation being tested in Roblox Studio" },
    ],
  },
  {
    id: "custom-rigging",
    title: "Custom Rigging",
    description: "An older custom-rig animation made with my previous Moon Animator workflow.",
    videos: [
      { id: "qsltCgljJDw", label: "Moon Animator workflow" },
    ],
    stills: [
      { src: "/projects/custom-rigging/posed-character.png", alt: "Custom character rig posed in Roblox Studio" },
      { src: "/projects/custom-rigging/rig-bones.png", alt: "Custom character rig bones visible in Roblox Studio" },
      { src: "/projects/custom-rigging/second-character.png", alt: "Second custom character rig posed in Roblox Studio" },
    ],
  },
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

function ProjectGallery({ project }) {
  const [activeVideo, setActiveVideo] = useState(project.videos[0]);

  return (
    <Dialog.Root>
      <div className="project-grid">
        {project.videos.map((video) => (
          <article key={video.id}>
            <Dialog.Trigger asChild>
              <button
                className="project-card"
                data-video-trigger
                data-video-id={video.id}
                type="button"
                aria-label={`Watch ${video.label}`}
                onClick={() => setActiveVideo(video)}
              >
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                  alt={`${video.label} from ${project.title}`}
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
              <Dialog.Title>{project.title}</Dialog.Title>
              <Dialog.Description>{activeVideo.label} / Roblox animation showcase</Dialog.Description>
            </div>
            <Dialog.Close className="dialog-close" aria-label="Close video">
              <X size={20} />
            </Dialog.Close>
          </div>
          <div className="dialog-video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
              title={`${project.title}: ${activeVideo.label}`}
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

function ProjectSection({ project, index }) {
  return (
    <section className="work-section" id={index === 0 ? "work" : project.id}>
      <div className="work-heading">
        <div className="section-heading">
          <p>Project {String(index + 1).padStart(2, "0")}</p>
          <h2>{project.title}</h2>
        </div>
        <p>{project.description}</p>
      </div>
      <ProjectGallery project={project} />
      {project.stills && (
        <div className="project-stills" aria-label={`${project.title} development screenshots`}>
          {project.stills.map((still) => <img key={still.src} src={still.src} alt={still.alt} />)}
        </div>
      )}
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
        {PROJECTS.map((project, index) => (
          <ProjectSection project={project} index={index} key={project.id} />
        ))}
      </main>
    </div>
  );
}

export default App;
