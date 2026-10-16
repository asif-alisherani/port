/**
 * Decorative, non-interactive layers that sit on top of the artwork:
 * a vignette, faint scanlines and a faint 44 px grid.
 */
export default function FilmOverlays() {
  return (
    <>
      {/* Vignette. Sized in container-query units, so it scales with the hero rather than the window. */}
      <div aria-hidden="true" className="@container pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_74cqw_at_50%_50%,transparent_18cqw,rgba(0,0,0,0.62)_74cqw)]" />
      </div>

      {/* Scanlines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.028] bg-[repeating-linear-gradient(to_bottom,transparent,transparent_2px,rgba(255,255,255,0.07)_2px,rgba(255,255,255,0.07)_4px)]"
      />

      {/* Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.04] bg-[linear-gradient(to_right,rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:44px_44px]"
      />
    </>
  );
}
