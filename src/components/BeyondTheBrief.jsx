import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion } from 'motion/react';
import { useContent } from '../context/ContentContext.jsx';
import { openQuest } from '../hooks/useHashRoute.js';
import { SectionHead } from './SectionChrome.jsx';

const EASE = [0.22, 1, 0.36, 1];
const CYCLE_MS = 6500;

/** 35mm sprocket-hole strip along one edge of the frame. */
function Sprockets({ side }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-x-0 ${side} z-20 h-3.5 border-white/10 bg-black/75 opacity-90 [background-image:radial-gradient(circle,rgba(244,244,245,0.26)_1.4px,transparent_1.6px)] [background-size:15px_7px] [background-position:center] ${side === 'top-0' ? 'border-b' : 'border-t'}`}
    />
  );
}

/**
 * "Beyond the brief" — an auto-cycling quest showcase. Hover a quest to
 * preview it on the stage, click any quest to open its full dossier page.
 */
export default function BeyondTheBrief() {
  const reduce = useReducedMotion();
  const { quests: QUESTS } = useContent();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { margin: '-12% 0px -12% 0px' });
  const cycle = useMotionValue(0);

  // Guard against the quest list shrinking after an admin edit.
  const active = Math.min(index, Math.max(QUESTS.length - 1, 0));
  const setActive = setIndex;
  const entry = QUESTS[active];
  const paused = hovered || userPaused || !inView || reduce;

  // One linear motion value drives both the auto-advance and the rail timer.
  useEffect(() => {
    if (paused || !QUESTS.length) return undefined;
    cycle.set(0);
    const controls = animate(cycle, 1, {
      duration: CYCLE_MS / 1000,
      ease: 'linear',
      onComplete: () => setActive((a) => (a + 1) % QUESTS.length),
    });
    return () => controls.stop();
  }, [active, paused, cycle, QUESTS.length]);

  // A hover (or keyboard focus) previews the quest without opening it.
  const preview = (i) => {
    setActive(i);
    setUserPaused(false);
  };

  const rise = reduce ? 0 : 26;
  const item = {
    hidden: { opacity: 0, y: rise },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  if (!entry) return null;

  return (
    <section
      id="beyond-the-brief"
      aria-labelledby="brief-title"
      className="relative overflow-hidden border-t border-white/5 bg-black py-24 md:py-32"
    >
      {/* Faint grid, fading towards the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,black,transparent)]"
      />
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" />

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
        <SectionHead
          index="05"
          eyebrow="Beyond the brief"
          id="brief-title"
          align="right"
          ghost="Quests"
          title={
            <>
              Things I build, explore, collect,
              <br className="hidden md:block" /> and enjoy outside the brief
              <span className="text-amber-400">.</span>
            </>
          }
          blurb="Sandboxes, side-hustle studies, AI scribbles, esports, and the small personal projects that keep ideas moving."
        />

        <div
          ref={wrapRef}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          className="mt-16 grid items-start gap-10 md:mt-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14"
        >
          {/* The quest index: hover previews, click opens the dossier page */}
          <motion.ol
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
            }}
            aria-label="Side quests"
            className="lg:order-1"
          >
            {QUESTS.map(({ slug, file, date, title }, i) => {
              const selected = i === active;
              return (
                <motion.li key={slug} variants={item}>
                  <button
                    type="button"
                    onClick={() => openQuest(slug)}
                    onPointerEnter={(e) => {
                      if (e.pointerType === 'mouse') preview(i);
                    }}
                    onFocus={() => preview(i)}
                    aria-current={selected ? 'true' : undefined}
                    aria-label={`${title} — open the full breakdown`}
                    className="group relative w-full cursor-pointer border-b border-white/10 px-1 py-5 text-left transition-colors duration-300 focus-visible:outline-none md:py-6"
                  >
                    {/* Hover wash */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-0 -inset-x-3 transition-opacity duration-300 ${
                        selected ? 'bg-gradient-to-r from-amber-400/[0.06] to-transparent opacity-100' : 'bg-white/[0.03] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                      }`}
                    />
                    <span className="relative flex items-center justify-between gap-3 font-mono text-[9px] tracking-[0.3em] uppercase">
                      <span className={selected ? 'text-amber-400/90' : 'text-neutral-600 group-hover:text-neutral-400'}>{date}</span>
                      <span className="hidden text-neutral-700 transition-colors duration-300 sm:block group-hover:text-neutral-600">
                        {file}
                      </span>
                    </span>
                    <span className="relative mt-2.5 flex items-center justify-between gap-4">
                      <span
                        className={`font-display text-2xl font-semibold tracking-tight transition-colors duration-300 md:text-[1.85rem] ${
                          selected ? 'text-amber-100' : 'text-neutral-400 group-hover:text-neutral-100 group-focus-visible:text-neutral-100'
                        }`}
                      >
                        {title}
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className={`h-4 w-4 shrink-0 -rotate-45 transition-all duration-300 ${
                          selected ? 'translate-x-0 -translate-y-0 text-amber-300 opacity-100' : 'translate-x-1 translate-y-1 text-neutral-600 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                        }`}
                      >
                        <path d="M7 17 17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    </span>

                    {/* Autoplay timer lives under the active row */}
                    {selected && !paused && (
                      <motion.span
                        aria-hidden="true"
                        style={{ scaleX: cycle }}
                        className="absolute bottom-0 left-0 h-px w-full origin-left bg-amber-400/90 shadow-[0_0_10px_rgba(252,211,77,0.5)]"
                      />
                    )}
                    {selected && (
                      <span
                        aria-hidden="true"
                        className="absolute top-1/2 -left-4 hidden h-8 w-[3px] -translate-y-1/2 bg-amber-400 shadow-[0_0_12px_rgba(252,211,77,0.6)] lg:block"
                      />
                    )}
                  </button>
                </motion.li>
              );
            })}

            {/* Deck telemetry */}
            <motion.li variants={item} aria-hidden="true" className="mt-6 font-mono text-[9px] tracking-[0.25em] text-neutral-700 uppercase">
              <span className="text-amber-400/60">Cycle</span> — {userPaused ? 'held by visitor' : hovered ? 'held on hover' : 'auto, 6.5s per frame'} · click to open
            </motion.li>
          </motion.ol>

          {/* The stage + dossier */}
          <motion.div
            initial={{ opacity: 0, y: rise }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="lg:order-2"
          >
            <div className="relative">
              {/* Brutal offset shadow */}
              <span aria-hidden="true" className="absolute inset-0 translate-x-2.5 translate-y-2.5 border border-white/10 bg-white/5" />

              <div className="relative overflow-hidden border border-white/15 bg-neutral-950 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
                <Sprockets side="top-0" />
                <Sprockets side="bottom-0" />

                {/* Cover with a fresh ken-burns pull on every switch */}
                <div className="relative aspect-[4/3] sm:aspect-[16/10]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="absolute inset-0"
                    >
                      <motion.img
                        src={entry.cover}
                        alt={`${entry.title} — cover art`}
                        draggable={false}
                        initial={reduce ? false : { scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: (CYCLE_MS / 1000) * 0.92, ease: 'easeOut' }}
                        className="h-full w-full object-cover brightness-[0.92]"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Sweep line on switch */}
                  <motion.span
                    key={`sweep-${active}`}
                    aria-hidden="true"
                    initial={{ top: '-2%' }}
                    animate={reduce ? { opacity: 0 } : { top: '104%' }}
                    transition={{ duration: 0.9, ease: 'easeInOut' }}
                    className="absolute inset-x-0 z-10 h-px bg-amber-300/70 shadow-[0_0_12px_2px_rgba(252,211,77,0.4)]"
                  />

                  <span aria-hidden="true" className="grain absolute inset-0 z-10 opacity-[0.14] mix-blend-overlay" />
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-neutral-950/90 to-transparent" />

                  {/* Counter badge */}
                  <span className="absolute top-7 left-3 z-20 border border-amber-400/40 bg-black/70 px-2.5 py-1 font-mono text-[9px] tracking-[0.3em] text-amber-300 uppercase backdrop-blur-sm">
                    Quest {String(active + 1).padStart(2, '0')}/{String(QUESTS.length).padStart(2, '0')}
                  </span>

                  {/* Autoplay control */}
                  <button
                    type="button"
                    onClick={() => setUserPaused((p) => !p)}
                    aria-label={userPaused ? 'Resume auto-play' : 'Pause auto-play'}
                    aria-pressed={userPaused}
                    className={`absolute top-7 right-3 z-20 grid h-8 w-8 place-items-center border bg-black/70 backdrop-blur-sm transition-all duration-300 ${
                      userPaused
                        ? 'border-amber-400/60 text-amber-300 shadow-[0_0_14px_rgba(252,211,77,0.25)]'
                        : 'border-white/15 text-neutral-400 hover:border-amber-400/50 hover:text-amber-300'
                    }`}
                  >
                    {userPaused ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-0.5 h-3.5 w-3.5">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
                        <rect x="6" y="5" width="4" height="14" />
                        <rect x="14" y="5" width="4" height="14" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* The dossier summary, re-materialised per quest */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`dossier-${active}`}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, filter: 'blur(6px)' }}
                transition={{ duration: 0.4, ease: EASE }}
                className="mt-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h3 className="font-display text-3xl font-semibold tracking-tight text-neutral-100 md:text-4xl">
                    {entry.title}
                  </h3>
                  <span className="mt-2 border border-white/10 px-2.5 py-1 font-mono text-[9px] tracking-[0.25em] text-neutral-500 uppercase">
                    {entry.date}
                  </span>
                </div>

                <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-400">{entry.summary}</p>

                <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${entry.title} stack`}>
                  {entry.stack.map((tag, i) => (
                    <motion.li
                      key={tag}
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + i * 0.06, duration: 0.4, ease: EASE }}
                      className="border border-white/15 px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] text-neutral-400 uppercase transition-colors duration-300 hover:border-amber-400/50 hover:bg-amber-400/5 hover:text-amber-200"
                    >
                      {tag}
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
                  <button
                    type="button"
                    onClick={() => openQuest(entry.slug)}
                    className="group inline-flex items-center gap-2.5 bg-amber-400 px-5 py-3 font-mono text-[10px] font-medium tracking-[0.3em] text-black uppercase transition-all duration-300 hover:bg-amber-300 hover:shadow-[0_0_26px_rgba(252,211,77,0.4)]"
                  >
                    View full breakdown
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    >
                      <path d="M7 17 17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </button>
                  <p className="ml-auto font-mono text-[10px] tracking-[0.15em] text-neutral-700">
                    <span className="text-amber-400/50">guest@cyborg:~$</span> cd ~/side-quests/{entry.file}
                    <span className="animate-[blink_1s_steps(1)_infinite] text-amber-300"> ▍</span>
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
