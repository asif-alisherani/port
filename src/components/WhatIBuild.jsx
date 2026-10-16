import { motion, useReducedMotion } from 'motion/react';
import { useContent } from '../context/ContentContext.jsx';
import { getIcon } from '../data/icons.jsx';
import { SectionHead, Spotlight, Ticker } from './SectionChrome.jsx';

const EASE = [0.22, 1, 0.36, 1];

const TICKER = [
  'Full-stack development',
  'Backend & APIs',
  'React Native',
  'AI & Data',
  'Interfaces',
  'Integrations',
  'Systems that hold',
  'Shipped in amber',
];

/**
 * "What I build" — oversized display header over a hairline module grid.
 * Every card is a spotlight: an amber glow chases the cursor while the
 * module lights its corner, icon and scanline.
 */
export default function WhatIBuild() {
  const reduce = useReducedMotion();
  const { services } = useContent();
  const rise = reduce ? 0 : 26;

  const item = {
    hidden: { opacity: 0, y: rise },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  };

  return (
    <section
      id="what-i-build"
      aria-labelledby="what-i-build-title"
      className="relative overflow-hidden border-t border-white/5 bg-black"
    >
      {/* Amber ticker bridging the hero into the content */}
      <div className="border-b border-white/5">
        <Ticker items={TICKER} className="py-4 opacity-70" />
      </div>

      {/* Faint grid, fading out towards the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,black,transparent)]"
      />
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <SectionHead
          index="01"
          eyebrow="What I build"
          id="what-i-build-title"
          ghost="Build"
          title={
            <>
              Tools are only useful when the
              <br className="hidden md:block" /> system holds together
              <span className="text-amber-400">.</span>
            </>
          }
          blurb="End-to-end work across interface, backend, data, integrations, and the details in between."
        />

        {/* Hairline grid: shared 1px borders, spotlight inside every module */}
        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-16 grid list-none gap-px border border-white/10 bg-white/10 md:mt-24 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map(({ id, title, body, icon }) => (
            <motion.li key={title} variants={item} className="group relative h-full bg-neutral-950">
              <Spotlight className="h-full">
                <div className="relative flex min-h-72 flex-col p-7 transition-colors duration-500 group-hover:bg-[#0c0903]">
                  {/* Amber scan line along the top, lit on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent opacity-30 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  {/* Corner glow, echoing the hero's lens */}
                  <span
                    aria-hidden="true"
                    className="absolute -right-10 -bottom-10 h-28 w-28 rounded-full bg-amber-400/10 blur-3xl transition-all duration-500 group-hover:bg-amber-400/25"
                  />
                  {/* Ghost module id */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 bottom-2 font-display text-7xl font-bold text-white/[0.04] transition-colors duration-500 select-none group-hover:text-amber-400/10"
                  >
                    {id}
                  </span>

                  <div className="relative flex items-start justify-between">
                    <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-500 transition-colors duration-300 group-hover:text-amber-300">
                      {id}
                    </span>
                    <span className="grid h-10 w-10 place-items-center border border-white/10 text-neutral-500 transition-all duration-300 group-hover:border-amber-400/50 group-hover:text-amber-300 group-hover:shadow-[0_0_18px_rgba(252,211,77,0.25)]">
                      {getIcon(icon)}
                    </span>
                  </div>

                  <h3 className="relative mt-auto pt-10 font-display text-lg font-semibold tracking-tight text-neutral-100 transition-colors duration-300 group-hover:text-amber-100">
                    {title}
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-neutral-400">{body}</p>

                  <span
                    aria-hidden="true"
                    className="relative mt-6 block h-px w-full bg-white/5 after:absolute after:inset-y-0 after:left-0 after:w-0 after:bg-amber-400/70 after:transition-[width] after:duration-700 after:ease-out group-hover:after:w-full"
                  />
                </div>
              </Spotlight>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
