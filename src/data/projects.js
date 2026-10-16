// Artwork lives on the author's public Google Drive (original JPEG bytes).
const koelPanic = 'https://lh3.googleusercontent.com/d/1kMAEHgDImk5UCrTqq9Qmul5a2Kw69axf';
const nikeAdFilm = 'https://lh3.googleusercontent.com/d/1ZnE-WEhrWtGOneuh1DebRLvacsIGiv4d';
const exploring3d = 'https://lh3.googleusercontent.com/d/1lh2dSyoz90YWPbxZyBF1WL9fF2bFVOqx';
const kaiYug = 'https://lh3.googleusercontent.com/d/1TSghx7Ued5i_pykuGoqo8kPYsTN8NJEC';
const udaipurDairies = 'https://lh3.googleusercontent.com/d/1KaKK47dzGwH4E3wOnxgr9ewRF-ykQjaJ';
const revivalOfHim = 'https://lh3.googleusercontent.com/d/1ynVUhjQI8sGVUeFZl9jCnHwDLyv_22Xv';

// Process footage (Pexels, royalty free).
const VIDEO_SKETCH = 'https://videos.pexels.com/video-files/6594099/6594099-hd_2048_864_30fps.mp4';
const VIDEO_PAINT = 'https://videos.pexels.com/video-files/4360562/4360562-uhd_3840_2160_24fps.mp4';
const VIDEO_INK = 'https://videos.pexels.com/video-files/6594103/6594103-hd_2048_864_30fps.mp4';
const VIDEO_DESIGN = 'https://videos.pexels.com/video-files/6594101/6594101-hd_2048_864_30fps.mp4';

/**
 * Every project is a full case study. `slug` drives the #/project/<slug>
 * route, everything else renders the detail page.
 */
export const PROJECTS = [
  {
    slug: 'koel-panic',
    title: 'Koel Panic',
    tag: 'Comic Book',
    year: '2025',
    role: 'Author · Illustrator',
    client: 'Self-initiated',
    duration: '7 months',
    cover: koelPanic,
    video: VIDEO_INK,
    summary:
      'A 36-page graphic novella about a city that forgets how to sleep, drawn in ink wash and panic.',
    description: [
      'Koel Panic began as a single panel: a bird screaming over a skyline that would not switch its lights off. From that image I built a 36-page novella about insomnia as an urban condition — a city that has traded its nights for productivity, and the one creature still trying to mark the hours.',
      'Every page was thumbnailed on paper, inked digitally, then flattened back into a two-colour wash so the book could print cheaply without losing its weight. The constraint ended up defining the look: hard blacks, bone white, and a single alarm-red spot colour reserved for the moments the city actually wakes.',
      'The hardest problem was pacing. Panic reads fast, so the gutters had to carry the slow parts — long silent tiers, repeated establishing shots, a full spread of nothing but windows. Readers consistently stopped on that spread, which is exactly what it was for.',
    ],
    stack: ['Procreate', 'Clip Studio Paint', 'InDesign', 'Ink Wash', 'Two-colour Print'],
    highlights: [
      ['Pages', '36'],
      ['Panels drawn', '210+'],
      ['Print run', '250 copies'],
      ['Colours', '2 + spot'],
    ],
    gallery: [
      { src: koelPanic, caption: 'Cover plate — alarm red on bone white' },
      { src: revivalOfHim, caption: 'Interior tier studies' },
      { src: udaipurDairies, caption: 'Colour flats before the wash pass' },
    ],
    links: [
      { label: 'Read preview', href: '#' },
      { label: 'Print edition', href: '#' },
    ],
  },
  {
    slug: 'nike-ad-film',
    title: 'Nike Ad Film',
    tag: '2D Animation',
    year: '2025',
    role: 'Animator · Compositor',
    client: 'Spec / concept',
    duration: '6 weeks',
    cover: nikeAdFilm,
    video: VIDEO_DESIGN,
    summary:
      'A 45-second spec spot built on frame-by-frame run cycles, cel-shaded over live-action plates.',
    description: [
      'A spec commercial built around one idea: the runner never lands. Every contact frame is replaced by a smear, so the figure reads as perpetual momentum rather than a sequence of steps.',
      'I animated the character on twos at 24fps, then composited the cels over graded live-action plates. Matching the lighting meant hand-painting a rim pass per frame — slow, but it is the thing that makes the drawing sit inside the photograph instead of floating on top of it.',
      'The final cut runs 45 seconds with a 6-second cutdown for vertical. Both share the same animation master; only the framing and the type treatment change.',
    ],
    stack: ['After Effects', 'TVPaint', 'Photoshop', 'DaVinci Resolve', 'Cel Animation'],
    highlights: [
      ['Runtime', '45s'],
      ['Frames animated', '640'],
      ['Frame rate', '24fps on twos'],
      ['Deliverables', '3 cuts'],
    ],
    gallery: [
      { src: nikeAdFilm, caption: 'Key frame — the perpetual stride' },
      { src: exploring3d, caption: 'Environment plate before cel pass' },
      { src: kaiYug, caption: 'Run cycle breakdown sheet' },
    ],
    links: [
      { label: 'Watch the cut', href: '#' },
      { label: 'Breakdown reel', href: '#' },
    ],
  },
  {
    slug: 'exploring-3d',
    title: 'Exploring 3D',
    tag: 'Environment Design',
    year: '2024',
    role: 'Environment Artist',
    client: 'Personal study',
    duration: 'Ongoing',
    cover: exploring3d,
    video: VIDEO_PAINT,
    summary:
      'A running series of modelled environments used to teach myself light, scale and material honesty.',
    description: [
      'This is the sketchbook I keep in 3D. Each scene starts as a greybox with no texture at all, because if the composition does not work in flat grey it will not be rescued by materials later.',
      'The series is deliberately unglamorous: corridors, stairwells, loading bays, the backs of buildings. Ordinary geometry is the fastest way to learn how light actually behaves, and it leaves nowhere to hide a bad silhouette.',
      'Everything is lit with physical units and rendered without post-processed bloom, so the contrast you see is the contrast the scene genuinely produces. Each study ships with its own lighting breakdown.',
    ],
    stack: ['Blender', 'Cycles', 'Substance Painter', 'Quixel', 'Photoshop'],
    highlights: [
      ['Scenes built', '18'],
      ['Avg. render', '22 min'],
      ['Lighting', 'Physical units'],
      ['Post', 'None'],
    ],
    gallery: [
      { src: exploring3d, caption: 'Loading bay — final lighting pass' },
      { src: koelPanic, caption: 'Greybox composition test' },
      { src: nikeAdFilm, caption: 'Material study sheet' },
    ],
    links: [{ label: 'Full series', href: '#' }],
  },
  {
    slug: 'kai-yug',
    title: 'Kai-Yug',
    tag: 'Storyboarding',
    year: '2024',
    role: 'Storyboard Artist',
    client: 'Short film',
    duration: '3 months',
    cover: kaiYug,
    video: VIDEO_SKETCH,
    summary:
      'Full boards and an animatic for a mythological short — 340 panels of staging, blocking and timing.',
    description: [
      'Kai-Yug is a mythological short told almost entirely through staging. There is very little dialogue, so the boards had to carry character intent through blocking alone: who occupies the frame, who is pushed out of it, and when the camera finally agrees to look at someone directly.',
      'I boarded 340 panels and cut them into a timed animatic with scratch audio before a single final frame was produced. That animatic became the actual production document — it caught two sequences that read beautifully as drawings but died completely once given real duration.',
      'The lesson that stuck: a board is not a picture, it is a measurement of time. Panels that cannot survive being held for their true length are not finished.',
    ],
    stack: ['Storyboard Pro', 'Photoshop', 'Premiere Pro', 'Animatic Edit'],
    highlights: [
      ['Panels', '340'],
      ['Sequences', '9'],
      ['Animatic', '11 min'],
      ['Revisions', '4 passes'],
    ],
    gallery: [
      { src: kaiYug, caption: 'Sequence 04 — the confrontation staging' },
      { src: revivalOfHim, caption: 'Character blocking thumbnails' },
      { src: exploring3d, caption: 'Environment reference plate' },
    ],
    links: [
      { label: 'View animatic', href: '#' },
      { label: 'Board excerpt', href: '#' },
    ],
  },
  {
    slug: 'udaipur-dairies',
    title: 'Udaipur Dairies',
    tag: 'Illustrative Book',
    year: '2023',
    role: 'Illustrator · Designer',
    client: 'Travel publication',
    duration: '5 months',
    cover: udaipurDairies,
    video: VIDEO_PAINT,
    summary:
      'An illustrated travel diary of Udaipur — 60 watercolour plates, hand-lettered and typeset as a book.',
    description: [
      'Five months of drawing in one city, collected into a book. Everything was painted on location in watercolour, which meant accepting the weather as a collaborator — several plates carry the bloom marks of being rained on, and those stayed in.',
      'Rather than organising the book by landmark, I arranged it by time of day. The city changes character completely between the 6am ghats and the 9pm rooftops, and the chronological structure lets the palette carry that shift without a word of explanation.',
      'I hand-lettered the section headings and typeset the body in a quiet serif, keeping the margins wide so the plates breathe. The paper stock was chosen specifically to hold watercolour texture in CMYK.',
    ],
    stack: ['Watercolour', 'Hand Lettering', 'InDesign', 'Illustrator', 'Offset Print'],
    highlights: [
      ['Plates', '60'],
      ['Pages', '144'],
      ['Structure', 'By time of day'],
      ['Binding', 'Section sewn'],
    ],
    gallery: [
      { src: udaipurDairies, caption: 'Dawn ghats — plate 06' },
      { src: koelPanic, caption: 'Hand-lettered section opener' },
      { src: kaiYug, caption: 'Location sketch before the paint pass' },
    ],
    links: [
      { label: 'Flip through', href: '#' },
      { label: 'Buy the book', href: '#' },
    ],
  },
  {
    slug: 'revival-of-him',
    title: 'Revival of Him',
    tag: '2D Animation',
    year: '2023',
    role: 'Director · Animator',
    client: 'Short film',
    duration: '8 months',
    cover: revivalOfHim,
    video: VIDEO_INK,
    summary:
      'A hand-drawn short about reassembly — rotoscoped, then deliberately broken frame by frame.',
    description: [
      'An eight-month solo short about putting a person back together. The animation starts rotoscoped and photo-accurate, then degrades on purpose: lines drift off-model, frames drop, the figure comes apart into its own construction marks before rebuilding.',
      'Technically the whole film is a controlled failure. I built a pass that randomly omits in-betweens at increasing rates, so the deterioration is systematic rather than hand-faked — it gets worse at a rate the audience can feel but not quite count.',
      'The sound design carries the recovery. As the drawing reassembles, the track resolves from clipped noise into a single sustained tone, and the final 20 seconds run completely on-model for the first time in the film.',
    ],
    stack: ['TVPaint', 'After Effects', 'Rotoscope', 'Audition', 'Frame Scripting'],
    highlights: [
      ['Runtime', '4m 10s'],
      ['Frames', '2,400+'],
      ['Production', '8 months'],
      ['Crew', 'Solo'],
    ],
    gallery: [
      { src: revivalOfHim, caption: 'Final reassembly frame' },
      { src: nikeAdFilm, caption: 'Degradation pass — dropped in-betweens' },
      { src: udaipurDairies, caption: 'Colour script' },
    ],
    links: [
      { label: 'Watch the film', href: '#' },
      { label: 'Process notes', href: '#' },
    ],
  },
];

export const getProject = (slug) => PROJECTS.find((p) => p.slug === slug);
