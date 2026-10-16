import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { sendContact } from '../lib/api.js';
import { CONTACT_FORM_EVENT } from '../lib/contactForm.js';
import { CornerTicks } from './SectionChrome.jsx';

const EASE = [0.22, 1, 0.36, 1];
const ADDRESS = 'sheranil.asifa@gmail.com';

const FIELDS = [
  {
    id: 'name',
    index: '01',
    label: 'Your name',
    type: 'text',
    placeholder: 'Ada Lovelace',
    autoComplete: 'name',
  },
  {
    id: 'email',
    index: '02',
    label: 'Email',
    type: 'email',
    placeholder: 'ada@analytical.engine',
    autoComplete: 'email',
  },
  {
    id: 'message',
    index: '03',
    label: 'Message',
    type: 'textarea',
    rows: 5,
    placeholder: 'The idea, the deadline, the budget — whatever you have so far.',
  },
];

const inputClass =
  'w-full border border-white/10 bg-black px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-700 outline-none transition-all duration-300 focus:border-amber-400/70 focus:bg-[#0c0903] focus:shadow-[0_0_0_1px_rgba(252,211,77,0.25),0_0_24px_rgba(252,211,77,0.08)]';

/**
 * The transmission panel: opens from "Say hello" (navbar) or the contact
 * button. Fields compose a pre-addressed draft in the visitor's mail client,
 * so it works with no backend at all.
 */
export default function ContactForm() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [viaMail, setViaMail] = useState(false);
  const [errors, setErrors] = useState({});

  // Open requests from anywhere in the app.
  useEffect(() => {
    const onOpen = () => {
      setSent(false);
      setErrors({});
      setViaMail(false);
      setOpen(true);
    };
    window.addEventListener(CONTACT_FORM_EVENT, onOpen);
    return () => window.removeEventListener(CONTACT_FORM_EVENT, onOpen);
  }, []);

  // Esc closes; body scroll locks while the channel is open.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      message: String(data.get('message') || '').trim(),
      company: String(data.get('company') || ''), // honeypot
    };

    setBusy(true);
    setErrors({});
    const result = await sendContact(payload);
    setBusy(false);

    if (result.ok) {
      setViaMail(false);
      setSent(true);
      return;
    }

    if (result.errors) {
      setErrors(result.errors);
      return;
    }

    // No backend reachable — fall back to an addressed mail draft.
    const subject = encodeURIComponent(`Contact from ${payload.name} — portfolio`);
    const body = encodeURIComponent(`${payload.message}\n\n— ${payload.name} (${payload.email})`);
    window.location.href = `mailto:${ADDRESS}?subject=${subject}&body=${body}`;
    setViaMail(true);
    setSent(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          {/* Backdrop */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Panel */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Contact form"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 36, scale: 0.98 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="pointer-events-auto relative w-full max-w-lg border border-white/15 bg-neutral-950 shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
            >
              <CornerTicks />

              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-amber-400/90 uppercase">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                  </span>
                  Open channel // 06
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close contact form"
                  className="group flex items-center gap-2 font-mono text-[9px] tracking-[0.25em] text-neutral-500 uppercase transition-colors duration-300 hover:text-amber-300"
                >
                  Esc
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" className="h-4 w-4">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <div className="relative p-6 md:p-8">
                {/* Scanlines */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[repeating-linear-gradient(to_bottom,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_3px)]"
                />

                {!sent ? (
                  <>
                    <h2 className="relative font-display text-3xl font-semibold tracking-tight text-neutral-100">
                      Start a transmission<span className="text-amber-400">.</span>
                    </h2>
                    <p className="relative mt-2 text-sm leading-relaxed text-neutral-400">
                      Three fields. Straight to my inbox, no middleman.
                    </p>

                    <form onSubmit={onSubmit} className="relative mt-7 space-y-5">
                      {FIELDS.map(({ id, index, label, type, placeholder, rows, autoComplete }, i) => (
                        <div key={id}>
                          <label htmlFor={`cf-${id}`} className="flex items-baseline justify-between font-mono text-[10px] tracking-[0.3em] text-neutral-500 uppercase">
                            <span className="flex items-baseline gap-2">
                              <span className="text-amber-400/70">{index}</span>
                              {label}
                            </span>
                            <span className="text-[9px] text-neutral-700">REQUIRED</span>
                          </label>
                          {type === 'textarea' ? (
                            <textarea
                              id={`cf-${id}`}
                              name={id}
                              rows={rows}
                              required
                              autoFocus={i === 0}
                              placeholder={placeholder}
                              className={`${inputClass} mt-2 resize-none`}
                            />
                          ) : (
                            <input
                              id={`cf-${id}`}
                              name={id}
                              type={type}
                              required
                              autoFocus={i === 0}
                              autoComplete={autoComplete}
                              placeholder={placeholder}
                              className={`${inputClass} mt-2`}
                            />
                          )}
                          {errors[id] && (
                            <p className="mt-1.5 font-mono text-[10px] tracking-[0.1em] text-red-400">
                              {errors[id][0]}
                            </p>
                          )}
                        </div>
                      ))}

                      {/* Honeypot — hidden from humans, catnip for bots */}
                      <input
                        type="text"
                        name="company"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="absolute left-[-9999px] h-0 w-0 opacity-0"
                      />

                      <button
                        type="submit"
                        disabled={busy}
                        className="group relative flex w-full items-center justify-center gap-3 overflow-hidden bg-amber-400 px-6 py-3.5 font-mono text-[11px] font-medium tracking-[0.3em] text-black uppercase transition-all duration-300 hover:bg-amber-300 hover:shadow-[0_0_30px_rgba(252,211,77,0.45)] disabled:cursor-wait disabled:opacity-60"
                      >
                        {busy ? 'Transmitting…' : 'Transmit message'}
                        {!busy && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                            <path d="M7 17 17 7" />
                            <path d="M7 7h10v10" />
                          </svg>
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="relative py-6 text-center">
                    <motion.span
                      initial={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                      animate={reduce ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 160, damping: 14 }}
                      className="mx-auto grid h-14 w-14 place-items-center border border-amber-400/50 bg-amber-400/10 text-amber-300 shadow-[0_0_30px_rgba(252,211,77,0.25)]"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </motion.span>
                    <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-neutral-100">
                      {viaMail ? 'Draft ready' : 'Message received'}
                      <span className="text-amber-400">.</span>
                    </h2>
                    <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neutral-400">
                      {viaMail
                        ? 'Your mail client just opened an addressed draft — hit send there and it lands straight in my inbox.'
                        : 'Transmission logged. I read everything and usually reply within a day or two.'}
                    </p>
                    <p className="mt-4 font-mono text-[10px] tracking-[0.25em] text-amber-400/80 uppercase">{ADDRESS}</p>
                    <div className="mt-7 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSent(false)}
                        className="border border-white/15 px-5 py-2.5 font-mono text-[10px] tracking-[0.25em] text-neutral-300 uppercase transition-all duration-300 hover:border-amber-400/60 hover:text-amber-300"
                      >
                        Write another
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="bg-amber-400 px-5 py-2.5 font-mono text-[10px] font-medium tracking-[0.25em] text-black uppercase transition-all duration-300 hover:bg-amber-300"
                      >
                        Close channel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {!sent && (
                <div className="flex items-center justify-between border-t border-white/10 px-6 py-3.5">
                  <span className="font-mono text-[9px] tracking-[0.25em] text-neutral-600 uppercase">
                    Direct: {ADDRESS}
                  </span>
                  <span className="hidden font-mono text-[9px] tracking-[0.25em] text-neutral-700 uppercase sm:block">
                    Encrypted in transit
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
