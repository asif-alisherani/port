import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useContent } from '../context/ContentContext.jsx';
import { getIcon } from '../data/icons.jsx';
import { CornerTicks, SectionHead } from './SectionChrome.jsx';

const EASE = [0.22, 1, 0.36, 1];
const EQ_BARS = [0, 1, 2, 3, 4];

const DESCRIPTION = 'Tools I use to build and support this layer of a product system.';

/**
 * "Technology universe" — a control deck: five domain switches drive an
 * animated toolkit panel with blur-materialising chips, an equaliser readout
 * and a schematic ring turning slowly behind it all.
 */
export default function TechUniverse() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const { techDomains: DOMAINS } = useContent();
  const rise = reduce ? 0 : 26;

  // Guard against the domain list shrinking after an admin edit.
  const active = Math.min(index, Math.max(DOMAINS.length - 1, 0));
  const setActive = setIndex;
  const domain = DOMAINS[active];

  if (!domain) return null;

  const item = {
    hidden: { opacity: 0, y: rise },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  };

  const onTabKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next =
      e.key === 'ArrowRight'
        ? (active + 1) % DOMAINS.length
        : (active + DOMAINS.length - 1) % DOMAINS.length;
    setActive(next);
    document.getElementById(`tech-tab-${next}`)?.focus();
  };

  return (
    <section
      id="tech-universe"
      aria-labelledby="tech-universe-title"
      className="relative overflow-hidden border-t border-white/5 bg-black py-24 md:py-32"
    >
      {/* Faint grid, fading towards the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,black,transparent)]"
      />
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" />

      {/* Schematic rings turning behind the deck */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-56 hidden h-[34rem] w-[34rem] -translate-y-1/2 animate-[rotate-slow_70s_linear_infinite] rounded-full border border-dashed border-amber-400/10 lg:block motion-reduce:animate-none"
      >
        <span className="absolute top-1/2 -left-1 h-2 w-2 -translate-y-1/2 rotate-45 bg-amber-400/50" />
        <span className="absolute inset-16 rounded-full border border-white/5" />
        <span className="absolute inset-32 rounded-full border border-dashed border-white/5" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-16 px-6 md:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        {/* Intro */}
        <div className="relative">
          <SectionHead
            index="04"
            eyebrow="Technology universe"
            id="tech-universe-title"
            ghost="Stack"
            title={
              <>
                A stack that moves between product needs
                <span className="text-amber-400">.</span>
              </>
            }
            blurb="The tools change. The aim stays the same: useful systems, clear interfaces, and reliable foundations."
          />
        </div>

        {/* The control deck */}
        <motion.div
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="relative pl-4"
        >
          {/* Amber power rail */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-amber-400 via-amber-400/50 to-transparent"
          />

          {/* Domain switches */}
          <div
            role="tablist"
            aria-label="Technology domains"
            onKeyDown={onTabKey}
            className="grid grid-cols-2 gap-2.5 sm:grid-cols-5"
          >
            {DOMAINS.map(({ label, icon }, i) => {
              const selected = i === active;
              return (
                <button
                  key={label}
                  id={`tech-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="tech-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`group relative flex flex-col items-start gap-3 border p-3.5 text-left transition-all duration-300 ${
                    selected
                      ? '-translate-y-1 border-amber-400/70 bg-amber-400/10 shadow-[0_0_26px_rgba(252,211,77,0.16)]'
                      : 'border-white/10 bg-neutral-950 hover:-translate-y-0.5 hover:border-white/25 hover:bg-neutral-900'
                  }`}
                >
                  <span className="flex w-full items-center justify-between">
                    <span
                      className={`font-mono text-[10px] tracking-[0.25em] ${
                        selected ? 'text-amber-300' : 'text-neutral-500 group-hover:text-neutral-300'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                        selected
                          ? 'bg-amber-400 shadow-[0_0_8px_rgba(252,211,77,0.8)]'
                          : 'bg-neutral-700 group-hover:bg-neutral-500'
                      }`}
                    />
                  </span>
                  <span className={`transition-all duration-300 ${selected ? 'scale-110 text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.5)]' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
                    {getIcon(icon)}
                  </span>
                  <span
                    className={`font-display text-xs font-semibold tracking-tight ${
                      selected ? 'text-amber-100' : 'text-neutral-300'
                    }`}
                  >
                    {label}
                  </span>
                  {/* Load meter */}
                  <span className="relative h-px w-full bg-white/5">
                    <motion.span
                      aria-hidden="true"
                      initial={false}
                      animate={{ width: selected ? '100%' : '14%' }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className={`absolute inset-y-0 left-0 ${selected ? 'bg-amber-400/80' : 'bg-neutral-700'}`}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Toolkit panel */}
          <div className="relative mt-8">
            {/* Brutal offset shadow */}
            <span
              aria-hidden="true"
              className="absolute inset-0 translate-x-2.5 translate-y-2.5 border border-white/10 bg-white/5"
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                id="tech-panel"
                role="tabpanel"
                aria-label={domain.label}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="relative grid border border-amber-400/20 bg-neutral-950 sm:grid-cols-[minmax(0,2fr)_minmax(0,5fr)]"
              >
                <CornerTicks />

                {/* Readout strip */}
                <div className="relative flex flex-col justify-between gap-10 border-b border-white/10 bg-black p-6 sm:border-r sm:border-b-0">
                  <span className="font-mono text-[10px] tracking-[0.2em] whitespace-nowrap text-neutral-500">
                    DOMAIN {String(active + 1).padStart(2, '0')} / {String(DOMAINS.length).padStart(2, '0')}
                  </span>
                  <div className="text-amber-300">
                    <motion.div
                      key={`icon-${active}`}
                      initial={reduce ? false : { scale: 0.6, opacity: 0, rotate: -12 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <span className="[&>svg]:h-9 [&>svg]:w-9 [&>svg]:drop-shadow-[0_0_10px_rgba(252,211,77,0.4)]">
                        {getIcon(domain.icon)}
                      </span>
                    </motion.div>
                  </div>
                  {/* Equaliser */}
                  <div aria-hidden="true" className="flex h-6 items-end gap-1">
                    {EQ_BARS.map((bar) => (
                      <span
                        key={bar}
                        style={{ animationDelay: `${bar * 0.13}s`, animationDuration: `${1 + bar * 0.12}s` }}
                        className="w-1 origin-bottom animate-[eq_1.2s_ease-in-out_infinite] bg-amber-400/60 motion-reduce:animate-none"
                        data-bar={bar}
                      >
                        <span className="block h-6" />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Toolkit */}
                <div className="p-6 md:p-8">
                  <p className="flex items-center justify-between font-mono text-[10px] tracking-[0.35em] text-amber-400/90 uppercase">
                    Active toolkit
                    <span className="flex items-center gap-2 text-neutral-600">
                      <span className="h-1 w-1 animate-pulse rounded-full bg-amber-400" />
                      LIVE
                    </span>
                  </p>
                  <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight text-neutral-100 md:text-4xl">
                    {domain.label}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-400">{DESCRIPTION}</p>
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${domain.label} tools`}>
                    {domain.tools.map((tool, i) => (
                      <motion.li
                        key={tool}
                        initial={reduce ? false : { opacity: 0, y: 8, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ delay: 0.15 + i * 0.05, duration: 0.45, ease: EASE }}
                        className="border border-white/15 px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] text-neutral-300 transition-colors duration-300 hover:border-amber-400/50 hover:bg-amber-400/5 hover:text-amber-200"
                      >
                        {tool}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Deck footer telemetry */}
          <div aria-hidden="true" className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[9px] tracking-[0.25em] text-neutral-600 uppercase">
            <span>MEM / 512M · OK</span>
            <span>CORE TEMP / 36.2°C</span>
            <span className="text-amber-400/50">UPLINK / SECURE</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
