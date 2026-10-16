import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { ParticleLens } from '../lib/particleEngine.js';

const POINTER_EVENTS = [
  'pointerenter',
  'pointermove',
  'pointerdown',
  'pointerup',
  'pointercancel',
  'pointerleave',
];

/**
 * The interactive artwork: a static "decayed" canvas with a particle canvas
 * of the "pristine" cyborg on top. A ParticleLens drives the particles.
 *
 * Pointer input is read from `target` (usually the whole hero section) so the
 * lens keeps working underneath any content layered above the canvases.
 *
 * @param {object}  props
 * @param {HTMLImageElement} props.decayed
 * @param {HTMLImageElement} props.pristine
 * @param {React.RefObject<HTMLElement>} [props.target]  element that receives pointer events
 * @param {'focus'|'contain'} [props.fit]
 * @param {Partial<import('../lib/particleEngine.js').DEFAULT_CONFIG>} [props.config]
 */
export default function ParticleField({ decayed, pristine, target, fit = 'focus', config }) {
  const hostRef = useRef(null);
  const baseRef = useRef(null);
  const particlesRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const configKey = JSON.stringify(config ?? {});

  useEffect(() => {
    const host = hostRef.current;
    const eventTarget = target?.current ?? host;

    // Reduced motion: keep the reveal, drop the boiling jitter and the swirl.
    const calm = reduceMotion ? { jitter: 0, swirl: 0 } : null;
    const engine = new ParticleLens({
      baseCanvas: baseRef.current,
      particleCanvas: particlesRef.current,
      decayed,
      pristine,
      fit,
      config: { ...JSON.parse(configKey), ...calm },
    });

    // ---- sizing -----------------------------------------------------------
    const sync = () => engine.resize(host.clientWidth, host.clientHeight, window.devicePixelRatio || 1);
    sync();

    // Rebuilding ~50k particles per resize event would jank window drags, so settle first.
    let timer = 0;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(sync, 120);
    };
    const observer = new ResizeObserver(onResize);
    observer.observe(host);
    window.addEventListener('resize', onResize);

    // ---- pointer -> lens --------------------------------------------------
    const onPointer = (e) => {
      const rect = host.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const touch = e.pointerType === 'touch';

      switch (e.type) {
        case 'pointerdown':
          engine.setLens(x, y, true);
          break;
        case 'pointerenter':
        case 'pointermove':
          // Mouse & pen hover. A finger only counts while it is touching.
          if (!touch || e.buttons) engine.setLens(x, y, true);
          break;
        case 'pointerup':
          if (touch) engine.releaseLens();
          break;
        default: // pointercancel, pointerleave
          engine.releaseLens();
      }
    };
    POINTER_EVENTS.forEach((type) => eventTarget.addEventListener(type, onPointer, { passive: true }));

    return () => {
      POINTER_EVENTS.forEach((type) => eventTarget.removeEventListener(type, onPointer));
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      clearTimeout(timer);
      engine.destroy();
    };
  }, [decayed, pristine, target, fit, configKey, reduceMotion]);

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label="A cyborg in a bright yellow leather jacket. Moving the pointer over it blasts the surface away to reveal a rusted, decayed machine underneath."
      className="absolute inset-0"
    >
      <canvas ref={baseRef} className="absolute inset-0 block h-full w-full" />
      <canvas ref={particlesRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
