import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1];

/**
 * Shared section header: HUD index + growing amber line, eyebrow, oversized
 * display title and an optional outlined ghost word parked behind it.
 */
export function SectionHead({ index, eyebrow, title, blurb, ghost, id, align = 'left', className = '' }) {
  const reduce = useReducedMotion();
  const rise = reduce ? 0 : 28;
  const right = align === 'right';

  const item = {
    hidden: { opacity: 0, y: rise },
    show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
  };
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
  };
  const line = {
    hidden: { scaleX: 0 },
    show: { scaleX: 1, transition: { duration: 0.9, delay: 0.3, ease: EASE } },
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className={`relative ${right ? 'flex flex-col items-end text-right' : 'text-left'} ${className}`}
    >
      {ghost && (
        <motion.span
          aria-hidden="true"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          className={`pointer-events-none absolute -top-10 z-0 font-display font-bold uppercase leading-[0.85] tracking-tight text-transparent select-none text-[30vw] sm:text-[22vw] lg:text-[15rem] [-webkit-text-stroke:1.5px_rgb(255,255,255,0.045)] ${
            right ? 'right-0' : '-left-2'
          }`}
        >
          {ghost}
        </motion.span>
      )}

      <motion.div variants={item} aria-hidden="true" className={`relative mb-10 flex items-center gap-3 ${right ? 'flex-row-reverse' : ''}`}>
        <span className="font-mono text-xs text-amber-400/80">{index}</span>
        <motion.span variants={line} className={`block h-px w-12 bg-amber-400/60 ${right ? 'origin-right' : 'origin-left'}`} />
        <span className="font-mono text-[9px] tracking-[0.35em] text-neutral-700 uppercase">SYS.{index} // ONLINE</span>
      </motion.div>

      <motion.p variants={item} className="relative font-mono text-[11px] tracking-[0.4em] text-amber-400/90 uppercase">
        {eyebrow}
      </motion.p>

      <motion.h2
        id={id}
        variants={item}
        className="relative mt-6 font-display text-4xl font-semibold tracking-tight text-neutral-100 sm:text-5xl md:text-6xl"
      >
        {title}
      </motion.h2>

      {blurb && (
        <motion.p variants={item} className="relative mt-6 max-w-xl text-base leading-relaxed text-neutral-400">
          {blurb}
        </motion.p>
      )}
    </motion.div>
  );
}

/** Cursor-tracking amber glow that washes over whatever it wraps. */
export function Spotlight({ children, className = '' }) {
  const ref = useRef(null);
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const glow = useMotionTemplate`radial-gradient(280px circle at ${x}px ${y}px, rgba(252,211,77,0.10), transparent 70%)`;

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      }}
      onPointerLeave={() => {
        x.set(-400);
        y.set(-400);
      }}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" style={{ background: glow }} />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

/** Seamless marquee strip. Items get diamond separators and loop forever. */
export function Ticker({ items, className = '' }) {
  const row = [...items, ...items, ...items, ...items];
  return (
    <div aria-hidden="true" className={`pointer-events-none relative overflow-hidden select-none ${className}`}>
      <div className="flex w-max animate-[ticker_32s_linear_infinite] motion-reduce:animate-none">
        {row.map((text, i) => (
          <span key={i} className="flex items-center gap-8 pr-8 font-mono text-[10px] tracking-[0.45em] whitespace-nowrap text-neutral-600 uppercase">
            {text}
            <svg viewBox="0 0 8 8" className="h-1.5 w-1.5 shrink-0 text-amber-400/50" fill="currentColor">
              <rect x="1.6" y="1.6" width="4.8" height="4.8" transform="rotate(45 4 4)" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Tiny amber corner brackets for panels and terminals. */
const TICKS = [
  'top-0 left-0 border-t border-l',
  'top-0 right-0 border-t border-r',
  'bottom-0 left-0 border-b border-l',
  'bottom-0 right-0 border-b border-r',
];

const PLUS = [
  '-top-1 -left-1',
  '-top-1 -right-1',
  '-bottom-1 -left-1',
  '-bottom-1 -right-1',
];

export function CornerTicks({ plus = false }) {
  if (plus) {
    return (
      <>
        {PLUS.map((pos) => (
          <span
            key={pos}
            aria-hidden="true"
            className={`pointer-events-none absolute ${pos} font-mono text-[10px] leading-none text-amber-400/50`}
          >
            +
          </span>
        ))}
      </>
    );
  }
  return (
    <>
      {TICKS.map((pos) => (
        <span key={pos} aria-hidden="true" className={`pointer-events-none absolute h-2.5 w-2.5 border-amber-300/60 ${pos}`} />
      ))}
    </>
  );
}
