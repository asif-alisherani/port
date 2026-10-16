import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { closeDetail, openDetail } from '../hooks/useHashRoute.js';
import { CornerTicks } from './SectionChrome.jsx';

const EASE = [0.22, 1, 0.36, 1];

function Arrow({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/**
 * Shared full-page case study for projects and side quests. Takes over the
 * viewport above everything else: hero, meta strip, process film, the work,
 * stack + links, gallery with lightbox, and a next-entry cycler.
 */
export default function DetailPage({ entry, siblings, kind, backLabel, nextLabel }) {
  const reduce = useReducedMotion();
  const scrollRef = useRef(null);
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const { scrollYProgress } = useScroll({ container: scrollRef });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  const index = siblings.findIndex((p) => p.slug === entry.slug);
  const next = siblings[(index + 1) % siblings.length];

  // Lock the page behind while the dossier is open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Reset between entries.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    setPlaying(false);
    setLightbox(null);
  }, [entry.slug]);

  // Esc closes the lightbox first, then the case study.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (lightbox) setLightbox(null);
      else closeDetail();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <motion.div
      key={entry.slug}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="fixed inset-0 z-[70] bg-black"
    >
      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <button
            type="button"
            onClick={closeDetail}
            className="group inline-flex items-center gap-2.5 font-mono text-[10px] tracking-[0.25em] text-neutral-300 uppercase transition-colors duration-300 hover:text-amber-300"
          >
            <span className="grid h-8 w-8 place-items-center border border-white/15 transition-all duration-300 group-hover:border-amber-400/60 group-hover:shadow-[0_0_16px_rgba(252,211,77,0.2)]">
              <Arrow className="h-3.5 w-3.5 rotate-180" />
            </span>
            {backLabel}
          </button>

          <span className="hidden font-mono text-[10px] tracking-[0.3em] text-neutral-500 uppercase sm:block">
            {entry.title}
          </span>

          <button
            type="button"
            onClick={closeDetail}
            aria-label="Close detail page"
            className="group grid h-8 w-8 place-items-center border border-white/15 text-neutral-400 transition-all duration-300 hover:border-amber-400/60 hover:text-amber-300"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" className="h-4 w-4">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <motion.span
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="absolute -bottom-px left-0 h-px w-full origin-left bg-gradient-to-r from-amber-300 to-amber-400/40 shadow-[0_0_8px_rgba(252,211,77,0.5)]"
        />
      </div>

      {/* Scrollable body */}
      <div ref={scrollRef} className="h-full overflow-y-auto overscroll-contain pt-[57px]">
        {/* Hero */}
        <header className="relative border-b border-white/5">
          <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 z-10 opacity-[0.05] mix-blend-overlay" />
          <div className="relative h-[46vh] min-h-72 w-full overflow-hidden md:h-[58vh]">
            <img src={entry.cover} alt={entry.title} className="h-full w-full object-cover brightness-[0.55]" />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
          </div>

          <div className="relative mx-auto -mt-28 w-full max-w-6xl px-5 pb-14 md:-mt-36 md:px-8">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
              className="flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-[0.35em] text-amber-400/90 uppercase"
            >
              {entry.tag}
              <span className="h-px w-8 bg-amber-400/40" />
              {entry.year}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.7, ease: EASE }}
              className="mt-5 font-anton text-5xl leading-[0.95] tracking-tight text-neutral-50 uppercase sm:text-6xl md:text-8xl"
            >
              {entry.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-300 md:text-xl"
            >
              {entry.summary}
            </motion.p>
          </div>
        </header>

        {/* Meta strip */}
        <div className="border-b border-white/5 bg-neutral-950/60">
          <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px bg-white/5 px-0 md:grid-cols-4">
            {[
              ['Role', entry.role],
              ['Client', entry.client],
              ['Timeline', entry.duration],
              ['Year', entry.year],
            ].map(([k, v]) => (
              <div key={k} className="bg-black px-5 py-6 md:px-8">
                <dt className="font-mono text-[9px] tracking-[0.3em] text-neutral-600 uppercase">{k}</dt>
                <dd className="mt-2 font-display text-sm font-medium text-neutral-100">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
          {/* Process film is optional for entries that only have stills. */}
          {entry.video && (
            <section aria-label="Process film" className="relative">
              <p className="font-mono text-[10px] tracking-[0.4em] text-amber-400/90 uppercase">Process film</p>
              <div className="relative mt-5 overflow-hidden border border-white/15 bg-neutral-950">
                <CornerTicks />
                <video
                  ref={videoRef}
                  src={entry.video}
                  poster={entry.cover}
                  playsInline
                  loop
                  muted
                  preload="none"
                  onClick={togglePlay}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  className="aspect-video w-full cursor-pointer object-cover"
                />
                {!playing && (
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label="Play process film"
                    className="group absolute inset-0 grid place-items-center bg-black/45 transition-colors duration-300 hover:bg-black/25"
                  >
                    <span className="grid h-16 w-16 place-items-center rounded-full border border-amber-400/60 bg-black/70 text-amber-300 shadow-[0_0_34px_rgba(252,211,77,0.3)] transition-transform duration-300 group-hover:scale-110 md:h-20 md:w-20">
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-1 h-6 w-6">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </button>
                )}
                {playing && (
                  <span className="pointer-events-none absolute top-3 left-3 flex items-center gap-2 border border-amber-400/40 bg-black/70 px-2 py-1 font-mono text-[9px] tracking-[0.25em] text-amber-300 uppercase backdrop-blur-sm">
                    <span className="h-1 w-1 animate-pulse rounded-full bg-amber-400" />
                    Playing
                  </span>
                )}
              </div>
            </section>
          )}

          {/* Description + sidebar */}
          <div className={`${entry.video ? 'mt-20' : ''} grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-20`}>
            <section aria-label="About">
              <p className="font-mono text-[10px] tracking-[0.4em] text-amber-400/90 uppercase">The work</p>
              <div className="mt-6 space-y-6">
                {entry.description.map((para, i) => (
                  <p
                    key={i}
                    className={`leading-relaxed text-neutral-400 ${i === 0 ? 'text-lg text-neutral-300' : 'text-base'}`}
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* Highlights */}
              <dl className="mt-12 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
                {entry.highlights.map(([k, v]) => (
                  <div key={k} className="bg-neutral-950 p-5">
                    <dt className="font-mono text-[9px] tracking-[0.25em] text-neutral-600 uppercase">{k}</dt>
                    <dd className="mt-2 font-display text-xl font-semibold text-amber-300">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Sidebar: stack + links */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <p className="font-mono text-[10px] tracking-[0.4em] text-amber-400/90 uppercase">Stack & tools</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {entry.stack.map((tool) => (
                  <li
                    key={tool}
                    className="border border-white/15 px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] text-neutral-300 transition-colors duration-300 hover:border-amber-400/50 hover:bg-amber-400/5 hover:text-amber-200"
                  >
                    {tool}
                  </li>
                ))}
              </ul>

              <p className="mt-12 font-mono text-[10px] tracking-[0.4em] text-amber-400/90 uppercase">Links</p>
              <ul className="mt-5 space-y-2.5">
                {entry.links.map(({ label, href }) => (
                  <li key={label}>
                    {href && href !== '#' ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between border border-white/10 px-4 py-3 font-mono text-[10px] tracking-[0.25em] text-neutral-300 uppercase transition-all duration-300 hover:border-amber-400/60 hover:bg-amber-400/5 hover:text-amber-300"
                      >
                        {label}
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          <Arrow className="h-3.5 w-3.5 -rotate-45" />
                        </span>
                      </a>
                    ) : (
                      <span
                        aria-disabled="true"
                        className="flex items-center justify-between border border-white/5 px-4 py-3 font-mono text-[10px] tracking-[0.25em] text-neutral-700 uppercase"
                      >
                        {label}
                        <span className="text-[8px]">Coming soon</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          {/* Gallery */}
          <section aria-label="Gallery" className="mt-24">
            <p className="font-mono text-[10px] tracking-[0.4em] text-amber-400/90 uppercase">Gallery</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {entry.gallery.map(({ src, caption }, i) => (
                <motion.figure
                  key={caption}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                  className={i === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}
                >
                  <button
                    type="button"
                    onClick={() => setLightbox(src)}
                    className="group relative block w-full overflow-hidden border border-white/10 bg-neutral-950 transition-colors duration-500 hover:border-amber-400/40"
                  >
                    <img
                      src={src}
                      alt={caption}
                      loading="lazy"
                      className={`w-full object-cover brightness-90 transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:brightness-110 ${
                        i === 0 ? 'aspect-[16/10]' : 'aspect-[4/5]'
                      }`}
                    />
                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="absolute right-3 bottom-3 border border-amber-400/40 bg-black/80 px-2 py-1 font-mono text-[9px] tracking-[0.25em] text-amber-300 uppercase opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                      Expand
                    </span>
                  </button>
                  <figcaption className="mt-3 font-mono text-[10px] tracking-[0.2em] text-neutral-600 uppercase">
                    {caption}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </section>

          {/* Next entry */}
          <section aria-label="Next" className="mt-24 border-t border-white/10 pt-12">
            <button
              type="button"
              onClick={() => openDetail(kind, next.slug)}
              className="group flex w-full flex-col gap-6 text-left sm:flex-row sm:items-center sm:justify-between"
            >
              <span>
                <span className="font-mono text-[10px] tracking-[0.35em] text-neutral-600 uppercase">{nextLabel}</span>
                <span className="mt-3 block font-anton text-4xl leading-none tracking-tight text-neutral-200 uppercase transition-colors duration-300 group-hover:text-amber-300 md:text-6xl">
                  {next.title}
                </span>
                <span className="mt-3 block font-mono text-[10px] tracking-[0.25em] text-neutral-500 uppercase">
                  {next.tag}
                </span>
              </span>
              <span className="grid h-16 w-16 shrink-0 place-items-center border border-white/15 text-neutral-400 transition-all duration-300 group-hover:border-amber-400/60 group-hover:bg-amber-400 group-hover:text-black md:h-20 md:w-20">
                <Arrow className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          </section>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 grid cursor-zoom-out place-items-center bg-black/92 p-6 backdrop-blur-sm"
        >
          <img src={lightbox} alt="" className="max-h-full max-w-5xl object-contain" />
          <span className="absolute top-5 right-5 font-mono text-[10px] tracking-[0.25em] text-neutral-500 uppercase">
            Esc / click to close
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
