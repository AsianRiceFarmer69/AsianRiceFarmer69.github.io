import { forwardRef } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Adapted from VengeanceUI's Animated Button component (MIT).
 * https://www.vengenceui.com/components/my-animated-button
 */
const AnimatedButton = forwardRef(function AnimatedButton(
  { children, className = "", ...props },
  ref,
) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      ref={ref}
      className={`vui-animated-button ${className}`.trim()}
      whileHover={reduceMotion ? undefined : { scale: 1.01 }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
      {...props}
    >
      <motion.span
        className="vui-button-label"
        style={{
          WebkitMaskImage:
            "linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))",
          maskImage:
            "linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))",
        }}
        initial={{ "--mask-x": reduceMotion ? "-100%" : "100%" }}
        animate={{ "--mask-x": "-100%" }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { repeat: Infinity, duration: 1, ease: "linear", repeatDelay: 1.4 }
        }
      >
        {children}
      </motion.span>
      {!reduceMotion && (
        <motion.span
          className="vui-button-border-shine"
          aria-hidden="true"
          initial={{ backgroundPosition: "100% 0", opacity: 0 }}
          animate={{ backgroundPosition: ["100% 0", "0% 0"], opacity: [0, 1, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 1.4,
          }}
        />
      )}
    </motion.button>
  );
});

export default AnimatedButton;
