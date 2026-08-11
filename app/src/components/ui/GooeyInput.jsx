import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

const spring = {
  duration: 0.4,
  type: "spring",
  bounce: 0.25,
};

function SearchIcon({ layoutId }) {
  return (
    <motion.svg
      layoutId={layoutId}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </motion.svg>
  );
}

// Adapted from Aceternity UI's Gooey Input component.
export default function GooeyInput({
  label = "Start a brief",
  placeholder = "Describe your scene...",
  collapsedWidth = 152,
  expandedWidth = 380,
  expandedOffset = 48,
  gooeyBlur = 5,
  onSubmit,
}) {
  const reactId = useId();
  const filterId = `gooey-filter-${reactId.replace(/:/g, "")}`;
  const iconLayoutId = `gooey-icon-${reactId.replace(/:/g, "")}`;
  const inputRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [value, setValue] = useState("");
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (isExpanded) inputRef.current?.focus();
  }, [isExpanded]);

  const safeExpandedWidth = useMemo(
    () => Math.min(expandedWidth, Math.max(220, viewportWidth - expandedOffset - 44)),
    [expandedOffset, expandedWidth, viewportWidth],
  );

  const collapseIfEmpty = useCallback(() => {
    if (!value.trim()) setIsExpanded(false);
  }, [value]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!value.trim()) return;
    onSubmit?.(value.trim());
  }

  return (
    <div className="gooey-input" data-open={isExpanded ? "true" : "false"}>
      <svg className="gooey-filter-svg" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={gooeyBlur} result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="gooey-filter-wrap" style={{ filter: `url(#${filterId})` }}>
        <motion.div
          className="gooey-row"
          animate={{
            width: isExpanded ? safeExpandedWidth : collapsedWidth,
            marginLeft: isExpanded ? expandedOffset : 0,
          }}
          transition={spring}
        >
          {isExpanded ? (
            <form className="gooey-surface gooey-form" onSubmit={handleSubmit}>
              <motion.input
                ref={inputRef}
                type="text"
                enterKeyHint="send"
                autoComplete="off"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onBlur={collapseIfEmpty}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setValue("");
                    setIsExpanded(false);
                  }
                }}
                placeholder={placeholder}
                aria-label="Commission idea test"
              />
              <button type="submit" aria-label="Test brief submission">
                Send
              </button>
            </form>
          ) : (
            <motion.button
              type="button"
              className="gooey-surface gooey-trigger"
              onClick={() => setIsExpanded(true)}
            >
              <SearchIcon layoutId={iconLayoutId} />
              <span>{label}</span>
            </motion.button>
          )}
        </motion.div>

        <motion.button
          type="button"
          className="gooey-bubble"
          aria-label="Focus commission idea input"
          tabIndex={isExpanded ? 0 : -1}
          initial={false}
          animate={{ scale: isExpanded ? 1 : 0, opacity: isExpanded ? 1 : 0 }}
          transition={spring}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => inputRef.current?.focus()}
        >
          <SearchIcon layoutId={iconLayoutId} />
        </motion.button>
      </div>
    </div>
  );
}
