import { motion, useReducedMotion } from 'motion/react';
import { useContent } from '../context/ContentContext.jsx';
import { SectionHead } from './SectionChrome.jsx';
import { openContactForm } from '../lib/contactForm.js';

const EASE = [0.22, 1, 0.36, 1];

const NAV = [
  { index: '01', label: 'What I build', href: '#what-i-build' },
  { index: '02', label: 'Projects', href: '#projects' },
  { index: '03', label: 'Experience', href: '#experience' },
  { index: '04', label: 'Tech universe', href: '#tech-universe' },
  { index: '05', label: 'Side quests', href: '#beyond-the-brief' },
];

/**
 * "Say hello" — the closing transmission: a massive editorial statement, the
 * contact form trigger, the email line, and a footer with a working index.
 */
export default function Contact() {
  const reduce = useReducedMotion();
  const { socialLinks: LINKS } = useContent();
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
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden border-t border-white/5 bg-black pt-24 md:pt-32"
    >
      {/* Faint grid, fading towards the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,black,transparent)]"
      />
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" />

      {/* Horizon glow closing the page */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 left-1/2 h-[22rem] w-[62rem] -translate-x-1/2 rounded-full bg-amber-400/10 blur-[130px]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
        <SectionHead
          index="06"
          eyebrow="Say hello"
          id="contact-title"
          ghost="Hello"
          title={
            <>
              Have a product, platform,
              <br className="hidden md:block" /> or API idea?
            </>
          }
          blurb="Let’s connect the missing parts and make something useful."
        />

        {/* Contact form trigger */}
        <motion.div
          initial={{ opacity: 0, y: rise }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="relative mt-10"
        >
          <button
            type="button"
            onClick={openContactForm}
            className="group inline-flex items-center gap-3 bg-amber-400 px-6 py-3.5 font-mono text-[11px] font-medium tracking-[0.3em] text-black uppercase transition-all duration-300 hover:bg-amber-300 hover:shadow-[0_0_32px_rgba(252,211,77,0.45)]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            Open contact form
            <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black/50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-black/70" />
            </span>
          </button>
        </motion.div>

        {/* Email + links */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="relative mt-16 flex flex-col gap-10 border-t border-white/10 pt-12 md:mt-20 md:flex-row md:items-end md:justify-between"
        >
          <motion.div variants={item} className="flex flex-col items-start gap-6">
            <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-neutral-500 uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
              </span>
              Transmission open
            </p>
            <a
              href="mailto:sherani.asifali@gmail.com"
              className="group inline-flex items-center gap-4 font-display text-2xl font-semibold tracking-tight text-neutral-200 transition-colors duration-300 hover:text-amber-200 md:text-4xl"
            >
              <span className="relative">
                sherani.asifali@gmail.com
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-2 h-px origin-left scale-x-100 bg-neutral-700 transition-colors duration-300 group-hover:bg-amber-400"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-2 h-px origin-left scale-x-0 bg-amber-400 transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
              </span>
              <span className="grid h-11 w-11 shrink-0 place-items-center border border-neutral-700 transition-all duration-300 group-hover:border-amber-400 group-hover:bg-amber-400 group-hover:text-black md:h-13 md:w-13">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                >
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </span>
            </a>
          </motion.div>

          <motion.ul variants={item} className="flex flex-wrap gap-3">
            {LINKS.filter(({ href }) => href && href !== '#').map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 border border-white/15 px-4 py-2.5 font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase transition-all duration-300 hover:border-amber-400/60 hover:text-amber-300 hover:shadow-[0_0_20px_rgba(252,211,77,0.15)]"
                >
                  {label}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  >
                    <path d="M7 17 17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </a>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Footer bar */}
        <div className="relative mt-20 flex flex-col items-start justify-between gap-6 border-t border-white/5 py-7 md:mt-28 md:flex-row md:items-center">
          <p className="font-mono text-[10px] tracking-[0.25em] text-neutral-600 uppercase">
            © 2026 — assembled in the dark, shipped in amber
          </p>

          <nav aria-label="Site index" className="hidden items-center gap-5 md:flex">
            {NAV.map(({ index, label, href }) => (
              <a
                key={index}
                href={href}
                className="group flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] text-neutral-600 uppercase transition-colors duration-300 hover:text-amber-300"
              >
                <span className="text-amber-400/50">{index}</span>
                {label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
            className="group inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-neutral-500 uppercase transition-colors duration-300 hover:text-amber-300"
          >
            Back to top
            <span className="grid h-7 w-7 place-items-center border border-white/10 transition-all duration-300 group-hover:border-amber-400/60 group-hover:shadow-[0_0_14px_rgba(252,211,77,0.2)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5"
                aria-hidden="true"
              >
                <path d="M12 19V5" />
                <path d="m5 12 7-7 7 7" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
