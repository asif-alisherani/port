import { motion } from 'motion/react';

/**
 * Full-bleed black curtain with a single pulsing amber dot.
 * Rendered inside <AnimatePresence>, so it fades out instead of vanishing.
 */
export default function Loader({ failed = false }) {
  return (
    <motion.div
      role="status"
      className="absolute inset-0 z-50 flex items-center justify-center bg-black"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {failed ? (
        <p className="font-mono text-[10px] tracking-[0.38em] text-amber-400/50 uppercase">
          Signal lost. Reload to retry
        </p>
      ) : (
        <>
          <div className="h-2 w-2 animate-pulse rounded-full bg-amber-400/60" />
          <span className="sr-only">Loading</span>
        </>
      )}
    </motion.div>
  );
}
