import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchContent, hasApi } from '../lib/api.js';
import { PROJECTS } from '../data/projects.js';
import { QUESTS } from '../data/sideQuests.js';
import { SERVICES, SOCIAL_LINKS, TECH_DOMAINS } from '../data/siteContent.js';

const FALLBACK = {
  services: SERVICES,
  projects: PROJECTS,
  quests: QUESTS,
  techDomains: TECH_DOMAINS,
  socialLinks: SOCIAL_LINKS,
};

/*
 * Loading strategy (when an API is configured):
 *   1. Show the last successful API response from localStorage instantly.
 *   2. Never show the bundled demo projects/quests: until real data exists,
 *      projects/quests are [] and `status` is 'loading' (sections render placeholders).
 *   3. Fetch fresh content, retrying with backoff. The free Render backend
 *      sleeps when idle and can take ~50 s to wake up.
 * Without an API (local dev), the bundled demo content is used as before.
 */
const CACHE_KEY = 'portfolio-content-v1';
const RETRY_DELAYS = [3000, 6000, 10000, 15000, 20000, 30000]; // ~1.5 min of retries
const ATTEMPT_TIMEOUT = 65000; // a cold start can take ~50 s

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const writeCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* storage full / private mode: not critical */
  }
};

/** Replace a section whenever the API returned an array, including empty. */
const pick = (remote, fallback) => (Array.isArray(remote) ? remote : fallback);

const ContentContext = createContext({ ...FALLBACK, status: 'static', source: 'static' });

export function ContentProvider({ children }) {
  const [remote, setRemote] = useState(() => (hasApi ? readCache() : null));
  const [fresh, setFresh] = useState(false); // true once this visit got a live response
  const [failed, setFailed] = useState(false); // all retries exhausted

  useEffect(() => {
    if (!hasApi) return undefined;
    let cancelled = false;
    let timer = 0;
    let controller = null;

    const attempt = async (n) => {
      controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), ATTEMPT_TIMEOUT);
      const data = await fetchContent(controller.signal);
      clearTimeout(timeout);
      if (cancelled) return;
      if (data) {
        setRemote(data);
        setFresh(true);
        writeCache(data);
      } else if (n < RETRY_DELAYS.length) {
        timer = setTimeout(() => attempt(n + 1), RETRY_DELAYS[n]);
      } else {
        setFailed(true);
      }
    };
    attempt(0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller?.abort();
    };
  }, []);

  const value = useMemo(() => {
    if (!hasApi) return { ...FALLBACK, status: 'static', source: 'static' };
    const r = remote ?? {};
    return {
      // Site copy (services, tech, socials) may fall back to the bundled text...
      services: pick(r.services, SERVICES),
      techDomains: pick(r.techDomains, TECH_DOMAINS),
      socialLinks: pick(r.socialLinks, SOCIAL_LINKS),
      // ...but projects and quests never show demo entries.
      projects: pick(r.projects, []),
      quests: pick(r.quests, []),
      // 'ready' once any real data exists (cached or live); 'error' if nothing ever arrived.
      status: remote ? 'ready' : failed ? 'error' : 'loading',
      source: fresh ? 'api' : remote ? 'cache' : 'none',
    };
  }, [remote, fresh, failed]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export const useContent = () => useContext(ContentContext);
