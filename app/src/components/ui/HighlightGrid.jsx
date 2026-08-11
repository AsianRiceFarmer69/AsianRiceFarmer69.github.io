import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Adapted from VengeanceUI's Highlight Grid component (MIT).
 * https://www.vengenceui.com/components/highlight-grid
 */
export default function HighlightGrid({ items, transitionDuration = 260 }) {
  const gridRef = useRef(null);
  const highlightRef = useRef(null);
  const cellRefs = useRef(new Map());
  const activeRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const resolvedItems = useMemo(
    () => items.map((item, index) => ({ ...item, index })),
    [items],
  );

  const moveTo = useCallback((index, color) => {
    const grid = gridRef.current;
    const highlight = highlightRef.current;
    const cell = cellRefs.current.get(index);
    if (!grid || !highlight || !cell) return;

    const cellRect = cell.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    highlight.style.transform = `translate(${cellRect.left - gridRect.left}px, ${
      cellRect.top - gridRect.top
    }px)`;
    highlight.style.width = `${cellRect.width}px`;
    highlight.style.height = `${cellRect.height}px`;
    highlight.style.backgroundColor = color;
    activeRef.current = { index, color };
  }, []);

  const activate = useCallback(
    (item) => {
      setActiveIndex(item.index);
      moveTo(item.index, item.color);
    },
    [moveTo],
  );

  useEffect(() => {
    const first = resolvedItems[0];
    const highlight = highlightRef.current;
    if (first && highlight) {
      highlight.style.transitionDuration = "0s";
      moveTo(first.index, first.color);
      requestAnimationFrame(() => {
        if (highlight) highlight.style.transitionDuration = `${transitionDuration}ms`;
      });
    }

    const onResize = () => {
      if (activeRef.current) {
        moveTo(activeRef.current.index, activeRef.current.color);
      }
    };
    const observer = gridRef.current ? new ResizeObserver(onResize) : null;
    if (gridRef.current && observer) observer.observe(gridRef.current);
    window.addEventListener("resize", onResize);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [moveTo, resolvedItems, transitionDuration]);

  const activeItem = resolvedItems[activeIndex] ?? resolvedItems[0];

  return (
    <div className="vui-highlight-shell">
      <div className="vui-highlight-grid" ref={gridRef}>
        <div
          className="vui-highlight"
          ref={highlightRef}
          aria-hidden="true"
          style={{
            transitionDuration: `${transitionDuration}ms`,
          }}
        />
        {resolvedItems.map((item) => (
          <button
            className="vui-highlight-cell"
            key={item.label}
            ref={(element) => {
              if (element) cellRefs.current.set(item.index, element);
              else cellRefs.current.delete(item.index);
            }}
            type="button"
            onMouseEnter={() => activate(item)}
            onFocus={() => activate(item)}
            onClick={() => activate(item)}
            aria-pressed={activeIndex === item.index}
          >
            <span>( {item.label} )</span>
          </button>
        ))}
      </div>
      <div className="vui-highlight-detail" aria-live="polite">
        <span>0{activeIndex + 1}</span>
        <p>{activeItem.copy}</p>
      </div>
    </div>
  );
}
