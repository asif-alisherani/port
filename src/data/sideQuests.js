// Artwork lives on the author's public Google Drive (original JPEG bytes).
const aiNotes = 'https://lh3.googleusercontent.com/d/1ANxTAenu3gq1UCP_UKawBW4kv0LKdTNa';
const devDashboard = 'https://lh3.googleusercontent.com/d/1GH-k_8O65ENIxlyv-EyVL9nd24U6gOmJ';
const esports = 'https://lh3.googleusercontent.com/d/1fhfJakMYRMgOcGaPNsTOwANoNYBklMLL';
const motionStudies = 'https://lh3.googleusercontent.com/d/194oIDgeW1xbUoi73-cHEWeYgsWqNgkNW';

// Field footage (Pexels, royalty free).
const VIDEO_CRAFT = 'https://videos.pexels.com/video-files/8480293/8480293-uhd_3840_2160_25fps.mp4';
const VIDEO_LAB = 'https://videos.pexels.com/video-files/6964235/6964235-hd_1920_1080_25fps.mp4';
const VIDEO_NOTES = 'https://videos.pexels.com/video-files/6804109/6804109-uhd_4096_2160_25fps.mp4';
const VIDEO_ESPORTS = 'https://videos.pexels.com/video-files/7914780/7914780-hd_1920_1080_30fps.mp4';

/**
 * Every side quest is a full dossier. Same shape as the project case
 * studies, so both share one detail page.
 */
export const QUESTS = [
  {
    slug: 'developer-dashboard-template',
    file: 'dashboard-template.repo',
    date: 'FEB 2025',
    title: 'Developer Dashboard Template',
    tag: 'UI System',
    year: '2025',
    role: 'Design + Frontend',
    client: 'Open starter',
    duration: '4 weeks',
    cover: devDashboard,
    video: VIDEO_CRAFT,
    summary:
      'A customizable starter for a readable, responsive dashboard with reusable cards, filters, tables, and dark-theme patterns.',
    description: [
      'Every side project I start seems to need the same three days of work before it needs anything else: a shell, a sidebar, a settings page, a table that does not embarrass itself. This template is that work, done once, done properly, and kept on the shelf.',
      'The interesting constraint was information density. Dashboards fail in two directions — cramped or padded — so the whole system is built on a 4px vertical rhythm with a "quiet" density preset and a "dense" one. Every component respects the same two numbers, which is why the template still reads as one product no matter how it is composed.',
      'It ships dark-first with theming through CSS custom properties, so rebranding a fork for a client demo takes an afternoon instead of a rewrite. Twenty-four documented components, MIT licensed, dependencies kept spitefully few.',
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'Vite', 'Recharts'],
    highlights: [
      ['Components', '24'],
      ['Density modes', '2'],
      ['Bundle', '48KB gz'],
      ['License', 'MIT'],
    ],
    gallery: [
      { src: devDashboard, caption: 'Dense mode — the analytics desk' },
      { src: aiNotes, caption: 'Quiet mode — settings and profile' },
      { src: motionStudies, caption: 'Table system with filter states' },
    ],
    links: [
      { label: 'Explore the repo', href: '#' },
      { label: 'Live demo', href: '#' },
    ],
  },
  {
    slug: 'react-motion-studies',
    file: 'motion-studies.lab',
    date: 'APR 2025',
    title: 'React Motion Studies',
    tag: 'Motion Lab',
    year: '2025',
    role: 'Developer · Animator',
    client: 'Personal lab',
    duration: 'Ongoing',
    cover: motionStudies,
    video: VIDEO_LAB,
    summary:
      'A living collection of small interaction experiments: scroll behaviors, magnetic elements, staggered micro-animations, and spring-feel explorations.',
    description: [
      'The lab exists because springs are easy to start and hard to finish. Every study isolates exactly one behavior — a magnetic button, a scroll-coupled rail, a stagger curve — and tunes it until the motion stops feeling like an animation and starts feeling like a material property.',
      'Each study is versioned like an experiment should be: hypothesis, rough pass, tuned pass, and a written note on which constants finally settled and why. Failed studies stay in the repo too, because a broken spring teaches more than a smooth one.',
      'The lab is where this portfolio gets warmed up. The cursor springs in the hero, the rail behaviors, the blur-materialising chips — all of them graduated from studies here before they earned a place on the page.',
    ],
    stack: ['Motion', 'React', 'TypeScript', 'CSS', 'View Transitions'],
    highlights: [
      ['Studies', '30+'],
      ['Published demos', '12'],
      ['FPS floor', '60'],
      ['Graduated to prod', '7'],
    ],
    gallery: [
      { src: motionStudies, caption: 'The spring bench — tuning stiffness' },
      { src: devDashboard, caption: 'Scroll-coupled rail, study 14' },
      { src: esports, caption: 'Magnetic target, study 09' },
    ],
    links: [
      { label: 'Browse the lab', href: '#' },
      { label: 'Study notes', href: '#' },
    ],
  },
  {
    slug: 'ai-assisted-development-notes',
    file: 'ai-dev-notes.md',
    date: 'JUN 2025',
    title: 'AI-Assisted Development Notes',
    tag: 'AI Workflow',
    year: '2025',
    role: 'Researcher · Writer',
    client: 'Living document',
    duration: 'Weekly',
    cover: aiNotes,
    video: VIDEO_NOTES,
    summary:
      'An evolving set of notes on AI workflows: prompt patterns, tooling experiments, and practical guidance for shipping faster without losing quality.',
    description: [
      'Daily building with LLMs produced a pile of habits that worked and a pile that quietly did not. These notes are the archaeology of both: what actually ships faster, what only feels faster, and the handful of failure modes — prompt decay, context rot, confident nonsense — that cost real evenings.',
      'The core finding: prompts are not assets, evals are. A pretty prompt without a way to measure its output is a lottery ticket, so every workflow in the notes includes a way to score it, even if the scorecard is twenty lines long.',
      'It lives in public as weekly-updated markdown: twenty-six catalogued patterns, the eval harnesses behind them, and honest post-mortems when an automation quietly stopped working.',
    ],
    stack: ['LLM APIs', 'RAG', 'Eval Harnesses', 'Prompt Tooling', 'Python'],
    highlights: [
      ['Notes', '120+'],
      ['Patterns catalogued', '26'],
      ['Cadence', 'Weekly'],
      ['Format', 'Markdown'],
    ],
    gallery: [
      { src: aiNotes, caption: 'The pattern index, annotated' },
      { src: devDashboard, caption: 'Eval scorecard for a writeup flow' },
      { src: motionStudies, caption: 'Tooling experiment log' },
    ],
    links: [
      { label: 'Read the notes', href: '#' },
      { label: 'Pattern index', href: '#' },
    ],
  },
  {
    slug: 'esports-teamplay',
    file: 'esports-teamplay.log',
    date: 'ONGOING',
    title: 'Esports & Teamplay',
    tag: 'Esports Log',
    year: 'ONGOING',
    role: 'IGL · Sentinel',
    client: 'Five-stack',
    duration: 'Ongoing',
    cover: esports,
    video: VIDEO_ESPORTS,
    summary:
      'Competitive discipline and communication practice: a personal space for teamwork, coordination, strategy breakdowns, and scrims.',
    description: [
      'Esports is where I practice the exact thing my day job keeps asking for: communicating clearly inside a team while everything is on fire. Calling plays in Valorant is sprint planning under a two-second deadline.',
      'The ritual is the point. Every scrim gets logged, every loss gets a VOD review, and the review culture is deliberately the same shape as a good engineering retro — what did we decide, what did it cost, what changes next week.',
      'The strategy documents that come out of those sessions have become their own archive: economy maps, rotation notes, comms frameworks. Calling a timeout at the right moment turns out to be transferrable work.',
    ],
    stack: ['Valorant', 'VOD Review', 'Comms Frameworks', 'Strategy Docs'],
    highlights: [
      ['Peak rank', 'Ascendant'],
      ['Scrims logged', '140+'],
      ['Stack', '5'],
      ['Call', 'IGL'],
    ],
    gallery: [
      { src: esports, caption: 'Scrims night — post-round debrief' },
      { src: motionStudies, caption: 'Reaction training off-day' },
      { src: devDashboard, caption: 'Scrim log dashboard' },
    ],
    links: [
      { label: 'Match history', href: '#' },
      { label: 'Strategy archive', href: '#' },
    ],
  },
];

export const getQuest = (slug) => QUESTS.find((q) => q.slug === slug);
