import { useEffect, useState } from 'react';

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // The artwork is served from a CDN, and the particle engine reads its
    // pixels on a canvas — ask for CORS mode so the bitmap stays readable.
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.src = src;
    // decode() resolves once the bitmap is ready to paint, and rejects on a broken file.
    img.decode().then(() => resolve(img), reject);
  });
}

/**
 * Preload a fixed list of image URLs.
 *
 * @param {string[]} sources  keep this list referentially stable (module constant)
 * @returns {{ status: 'loading' | 'ready' | 'error', images: HTMLImageElement[] | null }}
 */
export function useImages(sources) {
  const [state, setState] = useState({ status: 'loading', images: null });

  useEffect(() => {
    let cancelled = false;
    Promise.all(sources.map(loadImage)).then(
      (images) => !cancelled && setState({ status: 'ready', images }),
      () => !cancelled && setState({ status: 'error', images: null }),
    );
    return () => {
      cancelled = true;
    };
  }, [sources]);

  return state;
}
