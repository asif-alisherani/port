import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useContent } from '../context/ContentContext.jsx';
import { openProject } from '../hooks/useHashRoute.js';
import { SectionHead } from './SectionChrome.jsx';

const EASE = [0.22, 1, 0.36, 1];

// Staggered pin heights, like film cells on a wall.
const OFFSETS = [0, 56, 8, 72, 0, 48];

/** 35mm sprocket-hole strip along one edge of a film cell. */
function Sprockets({ side }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-x-0 ${side} z-10 h-4 border-white/10 bg-black/80 opacity-90 [background-image:radial-gradient(circle,rgba(244,244,245,0.28)_1.6px,transparent_1.8px)] [background-size:16px_8px] [background-position:center] ${side === 'top-0' ? 'border-b' : 'border-t'}`}
    />
  );
}

/**
 * "Projects" — a cinema reel of staggered film cells. Drag with the mouse,
 * swipe on touch, or use the HUD arrows. Selecting a cell opens its full
 * case study.
 */
export default function Projects() {
  const reduce = useReducedMotion();
  const { projects: PROJECTS } = useContent();
  const railRef = useRef(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: 0 });
  const queued = useRef(false);
  const [progress, setProgress] = useState(0);

  const rise = reduce ? 0 : 26;
  const item = {
    hidden: { opacity: 0, y: rise },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };

  // ---- scroll progress ----------------------------------------------------
  const syncProgress = () => {
    if (queued.current) return;
    queued.current = true;
    requestAnimationFrame(() => {
      queued.current = false;
      const el = railRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    });
  };
  useEffect(syncProgress, []);

  const nudge = (dir) => {
    const el = railRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: reduce ? 'auto' : 'smooth' });
  };

  // ---- mouse drag-to-scroll (without swallowing clicks) --------------------
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const el = railRef.current;
    drag.current = { down: true, x: e.clientX, left: el.scrollLeft, moved: 0 };
  };
  const onPointerMove = (e) => {
    if (!drag.current.down) return;
    const el = railRef.current;
    const dx = e.clientX - drag.current.x;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    el.scrollLeft = drag.current.left - dx;
  };
  const endDrag = () => {
    drag.current.down = false;
  };

  const openIfNotDragging = (slug) => {
    if (drag.current.moved > 6) return; // it was a drag, not a click
    openProject(slug);
  };

  const percent = Math.round(progress * 100);

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="relative overflow-hidden border-t border-white/5 bg-black py-24 md:py-32"
    >
      {/* Faint grid, fading towards the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,black,transparent)]"
      />
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" />

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead
            index="02"
            eyebrow="Projects"
            id="projects-title"
            ghost="Reel"
            title={
              <>
                Stories, drawn and shipped<span className="text-amber-400">.</span>
              </>
            }
          />

          <motion.div
            initial={{ opacity: 0, y: rise }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex items-center gap-3 pb-2"
          >
            <span className="mr-2 hidden font-mono text-[10px] tracking-[0.3em] text-neutral-500 md:block">
              DRAG / SCROLL
            </span>
            <button
              type="button"
              onClick={() => nudge(-1)}
              aria-label="Scroll projects backwards"
              className="group grid h-11 w-11 place-items-center border border-white/15 text-neutral-300 transition-all duration-300 hover:border-amber-400/60 hover:text-amber-300 hover:shadow-[0_0_20px_rgba(252,211,77,0.2)]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden="true">
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              aria-label="Scroll projects forwards"
              className="group grid h-11 w-11 place-items-center border border-white/15 text-neutral-300 transition-all duration-300 hover:border-amber-400/60 hover:text-amber-300 hover:shadow-[0_0_20px_rgba(252,211,77,0.2)]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>

      {/* The reel. Full-bleed so cells can run edge to edge. */}
      <motion.ul
        ref={railRef}
        onScroll={syncProgress}
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="no-scrollbar mt-14 flex cursor-grab snap-x snap-proximity gap-6 overflow-x-auto px-6 pt-4 pb-8 select-none active:cursor-grabbing md:px-10 lg:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] scroll-pl-6 md:scroll-pl-10 lg:scroll-pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] overscroll-x-contain [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]"
      >
        {PROJECTS.map(({ slug, title, tag, cover, year }, i) => (
          <motion.li
            key={slug}
            variants={item}
            style={{ marginTop: OFFSETS[i % OFFSETS.length] }}
            className="w-56 shrink-0 snap-start sm:w-64"
          >
            <article
              role="link"
              tabIndex={0}
              onClick={() => openIfNotDragging(slug)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openProject(slug);
                }
              }}
              aria-label={`${title} — ${tag}. View case study`}
              className="group cursor-pointer outline-none transition-transform duration-500 ease-out hover:-translate-y-2 focus-visible:-translate-y-2"
            >
              <div className="relative overflow-hidden border border-white/10 bg-neutral-950 transition-colors duration-500 group-hover:border-amber-400/40 group-focus-visible:border-amber-400/70 group-hover:shadow-[0_18px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(252,211,77,0.07)]">
                <Sprockets side="top-0" />
                <img
                  src={cover}
                  alt={`${title} — ${tag}`}
                  draggable={false}
                  loading="lazy"
                  className="aspect-[5/8] w-full object-cover brightness-[0.88] transition-all duration-700 ease-out group-hover:scale-[1.06] group-hover:brightness-105"
                />
                <Sprockets side="bottom-0" />

                {/* Scan sweep on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 z-20 h-px bg-amber-300/80 opacity-0 shadow-[0_0_12px_2px_rgba(252,211,77,0.5)] group-hover:opacity-100 group-hover:[animation:scan-y_1.4s_linear_infinite]"
                />

                {/* Legibility gradient + view affordance */}
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <span className="absolute bottom-6 left-3 z-20 flex items-center gap-2 border border-amber-400/50 bg-black/85 px-3 py-1.5 font-mono text-[9px] tracking-[0.3em] text-amber-300 uppercase opacity-0 backdrop-blur-sm transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100 translate-y-1.5">
                  View project
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-3 w-3">
                    <path d="M7 17 17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </span>
              </div>

              <div className="mt-4 flex items-baseline justify-between gap-3">
                <h3 className="font-display text-base font-semibold tracking-tight text-neutral-100 transition-colors duration-300 group-hover:text-amber-200">
                  {title}
                </h3>
                <span className="font-mono text-[9px] tracking-[0.2em] text-neutral-600">{year}</span>
              </div>
              <p className="mt-1 font-mono text-[10px] tracking-[0.25em] text-neutral-500 uppercase">{tag}</p>
            </article>
          </motion.li>
        ))}
      </motion.ul>

      {/* Head-unit readout: progress line + live percentage */}
      <div className="relative mx-auto mt-4 w-full max-w-7xl px-6 md:px-10">
        <div className="flex items-center gap-5">
          <span className="font-mono text-[9px] tracking-[0.3em] text-neutral-600 uppercase">Reel head</span>
          <div className="relative h-px flex-1 bg-white/10">
            <div
              className="absolute inset-y-0 left-0 bg-amber-400/80 shadow-[0_0_8px_rgba(252,211,77,0.6)] transition-[width] duration-150 ease-out"
              style={{ width: `${Math.max(8, progress * 100)}%` }}
            />
            <span
              aria-hidden="true"
              className="absolute top-1/2 h-2.5 w-px -translate-y-1/2 bg-amber-300 transition-[left] duration-150 ease-out"
              style={{ left: `${Math.max(8, progress * 100)}%` }}
            />
          </div>
          <span className="w-12 text-right font-mono text-[10px] tracking-[0.2em] text-amber-300/90">
            {String(percent).padStart(3, '0')}%
          </span>
        </div>
      </div>
    </section>
  );
}
