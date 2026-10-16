import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchContent } from '../lib/api.js';
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

const ContentContext = createContext({ ...FALLBACK, source: 'static' });

/** Replace a section whenever the API returned an array, including empty. */
const pick = (remote, fallback) =>
  Array.isArray(remote) ? remote : fallback;

export function ContentProvider({ children }) {
  const [remote, setRemote] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchContent(controller.signal).then((data) => {
      if (data) setRemote(data);
    });
    return () => controller.abort();
  }, []);

  const value = useMemo(() => {
    if (!remote) return { ...FALLBACK, source: 'static' };
    return {
      services: pick(remote.services, SERVICES),
      projects: pick(remote.projects, PROJECTS),
      quests: pick(remote.quests, QUESTS),
      techDomains: pick(remote.techDomains, TECH_DOMAINS),
      socialLinks: pick(remote.socialLinks, SOCIAL_LINKS),
      source: 'api',
    };
  }, [remote]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export const useContent = () => useContext(ContentContext);
