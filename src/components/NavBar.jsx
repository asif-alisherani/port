import { useEffect, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { openContactForm } from '../lib/contactForm.js';

const EASE = [0.22, 1, 0.36, 1];

const LINKS = [
  { label: 'Build', href: '#what-i-build', id: 'what-i-build' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Tech', href: '#tech-universe', id: 'tech-universe' },
  { label: 'Brief', href: '#beyond-the-brief', id: 'beyond-the-brief' },
];

/**
 * Floating HUD navbar: a glass pill that descends once the hero is ready,
 * lights the section you're inside, tracks page progress under its lower
 * edge, and turns solid as soon as you leave the hero.
 */
export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('');
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 48));

  // Scroll-spy: mark whichever section occupies the middle of the viewport.
  useEffect(() => {
    const sections = LINKS.map(({ id }) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-42% 0px -42% 0px' },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -96, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.15, duration: 0.9, ease: EASE }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-5"
    >
      <nav
        aria-label="Primary"
        className={`relative flex w-full max-w-5xl items-center justify-between gap-4 border px-3 py-2.5 backdrop-blur-xl transition-all duration-500 sm:px-4 ${
          scrolled
            ? 'border-white/10 bg-black/60 shadow-[0_14px_44px_rgba(0,0,0,0.65)]'
            : 'border-white/[0.06] bg-black/25'
        }`}
      >
        {/* Wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="Back to top"
          className="group flex items-center gap-2.5"
        >
          <svg viewBox="0 0 32 32" aria-hidden="true" className="h-5 w-5">
            <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(252,211,77,0.55)" strokeWidth="2" />
            <circle cx="16" cy="16" r="5" fill="#fcd34d" />
          </svg>
          <span className="font-mono text-[11px] font-medium tracking-[0.35em] text-neutral-100 transition-colors duration-300 group-hover:text-amber-200">
            ASA<span className="text-amber-400">.</span>
          </span>
        </a>

        {/* Section links */}
        <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
          {LINKS.map(({ label, href, id }) => {
            const active = activeId === id;
            return (
              <li key={href}>
                <a
                  href={href}
                  aria-current={active ? 'true' : undefined}
                  className={`group relative py-1 font-mono text-[10px] tracking-[0.25em] uppercase transition-colors duration-300 ${
                    active ? 'text-amber-300' : 'text-neutral-400 hover:text-neutral-100'
                  }`}
                >
                  {label}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 left-0 h-px bg-amber-400 transition-all duration-400 ${
                      active ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-60'
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* CTA: opens the contact form */}
        <button
          type="button"
          onClick={openContactForm}
          className="group relative inline-flex items-center gap-2 overflow-hidden bg-amber-400 px-3.5 py-2 font-mono text-[10px] font-medium tracking-[0.25em] text-black uppercase transition-all duration-300 hover:bg-amber-300 hover:shadow-[0_0_22px_rgba(252,211,77,0.45)] sm:px-4"
        >
          <span className="relative z-10">Say hello</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="relative z-10 h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          >
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </button>

        {/* Page progress, along the pill's lower edge */}
        <motion.span
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="absolute -bottom-px left-0 h-px w-full origin-left bg-gradient-to-r from-amber-300 via-amber-400/90 to-amber-400/40 shadow-[0_0_8px_rgba(252,211,77,0.5)]"
        />
      </nav>
    </motion.header>
  );
}
