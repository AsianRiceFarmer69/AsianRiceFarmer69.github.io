import { forwardRef } from "react";
import { motion } from "motion/react";

// Adapted from VengeanceUI's AnimatedButton (MIT).
const AnimatedButton = forwardRef(function AnimatedButton(
  { children = "Browse Components", className = "", type = "button", ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      className={`vui-animated-button ${className}`.trim()}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
      {...props}
    >
      <motion.span
        className="vui-animated-button-label"
        style={{
          WebkitMaskImage:
            "linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))",
          maskImage:
            "linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))",
        }}
      >
        {children}
      </motion.span>

      <motion.span
        className="vui-animated-button-border"
        aria-hidden="true"
      />
    </motion.button>
  );
});

export default AnimatedButton;
