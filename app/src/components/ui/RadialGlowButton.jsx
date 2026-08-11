import { forwardRef } from "react";

// Adapted from VengeanceUI's RadialGlowButton (MIT).
const RadialGlowButton = forwardRef(function RadialGlowButton(
  { children = "Get Extension", className = "", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`vui-rg-button ${className}`.trim()}
      type={type}
      {...props}
    >
      <span className="vui-rg-shine" aria-hidden="true">
        <span />
      </span>
      <span className="vui-rg-bg" aria-hidden="true" />
      <span className="vui-rg-label">{children}</span>
    </button>
  );
});

export default RadialGlowButton;
