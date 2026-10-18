import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useContent } from '../context/ContentContext.jsx';
import { SectionHead } from './SectionChrome.jsx';

const EASE = [0.22, 1, 0.36, 1];

const NUMBER_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

/** Telemetry derived from the entries themselves (no hard-coded numbers). */
function telemetry(entries) {
  const years = entries
    .flatMap(({ period }) => (String(period).match(/\b(19|20)\d{2}\b/g) ?? []).map(Number));
  const since = years.length ? Math.min(...years) : null;
  const active = since ? Math.max(1, new Date().getFullYear() - since) : null;
  const current = entries.some((e) => e.current);
  return {
    count: entries.length,
    rows: [
      ['TEAMS', String(entries.length).padStart(2, '0')],
      ...(active ? [['YEARS ACTIVE', `${String(active).padStart(2, '0')}+`]] : []),
      ['STATUS', current ? 'CURRENTLY SHIPPING' : 'OPEN TO NEW WORK'],
    ],
  };
}


/**
 * "Experience" — a sticky mission brief beside a flight-log timeline whose
 * rail physically fills with amber as you scroll through the years.
 */
export default function Experience() {
  const reduce = useReducedMotion();
  const rise = reduce ? 0 : 26;
  const logRef = useRef(null);
  const { experience: EXPERIENCE, experienceReady } = useContent();
  const stats = telemetry(EXPERIENCE);
  const teamWord = NUMBER_WORDS[stats.count] ?? String(stats.count);

  const { scrollYProgress } = useScroll({
    target: logRef,
    offset: ['start 0.75', 'end 0.45'],
  });
  const railFill = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  const item = {
    hidden: { opacity: 0, y: rise },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
  };

  // Nothing published: hide the whole section (the navbar hides its link too).
  if (experienceReady && EXPERIENCE.length === 0) return null;

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="relative overflow-hidden border-t border-white/5 bg-black py-24 md:py-32"
    >
      {/* Faint grid, fading towards the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,black,transparent)]"
      />
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" />

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="grid gap-20 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-24">
          {/* Sticky mission brief */}
          <div className="self-start lg:sticky lg:top-24">
            <SectionHead
              index="03"
              eyebrow="Experience"
              id="experience-title"
              ghost="Work"
              title={
                <>
                  Where I&rsquo;ve worked<span className="text-amber-400">.</span>
                </>
              }
              blurb={
                stats.count
                  ? `${teamWord} ${stats.count === 1 ? 'team' : 'teams'}, one habit: leave the codebase, the docs and the deploy pipeline better than I found them.`
                  : 'One habit: leave the codebase, the docs and the deploy pipeline better than I found them.'
              }
            />

            {/* Telemetry card, sticky under the brief */}
            <motion.div
              initial={{ opacity: 0, y: rise }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
              className="mt-12 hidden border border-white/10 bg-neutral-950/60 p-5 lg:block"
            >
              <p className="font-mono text-[9px] tracking-[0.3em] text-neutral-600 uppercase">Flight telemetry</p>
              <div className="mt-4 space-y-3">
                {stats.rows.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-500">{k}</span>
                    <span className="font-mono text-[11px] tracking-[0.15em] text-amber-300/90">{v}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Flight log with a scroll-driven rail fill */}
          <motion.ol
            key={EXPERIENCE.map((e) => `${e.id ?? e.company}:${e.role}`).join('|') || 'loading'}
            ref={logRef}
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="relative space-y-16 border-l border-white/10 pl-8 md:pl-12"
          >
            {/* Amber rail fill, driven by page scroll */}
            <motion.span
              aria-hidden="true"
              style={{ scaleY: railFill }}
              className="absolute top-0 -left-px h-full w-px origin-top bg-gradient-to-b from-amber-300 via-amber-400/80 to-amber-400/40 shadow-[0_0_10px_rgba(252,211,77,0.4)]"
            />

            {/* Placeholder rows while the API wakes up */}
            {!experienceReady &&
              [0, 1, 2].map((i) => (
                <li key={`skeleton-${i}`} aria-hidden="true" className="relative">
                  <span className="absolute top-3 -left-[36.5px] h-2 w-2 rounded-full border border-white/15 bg-black md:-left-[52.5px]" />
                  <div className="h-3 w-28 animate-pulse bg-neutral-900" style={{ animationDelay: `${i * 150}ms` }} />
                  <div className="mt-4 h-7 w-2/3 animate-pulse bg-neutral-900" style={{ animationDelay: `${i * 150}ms` }} />
                  <div className="mt-3 h-3 w-40 animate-pulse bg-neutral-900/80" style={{ animationDelay: `${i * 150}ms` }} />
                  <div className="mt-5 h-3 w-full max-w-xl animate-pulse bg-neutral-900/60" style={{ animationDelay: `${i * 150}ms` }} />
                  <div className="mt-2 h-3 w-4/5 max-w-lg animate-pulse bg-neutral-900/60" style={{ animationDelay: `${i * 150}ms` }} />
                </li>
              ))}

            {EXPERIENCE.map(({ id, period, role, company, summary, stack = [], current }, i) => (
              <motion.li key={id ?? `${company}-${i}`} variants={item} className="group relative">
                {/* Node on the rail */}
                <span
                  aria-hidden="true"
                  className={
                    current
                      ? 'absolute top-3 -left-[36px] h-2 w-2 animate-pulse rounded-full bg-amber-400 shadow-[0_0_10px_2px_rgba(252,211,77,0.5)] md:-left-[52px]'
                      : 'absolute top-3 -left-[36.5px] h-2 w-2 rounded-full border border-amber-400/60 bg-black transition-colors duration-300 group-hover:border-amber-300 md:-left-[52.5px]'
                  }
                />

                {/* Hover backdrop */}
                <span
                  aria-hidden="true"
                  className="absolute -inset-x-6 -inset-y-5 border border-white/0 bg-gradient-to-r from-white/[0.045] to-transparent opacity-0 transition-all duration-500 group-hover:border-white/10 group-hover:opacity-100 md:-inset-x-8"
                />

                {/* Ghost index */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-9 right-0 font-display text-6xl font-bold text-white/[0.045] transition-colors duration-500 select-none group-hover:text-amber-400/10 md:text-7xl"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="relative">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <p className="font-mono text-[11px] tracking-[0.3em] text-amber-400/80">{period}</p>
                    {current && (
                      <span className="border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 font-mono text-[8px] tracking-[0.3em] text-amber-300 uppercase">
                        On duty
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-neutral-100 transition-colors duration-300 group-hover:text-amber-100 md:text-3xl">
                    {role}
                  </h3>
                  <p className="mt-1.5 font-mono text-xs tracking-[0.2em] text-neutral-500 uppercase">
                    {company}
                  </p>
                  {summary && <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400">{summary}</p>}
                  {stack.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Technologies at ${company}`}>
                    {stack.map((tech) => (
                      <li
                        key={tech}
                        className="border border-white/10 px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] text-neutral-400 uppercase transition-colors duration-300 group-hover:border-amber-400/30 group-hover:text-neutral-300"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
