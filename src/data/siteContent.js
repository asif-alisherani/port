/**
 * Fallback content. Used when the Laravel API is unreachable (or when the
 * site is deployed as a standalone static build), so the page always renders
 * a complete, correct portfolio.
 */

export const SERVICES = [
  {
    id: '01',
    title: 'Full-stack development',
    body: 'From a clear user flow to a deployed, maintainable web application.',
    icon: 'cube',
  },
  {
    id: '02',
    title: 'Backend & APIs',
    body: 'Laravel services, REST APIs, database design, integrations, and performance-minded logic.',
    icon: 'database',
  },
  {
    id: '03',
    title: 'React Native apps',
    body: 'Cross-platform Android app development connected to dependable APIs and backend workflows.',
    icon: 'mobile',
  },
  {
    id: '04',
    title: 'AI & data exploration',
    body: 'Machine-learning experiments, data wrangling, model evaluation, and practical AI workflows.',
    icon: 'brain',
  },
];

export const TECH_DOMAINS = [
  {
    label: 'Frontend',
    icon: 'code',
    tools: ['React', 'TypeScript', 'Tailwind CSS', 'Motion', 'Vite', 'Accessibility'],
  },
  {
    label: 'Backend',
    icon: 'terminal',
    tools: ['Laravel', 'Node.js', 'REST APIs', 'PostgreSQL', 'Redis', 'Queues'],
  },
  {
    label: 'Data',
    icon: 'database',
    tools: ['SQL', 'Data Modeling', 'ETL Pipelines', 'Metabase', 'Dashboards'],
  },
  {
    label: 'AI / ML',
    icon: 'sparkles',
    tools: ['LLM Integration', 'Prompt Engineering', 'RAG', 'Evaluations', 'Python'],
  },
  {
    label: 'Mobile apps',
    icon: 'mobile',
    tools: ['React Native', 'Android App Development', 'Flutter', 'API Integration'],
  },
];

// Add real profiles in the Laravel admin. Dead placeholder links are not shown.
export const SOCIAL_LINKS = [];
