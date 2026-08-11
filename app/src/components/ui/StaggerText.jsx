import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Adapted from VengeanceUI's Stagger Text component (MIT).
 * https://www.vengenceui.com/components/stagger-text
 */
export default function StaggerText({ children, delay = 0, divideBy = "word" }) {
  const reduceMotion = useReducedMotion();
  const text = String(children);
  const parts = divideBy === "letter" ? text.split("") : text.split(" ");
  const stagger = divideBy === "letter" ? 0.018 : 0.045;

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : stagger,
        delayChildren: reduceMotion ? 0 : delay,
      },
    },
  };

  const item = {
    hidden: reduceMotion ? { opacity: 1 } : { y: "110%" },
    show: {
      y: "0%",
      opacity: 1,
      transition: { duration: reduceMotion ? 0 : 0.6, ease: EASE },
    },
  };

  return (
    <motion.span
      className="vui-stagger-text"
      variants={container}
      initial={reduceMotion ? false : "hidden"}
      animate="show"
      aria-label={text}
    >
      {parts.map((part, index) => (
        <span className="vui-stagger-mask" aria-hidden="true" key={`${part}-${index}`}>
          <motion.span className="vui-stagger-part" variants={item}>
            {divideBy === "letter" ? (part === " " ? "\u00A0" : part) : `${part}\u00A0`}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
