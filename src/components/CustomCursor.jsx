import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

/**
 * Critically damped springs tuned to feel like the original prototype's
 * per-frame smoothing (ring: 0.11 / frame, dot: 0.22 / frame at 60 fps),
 * but independent of the display's refresh rate.
 */
const RING_SPRING = { stiffness: 196, damping: 28, mass: 1 };
const DOT_SPRING = { stiffness: 900, damping: 60, mass: 1 };
const STIFF = { stiffness: 10000, damping: 200, mass: 1 }; // reduced motion: effectively no lag

/**
 * Two-part crosshair cursor: a lagging ring with a soft glow, and a bright dot
 * that tracks the pointer closely. Shown only for mouse / pen while inside
 * `target`. Never on touch screens.
 *
 * Positions live in Motion values, so pointer movement never re-renders React.
 *
 * @param {{ target: React.RefObject<HTMLElement> }} props
 */
export default function CustomCursor({ target }) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const placed = useRef(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ringX = useSpring(x, reduceMotion ? STIFF : RING_SPRING);
  const ringY = useSpring(y, reduceMotion ? STIFF : RING_SPRING);
  const dotX = useSpring(x, reduceMotion ? STIFF : DOT_SPRING);
  const dotY = useSpring(y, reduceMotion ? STIFF : DOT_SPRING);

  useEffect(() => {
    const el = target.current;
    if (!el) return undefined;

    // First position after entering: teleport instead of flying in from wherever it last was.
    // (Source first, then the springs that follow it, so the jump isn't re-animated.)
    const teleport = (px, py) => {
      x.jump(px);
      y.jump(py);
      [ringX, dotX].forEach((spring) => spring.jump(px));
      [ringY, dotY].forEach((spring) => spring.jump(py));
    };

    const onMove = (e) => {
      if (e.pointerType === 'touch') return;
      if (placed.current) {
        x.set(e.clientX);
        y.set(e.clientY);
      } else {
        teleport(e.clientX, e.clientY);
        placed.current = true;
      }
      setVisible(true);
    };
    const onLeave = () => {
      placed.current = false;
      setVisible(false);
    };

    el.addEventListener('pointerenter', onMove, { passive: true });
    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      el.removeEventListener('pointerenter', onMove);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [target, x, y, ringX, ringY, dotX, dotY]);

  // `pointer-fine:` keeps the custom cursor off touch devices.
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 hidden pointer-fine:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Ring: lags behind the pointer */}
      <motion.div className="fixed top-0 left-0" style={{ x: ringX, y: ringY }}>
        <div className="relative flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <div className="absolute h-20 w-20 rounded-full bg-amber-300/10 blur-2xl" />
          <div className="absolute h-12 w-12 rounded-full border border-amber-300/45" />
          <div className="absolute h-6 w-6 rounded-full border border-amber-300/20" />
        </div>
      </motion.div>

      {/* Dot: sticks close to the pointer */}
      <motion.div className="fixed top-0 left-0" style={{ x: dotX, y: dotY }}>
        <div className="h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_10px_3px_rgba(252,211,77,0.8)]" />
      </motion.div>
    </motion.div>
  );
}
