/**
 * ParticleLens: the engine behind the cyborg hero.
 *
 * Two stacked <canvas> layers:
 *
 *   base       the DECAYED cyborg. Painted once (and again on resize).
 *   particles  the PRISTINE cyborg, drawn as a smooth image. The pointer acts
 *              as a "lens": a soft-edged hole opens under it and the pristine
 *              surface is blasted apart into tens of thousands of tiny
 *              particles, revealing the decayed layer beneath.
 *
 * Inside the lens radius particles are pushed away (smoothstep falloff + a
 * little swirl + random jitter). Outside it, every particle is pulled back to
 * its home by a spring while gravity and damping keep the dust feeling heavy.
 * A particle that is (almost) home is not drawn at all - the intact image
 * already shows it - so the rest state is perfectly smooth and the dust
 * melts seamlessly back into the surface.
 *
 * Implementation notes
 *   - Particle state lives in typed arrays (struct-of-arrays), not objects.
 *   - Dust pixels are written through a Uint32Array view (one store per
 *     pixel) into an offscreen canvas, then composited in a single blit.
 *   - The lens position and radius are eased, so the reveal opens, follows
 *     and closes fluidly instead of popping.
 *   - Physics advances in fixed 60 Hz ticks, so it behaves identically on
 *     60 / 120 / 144 Hz displays.
 *   - When the lens is closed and every particle has settled, the loop
 *     stops. It costs nothing while idle and restarts on pointer movement.
 */

const STEP_MS = 1000 / 60; // one physics tick
const MAX_STEPS_PER_FRAME = 3; // never try to "catch up" more than this
const SETTLE_EPSILON = 0.02; // px; under this, a particle counts as at rest
const LENS_FOLLOW = 0.35; // how quickly the hole chases the pointer (per tick)
const LENS_OPEN = 0.16; // how quickly the hole opens / closes (per tick)
const DUST_EPSILON = 1; // px away from home before a particle is drawn as dust
const TAU = Math.PI * 2;

const LITTLE_ENDIAN =
  new Uint8Array(new Uint32Array([0x0a0b0c0d]).buffer)[0] === 0x0d;

/** Tunables. */
export const DEFAULT_CONFIG = Object.freeze({
  step: 3, // px between sampled pixels -> dust density
  dot: 2, // rendered dust particle size in px
  radius: 230, // lens radius (max); shrinks on small screens, see below
  minRadius: 110,
  radiusScale: 0.34, // lens radius = clamp(min(w, h) * scale, minRadius, radius)
  repel: 8, // push strength at the centre of the lens
  swirl: 0.3, // sideways share of the push (makes the dust curl)
  jitter: 0.45, // random scatter added each tick inside the lens
  spring: 0.07, // pull towards home
  damping: 0.87, // velocity kept per tick
  gravity: 0.12, // constant downward pull
  maxSpeed: 13, // px per tick
  darkCutoff: 14, // pixels darker than this (all channels) are background
  alphaCutoff: 20,
});

/**
 * How the artwork is framed inside the hero.
 *   contain  the original framing: whole image letterboxed and centred.
 *   focus    the figure fills the screen, so it stays big on tall/narrow
 *            viewports. Identical to `contain` on 16:9 and wider screens.
 */
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export const FIT_MODES = Object.freeze({
  contain: { focus: 1, align: 'center' },
  // ~49% of the image width; scaled so the head clears the navbar by a hair.
  focus: { focus: 0.56, align: 'bottom', scale: 0.9 },
});

/**
 * Phone framing (portrait boxes narrower than PORTRAIT_MAX_ASPECT).
 * The head (anchorX/anchorY, as fractions of the artwork) is pinned to the
 * centre of the box, which is where the faded middle of the ghost "SHERANI"
 * sits. The figure is scaled so the jacket always reaches the bottom edge.
 */
export const PORTRAIT_FIT = Object.freeze({
  focus: 0.56, // same width framing as desktop; grows only if needed to reach the bottom edge
  anchorX: 0.456, // head centre in the 1600x900 artwork (x = 730)
  anchorY: 0.215, // head centre / eye line (y = 194)
  targetX: 0.5,
  targetY: 0.5,
});
export const PORTRAIT_MAX_ASPECT = 0.72;

/**
 * Where to draw an image of size (imgW x imgH) inside a (boxW x boxH) box.
 * `focus` is the central fraction of the image width that must stay visible,
 * `scale` shrinks the whole framing (re-anchored by `align` afterwards).
 * With `anchorY` set, the image point (anchorX, anchorY) lands on the box
 * point (targetX, targetY) instead, and the scale grows until the image
 * bottom reaches the box bottom.
 */
export function getFitRect(
  imgW,
  imgH,
  boxW,
  boxH,
  { focus = 1, align = 'center', scale = 1, anchorX, anchorY, targetX = 0.5, targetY = 0.5 } = {},
) {
  if (anchorY != null) {
    const s = Math.max(boxW / (imgW * focus), (boxH * (1 - targetY)) / (imgH * (1 - anchorY)));
    const w = imgW * s;
    const h = imgH * s;
    const ax = anchorX ?? 0.5;
    return {
      // keep the head centred, but never pull an image edge inside the box
      x: clamp(boxW * targetX - ax * w, boxW - w, 0),
      y: boxH * targetY - anchorY * h,
      w,
      h,
    };
  }
  const s = Math.min(boxH / imgH, boxW / (imgW * focus)) * scale;
  const w = imgW * s;
  const h = imgH * s;
  return {
    x: (boxW - w) / 2,
    y: align === 'center' ? (boxH - h) / 2 : boxH - h,
    w,
    h,
  };
}

export class ParticleLens {
  /**
   * @param {object} opts
   * @param {HTMLCanvasElement} opts.baseCanvas      receives the decayed image
   * @param {HTMLCanvasElement} opts.particleCanvas  receives the pristine image + dust
   * @param {HTMLImageElement}  opts.decayed
   * @param {HTMLImageElement}  opts.pristine
   * @param {'focus'|'contain'} [opts.fit]
   * @param {Partial<typeof DEFAULT_CONFIG>} [opts.config]
   */
  constructor({ baseCanvas, particleCanvas, decayed, pristine, fit = 'focus', config }) {
    this.baseCanvas = baseCanvas;
    this.particleCanvas = particleCanvas;
    this.baseCtx = baseCanvas.getContext('2d', { alpha: false });
    this.ctx = particleCanvas.getContext('2d');
    this.decayed = decayed;
    this.pristine = pristine;
    this.fit = FIT_MODES[fit] ?? FIT_MODES.focus;
    this.fitName = FIT_MODES[fit] ? fit : 'focus';
    this.cfg = { ...DEFAULT_CONFIG, ...config };

    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.radius = this.cfg.radius;
    this.rect = { x: 0, y: 0, w: 0, h: 0 };
    this.lens = { x: -9999, y: -9999, active: false }; // pointer target
    this.lensX = -9999; // eased position
    this.lensY = -9999;
    this.lensR = 0; // eased radius (0 = closed)

    this.count = 0;
    this.dust = null; // offscreen canvas for the displaced particles
    this.pixels = null;

    this.raf = 0;
    this.lastTime = 0;
    this.accumulator = 0;
    this.settled = true;
    this.destroyed = false;
  }

  /* ------------------------------------------------------------------ *
   * Public API
   * ------------------------------------------------------------------ */

  /** (Re)build both layers for a new size / pixel ratio. */
  resize(width, height, dpr = 1) {
    width = Math.round(width);
    height = Math.round(height);
    if (this.destroyed || width < 2 || height < 2) return;
    if (width === this.width && height === this.height && dpr === this.dpr) return;

    this.width = width;
    this.height = height;
    this.dpr = dpr;
    this.radius = clamp(
      Math.min(width, height) * this.cfg.radiusScale,
      this.cfg.minRadius,
      this.cfg.radius,
    );

    this.rect = getFitRect(
      this.pristine.naturalWidth,
      this.pristine.naturalHeight,
      width,
      height,
      // Phones: pin the head to the faded middle of the ghost surname.
      this.fitName === 'focus' && width / height < PORTRAIT_MAX_ASPECT ? PORTRAIT_FIT : this.fit,
    );

    this.#paintBase(this.rect);
    this.#buildParticles(this.rect);
    this.#snapToRest();
    this.#render();
    this.settled = true;
    // A lens that is already over the hero keeps working through a resize.
    if (this.lens.active) this.wake();
  }

  /** Move / toggle the lens. Coordinates are CSS px relative to the hero. */
  setLens(x, y, active) {
    const wasActive = this.lens.active;
    this.lens.x = x;
    this.lens.y = y;
    this.lens.active = active;
    if (!wasActive && !active) return;
    // First contact: open the hole at the pointer, not at the old spot.
    if (active && !wasActive && this.lensR < 1) {
      this.lensX = x;
      this.lensY = y;
    }
    this.wake();
  }

  /** Switch the lens off but remember where it was. */
  releaseLens() {
    this.setLens(this.lens.x, this.lens.y, false);
  }

  /** Make sure the simulation loop is running. */
  wake() {
    if (this.destroyed || !this.count) return;
    this.settled = false;
    if (!this.raf) {
      this.lastTime = performance.now();
      this.accumulator = 0;
      this.raf = requestAnimationFrame(this.#tick);
    }
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  /* ------------------------------------------------------------------ *
   * Layers
   * ------------------------------------------------------------------ */

  /** Static layer: the decayed cyborg at full device resolution. */
  #paintBase(rect) {
    const { baseCanvas, baseCtx: ctx, dpr, width, height } = this;
    baseCanvas.width = Math.round(width * dpr);
    baseCanvas.height = Math.round(height * dpr);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, baseCanvas.width, baseCanvas.height);
    ctx.drawImage(this.decayed, rect.x * dpr, rect.y * dpr, rect.w * dpr, rect.h * dpr);
  }

  /**
   * Dynamic layer: sample the pristine image on a regular lattice and keep
   * every pixel that isn't (near-)black background. Those become the dust;
   * the intact image itself is drawn every frame in #render.
   */
  #buildParticles(rect) {
    const { width, height, cfg } = this;
    const { step, darkCutoff, alphaCutoff } = cfg;

    // One canvas CSS pixel per lattice pixel; the browser smooths any upscale.
    this.particleCanvas.width = width;
    this.particleCanvas.height = height;

    const scratch = document.createElement('canvas');
    scratch.width = width;
    scratch.height = height;
    const sctx = scratch.getContext('2d', { willReadFrequently: true });
    sctx.drawImage(this.pristine, rect.x, rect.y, rect.w, rect.h);
    const { data } = sctx.getImageData(0, 0, width, height);

    // Only visit lattice points the artwork can actually cover.
    const x0 = Math.max(0, Math.floor(rect.x / step) * step);
    const y0 = Math.max(0, Math.floor(rect.y / step) * step);
    const x1 = Math.min(width, Math.ceil((rect.x + rect.w) / step) * step);
    const y1 = Math.min(height, Math.ceil((rect.y + rect.h) / step) * step);

    const isParticle = (i) =>
      data[i + 3] >= alphaCutoff &&
      (data[i] >= darkCutoff || data[i + 1] >= darkCutoff || data[i + 2] >= darkCutoff);

    let count = 0;
    for (let y = y0; y < y1; y += step) {
      for (let x = x0; x < x1; x += step) {
        if (isParticle((y * width + x) * 4)) count++;
      }
    }

    this.count = count;
    this.hx = new Float32Array(count); // home position
    this.hy = new Float32Array(count);
    this.px = new Float32Array(count); // current position
    this.py = new Float32Array(count);
    this.vx = new Float32Array(count); // velocity
    this.vy = new Float32Array(count);
    this.color = new Uint32Array(count); // packed RGBA, ready to blit

    let n = 0;
    for (let y = y0; y < y1; y += step) {
      for (let x = x0; x < x1; x += step) {
        const i = (y * width + x) * 4;
        if (!isParticle(i)) continue;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        this.hx[n] = x;
        this.hy[n] = y;
        this.color[n] = LITTLE_ENDIAN
          ? ((a << 24) | (b << 16) | (g << 8) | r) >>> 0
          : ((r << 24) | (g << 16) | (b << 8) | a) >>> 0;
        n++
      }
    }

    // Dust is composed onto the intact image, so it needs its own canvas
    // (putImageData would punch transparent squares through the image).
    this.dust = document.createElement('canvas');
    this.dust.width = width;
    this.dust.height = height;
    this.dustCtx = this.dust.getContext('2d');
    this.imageData = new ImageData(width, height);
    this.pixels = new Uint32Array(this.imageData.data.buffer);
  }

  /* ------------------------------------------------------------------ *
   * Simulation
   * ------------------------------------------------------------------ */

  /**
   * Where a particle comes to rest: its home, sagging by gravity / spring px
   * (the spring balances gravity there). Starting at that equilibrium means
   * the hero doesn't twitch on load.
   */
  #snapToRest() {
    const sag = this.cfg.gravity / this.cfg.spring;
    for (let i = 0; i < this.count; i++) {
      this.px[i] = this.hx[i];
      this.py[i] = this.hy[i] + sag;
      this.vx[i] = 0;
      this.vy[i] = 0;
    }
  }

  #tick = (now) => {
    this.raf = 0;
    if (this.destroyed) return;

    let dt = now - this.lastTime;
    this.lastTime = now;
    if (dt < 0 || dt > 250) dt = STEP_MS; // tab was hidden, clock hiccup
    this.accumulator = Math.min(this.accumulator + dt, STEP_MS * MAX_STEPS_PER_FRAME);

    // 0.9 tolerance so a 16.5 ms frame on a 60 Hz display never skips a tick.
    let steps = 0;
    while (this.accumulator >= STEP_MS * 0.9 && steps < MAX_STEPS_PER_FRAME) {
      this.#step();
      this.accumulator -= STEP_MS;
      steps++
    }

    if (this.settled) {
      // Lens is closed and nothing is moving: draw the exact rest state, then sleep.
      this.#snapToRest();
      this.#render();
      return;
    }
    if (steps > 0) this.#render();
    this.raf = requestAnimationFrame(this.#tick);
  };

  /** One 60 Hz physics tick. */
  #step() {
    const { px, py, vx, vy, hx, hy, count, cfg, lens } = this;
    const { repel, swirl, jitter, spring, damping, gravity, maxSpeed } = cfg;

    // Ease the hole towards the pointer and towards open / closed.
    this.lensX += (lens.x - this.lensX) * LENS_FOLLOW;
    this.lensY += (lens.y - this.lensY) * LENS_FOLLOW;
    this.lensR += ((lens.active ? this.radius : 0) - this.lensR) * LENS_OPEN;

    const active = lens.active && this.lensR > 1;
    const lx = this.lensX;
    const ly = this.lensY;
    const radius = this.lensR;
    const radiusSq = radius * radius;
    const maxSpeedSq = maxSpeed * maxSpeed;
    const sag = gravity / spring;
    let worst = 0;

    for (let i = 0; i < count; i++) {
      let x = px[i];
      let y = py[i];
      let u = vx[i];
      let v = vy[i];

      const dx = x - lx;
      const dy = y - ly;
      const distSq = dx * dx + dy * dy;

      if (active && distSq < radiusSq) {
        // Inside the lens: radial push (smoothstep falloff), sideways swirl, jitter.
        const dist = Math.sqrt(distSq) || 0.001;
        const t = 1 - dist / radius;
        const force = t * t * (3 - 2 * t) * repel;
        const nx = dx / dist;
        const ny = dy / dist;
        u += nx * force - ny * force * swirl + (Math.random() - 0.5) * jitter;
        v += ny * force + nx * force * swirl + (Math.random() - 0.5) * jitter;
      } else {
        // Outside: spring back home.
        u += (hx[i] - x) * spring;
        v += (hy[i] - y) * spring;
      }

      v += gravity;
      u *= damping;
      v *= damping;

      const speedSq = u * u + v * v;
      if (speedSq > maxSpeedSq) {
        const k = maxSpeed / Math.sqrt(speedSq);
        u *= k;
        v *= k;
      }

      x += u;
      y += v;
      px[i] = x;
      py[i] = y;
      vx[i] = u;
      vy[i] = v;

      if (!lens.active) {
        const err = Math.abs(x - hx[i]) + Math.abs(y - hy[i] - sag) + Math.abs(u) + Math.abs(v);
        if (err > worst) worst = err;
      }
    }

    if (!lens.active && worst < SETTLE_EPSILON && this.lensR < 0.5) this.settled = true;
  }

  /* ------------------------------------------------------------------ *
   * Rendering
   * ------------------------------------------------------------------ */

  /** Intact pristine image, minus the soft lens hole, plus the dust on top. */
  #render() {
    const { ctx, dust, width, height } = this;
    if (!dust) return;
    const r = this.rect;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(this.pristine, r.x, r.y, r.w, r.h);

    if (this.lensR > 0.75) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      const g = ctx.createRadialGradient(
        this.lensX, this.lensY, this.lensR * 0.62,
        this.lensX, this.lensY, this.lensR,
      );
      g.addColorStop(0, 'rgba(0,0,0,1)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.lensX, this.lensY, this.lensR, 0, TAU);
      ctx.fill();
      ctx.restore();
    }

    this.#renderDust();
    if (dust) ctx.drawImage(dust, 0, 0);
  }

  /** Blit every displaced particle as a dot x dot block, one upload. */
  #renderDust() {
    const { px, py, hx, hy, vx, vy, color, count, pixels, width, height, cfg } = this;
    const dot = this.cfg.dot;
    const maxX = width - dot;
    const maxY = height - dot;
    const dustSq = DUST_EPSILON * DUST_EPSILON;
    const restY = cfg.gravity / cfg.spring; // equilibrium sag below home

    pixels.fill(0);

    for (let i = 0; i < count; i++) {
      const ox = px[i] - hx[i];
      const oy = py[i] - hy[i] - restY;
      const speedSq = vx[i] * vx[i] + vy[i] * vy[i];
      // At its rest spot the intact image already shows the particle: draw nothing.
      if (ox * ox + oy * oy <= dustSq && speedSq <= 1) continue;

      const sx = (px[i] + 0.5) | 0;
      const sy = (py[i] + 0.5) | 0;
      const c = color[i];

      if (sx >= 0 && sy >= 0 && sx <= maxX && sy <= maxY) {
        // Fast path: the whole block is on screen.
        let o = sy * width + sx;
        for (let j = 0; j < dot; j++, o += width) {
          for (let k = 0; k < dot; k++) pixels[o + k] = c;
        }
      } else {
        // Edge path: clip per pixel.
        for (let j = 0; j < dot; j++) {
          const yy = sy + j;
          if (yy < 0 || yy >= height) continue;
          for (let k = 0; k < dot; k++) {
            const xx = sx + k;
            if (xx >= 0 && xx < width) pixels[yy * width + xx] = c;
          }
        }
      }
    }

    this.dustCtx.putImageData(this.imageData, 0, 0);
  }
}
