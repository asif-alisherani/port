import { useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useImages } from '../hooks/useImages.js';
import CustomCursor from './CustomCursor.jsx';
import FilmOverlays from './FilmOverlays.jsx';
import Loader from './Loader.jsx';
import ParticleField from './ParticleField.jsx';

// Artwork lives on the author's public Google Drive (original PNG bytes).
const decayedUrl = 'https://lh3.googleusercontent.com/d/1tAFqIVyXiwhj22-gv5tQtGbGkVDPvHei';
const pristineUrl = 'https://lh3.googleusercontent.com/d/1DwkmgmEcGuYO2DN4ZQWaYPpFtwN61HP7';

// Module-level so the array identity is stable between renders.
const SOURCES = [decayedUrl, pristineUrl];

const EASE = [0.22, 1, 0.36, 1];

/** Name flanking the figure: clipped per-letter rise, Anton condensed caps. */
function FlankWord({ text, sub, delay = 0, align = 'left', className = '' }) {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 select-none ${
        align === 'right' ? 'text-right' : 'text-left'
      } ${className}`}
    >
      <span className="inline-flex overflow-hidden pb-1">
        {[...text].map((ch, i) => (
          <motion.span
            key={`${ch}-${i}`}
            initial={reduce ? { opacity: 0 } : { y: '112%' }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            transition={{ delay: delay + i * 0.055, duration: 0.95, ease: EASE }}
            className="inline-block font-anton text-[16vw] leading-[0.9] tracking-[0.01em] text-neutral-100 md:text-[8.5vw] lg:text-[7.5vw]"
          >
            {ch}
          </motion.span>
        ))}
      </span>
      {sub && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4, duration: 0.9, ease: 'easeOut' }}
          className={`mt-3 flex items-center gap-2 font-mono text-[9px] tracking-[0.4em] text-neutral-600 uppercase md:text-[10px] ${
            align === 'right' ? 'justify-end' : 'justify-start'
          }`}
        >
          <span className="h-px w-6 bg-amber-400/50" />
          {sub}
          {align === 'right' && <span className="h-px w-6 bg-amber-400/50" />}
        </motion.span>
      )}
    </div>
  );
}

/** The surname as a colossal outline behind the figure, masked in the middle. */
function GhostSurname() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.9, duration: 1.8, ease: 'easeOut' }}
      className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center select-none"
    >
      <span className="font-anton text-[24vw] leading-none tracking-[0.015em] whitespace-nowrap text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.14)] md:text-[22vw] [-webkit-mask-image:radial-gradient(ellipse_38%_74%_at_50%_58%,transparent_35%,black_78%)] [mask-image:radial-gradient(ellipse_38%_74%_at_50%_58%,transparent_35%,black_78%)]">
        SHERANI
      </span>
    </motion.div>
  );
}

/**
 * Cyborg transformation hero.
 *
 * The pristine cyborg is built from particles. Move the pointer over it and
 * they blast away from the cursor, revealing the decayed machine beneath;
 * move on and they spring back.
 *
 * The figure is framed by the name: ASIF to the left, ALI to the right, and
 * SHERANI as a giant outline behind the machine.
 *
 * @param {object} props
 * @param {'focus'|'contain'} [props.fit]  'contain' reproduces the original framing exactly;
 *                                         'focus' (default) is identical on 16:9+ screens and
 *                                         keeps the figure large on narrower ones.
 * @param {object} [props.config]          physics overrides, see DEFAULT_CONFIG in lib/particleEngine.js
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children]  optional content layered above the artwork
 */
export default function CyborgHero({ fit = 'focus', config, className = '', children }) {
  const sectionRef = useRef(null);
  const { status, images } = useImages(SOURCES);
  const ready = status === 'ready';

  return (
    <section
      ref={sectionRef}
      data-status={status}
      aria-label="Cyborg transformation"
      className={`relative h-svh min-h-[32rem] w-full touch-pan-y overflow-hidden bg-black pointer-fine:cursor-none ${className}`}
    >
      {ready && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <ParticleField
            decayed={images[0]}
            pristine={images[1]}
            target={sectionRef}
            fit={fit}
            config={config}
          />
        </motion.div>
      )}

      {/* The surname behind the machine */}
      {ready && <GhostSurname />}

      <FilmOverlays />

      {/* The name, flanking the figure */}
      {ready && (
        <>
          <FlankWord
            text="ASIF"
            sub="Full-Stack Developer"
            delay={0.55}
            className="top-24 left-5 md:top-1/2 md:left-[6%] md:-translate-y-1/2"
          />
          <FlankWord
            text="ALI"
            sub="Folio © 2026"
            delay={0.75}
            align="right"
            className="right-5 bottom-28 md:top-1/2 md:right-[6%] md:bottom-auto md:-translate-y-1/2"
          />
        </>
      )}

      {children && <div className="pointer-events-none absolute inset-0 z-30">{children}</div>}

      <AnimatePresence>
        {!ready && <Loader key="loader" failed={status === 'error'} />}
      </AnimatePresence>

      <CustomCursor target={sectionRef} />
    </section>
  );
}
