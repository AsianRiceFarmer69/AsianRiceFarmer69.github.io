import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const zeroToNine = Array.from({ length: 10 }, (_, value) => value);

function NumberStrip({ height, value }) {
  const pixelHeight = Number.parseInt(height?.replace("px", "") || "10", 10);
  const previous = useRef(value);
  const currentValue = Number.parseInt(value, 10);
  const previousValue = Number.parseInt(previous.current, 10);
  const difference = previousValue - currentValue;
  const direction = currentValue > previousValue
    ? pixelHeight * difference * -1
    : pixelHeight * -1 * difference;

  useEffect(() => {
    previous.current = value;
  }, [value]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="vui-number-strip"
        key={value}
        initial={{ y: direction }}
        animate={{ y: 0 }}
        exit={{ y: 0, transition: { duration: 0.1 } }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.span className="vui-number-column vui-number-column-before" aria-hidden="true" layout>
          {zeroToNine.filter((number) => number < currentValue).map((number) => (
            <span key={number}>{number}</span>
          ))}
        </motion.span>
        <span>{value}</span>
        <motion.span className="vui-number-column vui-number-column-after" aria-hidden="true" layout>
          {zeroToNine.filter((number) => number > currentValue).map((number) => (
            <span key={number}>{number}</span>
          ))}
        </motion.span>
      </motion.div>
    </AnimatePresence>
  );
}

function NumberHolder({ value }) {
  const [height, setHeight] = useState(null);
  const holderRef = useRef(null);

  useEffect(() => {
    if (holderRef.current) setHeight(getComputedStyle(holderRef.current).height);
  }, []);

  return (
    <span
      ref={holderRef}
      className="vui-number-holder"
      style={{ height: height || "auto" }}
    >
      <NumberStrip value={value} height={height} />
    </span>
  );
}

export default function AnimatedNumber({ value, className = "" }) {
  return (
    <span
      className={`vui-animated-number ${className}`.trim()}
      data-value={value}
      aria-label={value.toString()}
    >
      {value.toString().split("").map((digit, index) => (
        <NumberHolder key={index} value={digit} />
      ))}
    </span>
  );
}
