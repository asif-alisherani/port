import { useEffect, useState } from 'react';

const read = () => window.location.hash.replace(/^#\/?/, '');

/**
 * Minimal hash router. Returns the current `#/project/<slug>` or
 * `#/quest/<slug>` match, so detail pages are shareable, bookmarkable and
 * work with the back button.
 */
export function useDetailRoute() {
  const [hash, setHash] = useState(read);

  useEffect(() => {
    const onChange = () => setHash(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const match = /^(project|quest)\/([\w-]+)$/.exec(hash);
  return match ? { kind: match[1], slug: match[2] } : null;
}

export function openDetail(kind, slug) {
  window.location.hash = `/${kind}/${slug}`;
}

export const openProject = (slug) => openDetail('project', slug);
export const openQuest = (slug) => openDetail('quest', slug);

export function closeDetail() {
  // Prefer going back so the browser history stays clean.
  if (window.history.length > 1) window.history.back();
  else window.location.hash = '';
}
