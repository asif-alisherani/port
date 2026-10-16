import { AnimatePresence } from 'motion/react';
import BeyondTheBrief from './components/BeyondTheBrief.jsx';
import Contact from './components/Contact.jsx';
import ContactForm from './components/ContactForm.jsx';
import CyborgHero from './components/CyborgHero.jsx';
import DetailPage from './components/DetailPage.jsx';
import Experience from './components/Experience.jsx';
import NavBar from './components/NavBar.jsx';
import Projects from './components/Projects.jsx';
import TechUniverse from './components/TechUniverse.jsx';
import WhatIBuild from './components/WhatIBuild.jsx';
import { ContentProvider, useContent } from './context/ContentContext.jsx';
import { useDetailRoute } from './hooks/useHashRoute.js';

function Site() {
  const route = useDetailRoute();
  const { projects, quests } = useContent();

  const siblings = route?.kind === 'project' ? projects : route?.kind === 'quest' ? quests : null;
  const entry = siblings?.find((e) => e.slug === route.slug) ?? null;

  return (
    <main className="bg-black">
      <NavBar />
      <CyborgHero />
      <WhatIBuild />
      <Projects />
      <Experience />
      <TechUniverse />
      <BeyondTheBrief />
      <Contact />
      <ContactForm />

      <AnimatePresence>
        {entry && siblings && (
          <DetailPage
            key={`${route.kind}-${entry.slug}`}
            kind={route.kind}
            entry={entry}
            siblings={siblings}
            backLabel={route.kind === 'project' ? 'All work' : 'All quests'}
            nextLabel={route.kind === 'project' ? 'Next project' : 'Next quest'}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <Site />
    </ContentProvider>
  );
}
