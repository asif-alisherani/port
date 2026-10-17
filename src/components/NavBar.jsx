import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { openContactForm } from '../lib/contactForm.js';

const EASE = [0.22, 1, 0.36, 1];
const EMAIL = 'sherani.asifali@gmail.com';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
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

  // Mobile menu: close on Escape, on a tap outside, and when the layout reaches desktop.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    const onDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenuOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onBreakpoint = () => desktop.matches && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    desktop.addEventListener('change', onBreakpoint);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
      desktop.removeEventListener('change', onBreakpoint);
    };
  }, [menuOpen]);

  return (
    <motion.header
      initial={{ y: -96, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.15, duration: 0.9, ease: EASE }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-5"
    >
      <nav
        ref={navRef}
        aria-label="Primary"
        className={`relative flex w-full max-w-5xl items-center justify-between gap-4 border px-3 py-2.5 backdrop-blur-xl transition-all duration-500 sm:px-4 ${
          scrolled || menuOpen
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

        <div className="flex items-center gap-2">
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

        {/* Mobile / tablet: menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className={`relative flex h-[34px] w-[34px] items-center justify-center border transition-colors duration-300 lg:hidden ${
            menuOpen
              ? 'border-amber-400/70 bg-amber-400/10 text-amber-300'
              : 'border-white/15 text-neutral-200 hover:border-amber-400/50 hover:text-amber-200'
          }`}
        >
          <span aria-hidden="true" className="relative block h-3 w-4">
            <span
              className={`absolute left-0 h-px w-4 bg-current transition-all duration-300 ${
                menuOpen ? 'top-1/2 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute top-1/2 right-0 h-px bg-current transition-all duration-300 ${
                menuOpen ? 'w-0 opacity-0' : 'w-2.5 opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 h-px w-4 bg-current transition-all duration-300 ${
                menuOpen ? 'top-1/2 -rotate-45' : 'top-full'
              }`}
            />
          </span>
        </button>
        </div>

        {/* Page progress, along the pill's lower edge */}
        <motion.span
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="absolute -bottom-px left-0 h-px w-full origin-left bg-gradient-to-r from-amber-300 via-amber-400/90 to-amber-400/40 shadow-[0_0_8px_rgba(252,211,77,0.5)]"
        />

        {/* Mobile / tablet dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              key="mobile-menu"
              initial={{ opacity: 0, y: -10, clipPath: 'inset(0 0 100% 0)' }}
              animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
              exit={{ opacity: 0, y: -8, clipPath: 'inset(0 0 100% 0)' }}
              transition={{ duration: 0.45, ease: EASE }}
              className="absolute inset-x-0 top-[calc(100%+0.5rem)] overflow-hidden border border-white/10 bg-neutral-950/[0.98] shadow-[0_24px_60px_rgba(0,0,0,0.75)] backdrop-blur-xl lg:hidden"
            >
              {/* HUD header */}
              <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5 font-mono text-[9px] tracking-[0.35em] text-neutral-500 uppercase">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400 shadow-[0_0_8px_rgba(252,211,77,0.8)]" />
                  Navigate
                </span>
                <span>{String(LINKS.length).padStart(2, '0')} sections</span>
              </div>

              <ul className="py-1">
                {LINKS.map(({ label, href, id }, i) => {
                  const active = activeId === id;
                  return (
                    <motion.li
                      key={href}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.05, duration: 0.45, ease: EASE }}
                    >
                      <a
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={active ? 'true' : undefined}
                        className={`group relative flex items-center gap-4 px-4 py-3 transition-colors duration-300 ${
                          active ? 'bg-amber-400/[0.06]' : 'hover:bg-white/[0.03] active:bg-white/[0.05]'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute inset-y-2 left-0 w-0.5 transition-colors duration-300 ${
                            active ? 'bg-amber-400' : 'bg-transparent group-hover:bg-amber-400/40'
                          }`}
                        />
                        <span className={`font-mono text-[10px] tracking-[0.2em] ${active ? 'text-amber-400' : 'text-neutral-600'}`}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`flex-1 font-anton text-[26px] leading-none tracking-[0.04em] uppercase transition-colors duration-300 ${
                            active ? 'text-amber-300' : 'text-neutral-100 group-hover:text-amber-200'
                          }`}
                        >
                          {label}
                        </span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          className={`h-4 w-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                            active ? 'text-amber-400' : 'text-neutral-600 group-hover:text-amber-300'
                          }`}
                        >
                          <path d="M7 17 17 7" />
                          <path d="M7 7h10v10" />
                        </svg>
                      </a>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Contact strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] px-4 py-3.5">
                <a
                  href={`mailto:${EMAIL}`}
                  className="min-w-0 truncate font-mono text-[10px] tracking-[0.08em] text-neutral-400 transition-colors hover:text-amber-200"
                >
                  {EMAIL}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    openContactForm();
                  }}
                  className="inline-flex items-center gap-2 border border-amber-400/60 px-3 py-1.5 font-mono text-[9px] tracking-[0.25em] text-amber-300 uppercase transition-colors hover:bg-amber-400 hover:text-black"
                >
                  Start a project
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
