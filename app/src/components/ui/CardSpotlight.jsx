import { motion, useMotionTemplate, useMotionValue } from "motion/react";

// Lightweight adaptation of Aceternity UI's Card Spotlight interaction.
export default function CardSpotlight({ children, className = "", radius = 260 }) {
  const mouseX = useMotionValue(-radius);
  const mouseY = useMotionValue(-radius);
  const spotlight = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, rgba(230, 0, 45, 0.14), transparent 72%)`;

  function handlePointerMove(event) {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - bounds.left);
    mouseY.set(event.clientY - bounds.top);
  }

  return (
    <div
      className={`card-spotlight ${className}`.trim()}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        mouseX.set(-radius);
        mouseY.set(-radius);
      }}
    >
      <motion.span
        className="card-spotlight-layer"
        data-testid="card-spotlight-layer"
        style={{ background: spotlight }}
        aria-hidden="true"
      />
      <div className="card-spotlight-content">{children}</div>
    </div>
  );
}
