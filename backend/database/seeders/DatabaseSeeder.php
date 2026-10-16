<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Quest;
use App\Models\Service;
use App\Models\SocialLink;
use App\Models\TechDomain;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    private const DRIVE = 'https://lh3.googleusercontent.com/d/';

    public function run(): void
    {
        /* ------------------------------------------------- admin account */
        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@asifali.dev')],
            ['name' => 'Asif Ali Sherani', 'password' => env('ADMIN_PASSWORD', 'password')]
        );

        /* --------------------------------------------- section 01 cards */
        $services = [
            ['Full-stack development', 'From a clear user flow to a deployed, maintainable web application.', 'cube'],
            ['Backend & APIs', 'Laravel services, REST APIs, database design, integrations, and performance-minded logic.', 'database'],
            ['React Native apps', 'Cross-platform Android app development connected to dependable APIs and backend workflows.', 'mobile'],
            ['AI & data exploration', 'Machine-learning experiments, data wrangling, model evaluation, and practical AI workflows.', 'brain'],
        ];
        foreach ($services as $i => [$title, $body, $icon]) {
            Service::updateOrCreate(['title' => $title], compact('body', 'icon') + ['position' => $i]);
        }

        /* ------------------------------------------------ stack domains */
        $domains = [
            ['Frontend', 'code', ['React', 'TypeScript', 'Tailwind CSS', 'Motion', 'Vite', 'Accessibility']],
            ['Backend', 'terminal', ['Laravel', 'Node.js', 'REST APIs', 'PostgreSQL', 'Redis', 'Queues']],
            ['Data', 'database', ['SQL', 'Data Modeling', 'ETL Pipelines', 'Metabase', 'Dashboards']],
            ['AI / ML', 'sparkles', ['LLM Integration', 'Prompt Engineering', 'RAG', 'Evaluations', 'Python']],
            ['Mobile apps', 'mobile', ['React Native', 'Android App Development', 'Flutter', 'API Integration']],
        ];
        foreach ($domains as $i => [$label, $icon, $tools]) {
            TechDomain::updateOrCreate(['label' => $label], compact('icon', 'tools') + ['position' => $i]);
        }

        /* -------------------------------------------------------- links */
        $links = [
            ['LinkedIn', 'https://www.linkedin.com/in/'],
            ['GitHub', 'https://github.com/'],
        ];
        foreach ($links as $i => [$label, $url]) {
            SocialLink::updateOrCreate(['label' => $label], [
                'url' => $url,
                'position' => $i,
                // Profile URLs are intentionally hidden until replaced in /admin/links.
                'is_published' => false,
            ]);
        }

        $this->seedProjects();
        $this->seedQuests();
    }

    private function seedProjects(): void
    {
        $art = fn (string $id) => self::DRIVE . $id;

        $koel = $art('1kMAEHgDImk5UCrTqq9Qmul5a2Kw69axf');
        $nike = $art('1ZnE-WEhrWtGOneuh1DebRLvacsIGiv4d');
        $three = $art('1lh2dSyoz90YWPbxZyBF1WL9fF2bFVOqx');
        $kai = $art('1TSghx7Ued5i_pykuGoqo8kPYsTN8NJEC');
        $udaipur = $art('1KaKK47dzGwH4E3wOnxgr9ewRF-ykQjaJ');
        $revival = $art('1ynVUhjQI8sGVUeFZl9jCnHwDLyv_22Xv');

        $vInk = 'https://videos.pexels.com/video-files/6594103/6594103-hd_2048_864_30fps.mp4';
        $vDesign = 'https://videos.pexels.com/video-files/6594101/6594101-hd_2048_864_30fps.mp4';
        $vPaint = 'https://videos.pexels.com/video-files/4360562/4360562-uhd_3840_2160_24fps.mp4';
        $vSketch = 'https://videos.pexels.com/video-files/6594099/6594099-hd_2048_864_30fps.mp4';

        $rows = [
            [
                'slug' => 'koel-panic', 'title' => 'Koel Panic', 'tag' => 'Comic Book', 'year' => '2025',
                'role' => 'Author · Illustrator', 'client' => 'Self-initiated', 'duration' => '7 months',
                'cover' => $koel, 'video' => $vInk,
                'summary' => 'A 36-page graphic novella about a city that forgets how to sleep, drawn in ink wash and panic.',
                'description' => [
                    'Koel Panic began as a single panel: a bird screaming over a skyline that would not switch its lights off. From that image I built a 36-page novella about insomnia as an urban condition.',
                    'Every page was thumbnailed on paper, inked digitally, then flattened back into a two-colour wash so the book could print cheaply without losing its weight.',
                    'The hardest problem was pacing. Panic reads fast, so the gutters had to carry the slow parts — long silent tiers, repeated establishing shots, a full spread of nothing but windows.',
                ],
                'stack' => ['Procreate', 'Clip Studio Paint', 'InDesign', 'Ink Wash', 'Two-colour Print'],
                'highlights' => [['Pages', '36'], ['Panels drawn', '210+'], ['Print run', '250 copies'], ['Colours', '2 + spot']],
                'gallery' => [
                    ['src' => $koel, 'caption' => 'Cover plate — alarm red on bone white'],
                    ['src' => $revival, 'caption' => 'Interior tier studies'],
                    ['src' => $udaipur, 'caption' => 'Colour flats before the wash pass'],
                ],
                'links' => [['label' => 'Read preview', 'href' => '#'], ['label' => 'Print edition', 'href' => '#']],
            ],
            [
                'slug' => 'nike-ad-film', 'title' => 'Nike Ad Film', 'tag' => '2D Animation', 'year' => '2025',
                'role' => 'Animator · Compositor', 'client' => 'Spec / concept', 'duration' => '6 weeks',
                'cover' => $nike, 'video' => $vDesign,
                'summary' => 'A 45-second spec spot built on frame-by-frame run cycles, cel-shaded over live-action plates.',
                'description' => [
                    'A spec commercial built around one idea: the runner never lands. Every contact frame is replaced by a smear, so the figure reads as perpetual momentum.',
                    'I animated the character on twos at 24fps, then composited the cels over graded live-action plates, hand-painting a rim pass per frame.',
                    'The final cut runs 45 seconds with a 6-second cutdown for vertical. Both share the same animation master.',
                ],
                'stack' => ['After Effects', 'TVPaint', 'Photoshop', 'DaVinci Resolve', 'Cel Animation'],
                'highlights' => [['Runtime', '45s'], ['Frames animated', '640'], ['Frame rate', '24fps on twos'], ['Deliverables', '3 cuts']],
                'gallery' => [
                    ['src' => $nike, 'caption' => 'Key frame — the perpetual stride'],
                    ['src' => $three, 'caption' => 'Environment plate before cel pass'],
                    ['src' => $kai, 'caption' => 'Run cycle breakdown sheet'],
                ],
                'links' => [['label' => 'Watch the cut', 'href' => '#'], ['label' => 'Breakdown reel', 'href' => '#']],
            ],
            [
                'slug' => 'exploring-3d', 'title' => 'Exploring 3D', 'tag' => 'Environment Design', 'year' => '2024',
                'role' => 'Environment Artist', 'client' => 'Personal study', 'duration' => 'Ongoing',
                'cover' => $three, 'video' => $vPaint,
                'summary' => 'A running series of modelled environments used to teach myself light, scale and material honesty.',
                'description' => [
                    'This is the sketchbook I keep in 3D. Each scene starts as a greybox with no texture at all, because if the composition does not work in flat grey it will not be rescued by materials later.',
                    'The series is deliberately unglamorous: corridors, stairwells, loading bays, the backs of buildings.',
                    'Everything is lit with physical units and rendered without post-processed bloom, so the contrast you see is the contrast the scene genuinely produces.',
                ],
                'stack' => ['Blender', 'Cycles', 'Substance Painter', 'Quixel', 'Photoshop'],
                'highlights' => [['Scenes built', '18'], ['Avg. render', '22 min'], ['Lighting', 'Physical units'], ['Post', 'None']],
                'gallery' => [
                    ['src' => $three, 'caption' => 'Loading bay — final lighting pass'],
                    ['src' => $koel, 'caption' => 'Greybox composition test'],
                    ['src' => $nike, 'caption' => 'Material study sheet'],
                ],
                'links' => [['label' => 'Full series', 'href' => '#']],
            ],
            [
                'slug' => 'kai-yug', 'title' => 'Kai-Yug', 'tag' => 'Storyboarding', 'year' => '2024',
                'role' => 'Storyboard Artist', 'client' => 'Short film', 'duration' => '3 months',
                'cover' => $kai, 'video' => $vSketch,
                'summary' => 'Full boards and an animatic for a mythological short — 340 panels of staging, blocking and timing.',
                'description' => [
                    'Kai-Yug is a mythological short told almost entirely through staging. There is very little dialogue, so the boards had to carry character intent through blocking alone.',
                    'I boarded 340 panels and cut them into a timed animatic with scratch audio before a single final frame was produced.',
                    'The lesson that stuck: a board is not a picture, it is a measurement of time.',
                ],
                'stack' => ['Storyboard Pro', 'Photoshop', 'Premiere Pro', 'Animatic Edit'],
                'highlights' => [['Panels', '340'], ['Sequences', '9'], ['Animatic', '11 min'], ['Revisions', '4 passes']],
                'gallery' => [
                    ['src' => $kai, 'caption' => 'Sequence 04 — the confrontation staging'],
                    ['src' => $revival, 'caption' => 'Character blocking thumbnails'],
                    ['src' => $three, 'caption' => 'Environment reference plate'],
                ],
                'links' => [['label' => 'View animatic', 'href' => '#'], ['label' => 'Board excerpt', 'href' => '#']],
            ],
            [
                'slug' => 'udaipur-dairies', 'title' => 'Udaipur Dairies', 'tag' => 'Illustrative Book', 'year' => '2023',
                'role' => 'Illustrator · Designer', 'client' => 'Travel publication', 'duration' => '5 months',
                'cover' => $udaipur, 'video' => $vPaint,
                'summary' => 'An illustrated travel diary of Udaipur — 60 watercolour plates, hand-lettered and typeset as a book.',
                'description' => [
                    'Five months of drawing in one city, collected into a book. Everything was painted on location in watercolour, which meant accepting the weather as a collaborator.',
                    'Rather than organising the book by landmark, I arranged it by time of day. The city changes character completely between the 6am ghats and the 9pm rooftops.',
                    'I hand-lettered the section headings and typeset the body in a quiet serif, keeping the margins wide so the plates breathe.',
                ],
                'stack' => ['Watercolour', 'Hand Lettering', 'InDesign', 'Illustrator', 'Offset Print'],
                'highlights' => [['Plates', '60'], ['Pages', '144'], ['Structure', 'By time of day'], ['Binding', 'Section sewn']],
                'gallery' => [
                    ['src' => $udaipur, 'caption' => 'Dawn ghats — plate 06'],
                    ['src' => $koel, 'caption' => 'Hand-lettered section opener'],
                    ['src' => $kai, 'caption' => 'Location sketch before the paint pass'],
                ],
                'links' => [['label' => 'Flip through', 'href' => '#'], ['label' => 'Buy the book', 'href' => '#']],
            ],
            [
                'slug' => 'revival-of-him', 'title' => 'Revival of Him', 'tag' => '2D Animation', 'year' => '2023',
                'role' => 'Director · Animator', 'client' => 'Short film', 'duration' => '8 months',
                'cover' => $revival, 'video' => $vInk,
                'summary' => 'A hand-drawn short about reassembly — rotoscoped, then deliberately broken frame by frame.',
                'description' => [
                    'An eight-month solo short about putting a person back together. The animation starts rotoscoped and photo-accurate, then degrades on purpose.',
                    'Technically the whole film is a controlled failure. I built a pass that randomly omits in-betweens at increasing rates.',
                    'The sound design carries the recovery. As the drawing reassembles, the track resolves from clipped noise into a single sustained tone.',
                ],
                'stack' => ['TVPaint', 'After Effects', 'Rotoscope', 'Audition', 'Frame Scripting'],
                'highlights' => [['Runtime', '4m 10s'], ['Frames', '2,400+'], ['Production', '8 months'], ['Crew', 'Solo']],
                'gallery' => [
                    ['src' => $revival, 'caption' => 'Final reassembly frame'],
                    ['src' => $nike, 'caption' => 'Degradation pass — dropped in-betweens'],
                    ['src' => $udaipur, 'caption' => 'Colour script'],
                ],
                'links' => [['label' => 'Watch the film', 'href' => '#'], ['label' => 'Process notes', 'href' => '#']],
            ],
        ];

        foreach ($rows as $i => $row) {
            Project::updateOrCreate(['slug' => $row['slug']], $row + ['position' => $i]);
        }
    }

    private function seedQuests(): void
    {
        $art = fn (string $id) => self::DRIVE . $id;

        $notes = $art('1ANxTAenu3gq1UCP_UKawBW4kv0LKdTNa');
        $dash = $art('1GH-k_8O65ENIxlyv-EyVL9nd24U6gOmJ');
        $esport = $art('1fhfJakMYRMgOcGaPNsTOwANoNYBklMLL');
        $motion = $art('194oIDgeW1xbUoi73-cHEWeYgsWqNgkNW');

        $rows = [
            [
                'slug' => 'developer-dashboard-template', 'file' => 'dashboard-template.repo',
                'date_label' => 'FEB 2025', 'title' => 'Developer Dashboard Template', 'tag' => 'UI System',
                'year' => '2025', 'role' => 'Design + Frontend', 'client' => 'Open starter', 'duration' => '4 weeks',
                'cover' => $dash, 'video' => 'https://videos.pexels.com/video-files/8480293/8480293-uhd_3840_2160_25fps.mp4',
                'summary' => 'A customizable starter for a readable, responsive dashboard with reusable cards, filters, tables, and dark-theme patterns.',
                'description' => [
                    'Every side project I start seems to need the same three days of work before it needs anything else: a shell, a sidebar, a settings page, a table that does not embarrass itself.',
                    'The interesting constraint was information density. The whole system is built on a 4px vertical rhythm with a "quiet" density preset and a "dense" one.',
                    'It ships dark-first with theming through CSS custom properties, so rebranding a fork for a client demo takes an afternoon instead of a rewrite.',
                ],
                'stack' => ['React', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'Vite', 'Recharts'],
                'highlights' => [['Components', '24'], ['Density modes', '2'], ['Bundle', '48KB gz'], ['License', 'MIT']],
                'gallery' => [
                    ['src' => $dash, 'caption' => 'Dense mode — the analytics desk'],
                    ['src' => $notes, 'caption' => 'Quiet mode — settings and profile'],
                    ['src' => $motion, 'caption' => 'Table system with filter states'],
                ],
                'links' => [['label' => 'Explore the repo', 'href' => '#'], ['label' => 'Live demo', 'href' => '#']],
            ],
            [
                'slug' => 'react-motion-studies', 'file' => 'motion-studies.lab',
                'date_label' => 'APR 2025', 'title' => 'React Motion Studies', 'tag' => 'Motion Lab',
                'year' => '2025', 'role' => 'Developer · Animator', 'client' => 'Personal lab', 'duration' => 'Ongoing',
                'cover' => $motion, 'video' => 'https://videos.pexels.com/video-files/6964235/6964235-hd_1920_1080_25fps.mp4',
                'summary' => 'A living collection of small interaction experiments: scroll behaviors, magnetic elements, staggered micro-animations, and spring-feel explorations.',
                'description' => [
                    'The lab exists because springs are easy to start and hard to finish. Every study isolates exactly one behavior and tunes it until the motion feels like a material property.',
                    'Each study is versioned like an experiment should be: hypothesis, rough pass, tuned pass, and a written note on which constants finally settled and why.',
                    'The lab is where this portfolio gets warmed up — the cursor springs, the rail behaviors, the blur-materialising chips all graduated from studies here.',
                ],
                'stack' => ['Motion', 'React', 'TypeScript', 'CSS', 'View Transitions'],
                'highlights' => [['Studies', '30+'], ['Published demos', '12'], ['FPS floor', '60'], ['Graduated to prod', '7']],
                'gallery' => [
                    ['src' => $motion, 'caption' => 'The spring bench — tuning stiffness'],
                    ['src' => $dash, 'caption' => 'Scroll-coupled rail, study 14'],
                    ['src' => $esport, 'caption' => 'Magnetic target, study 09'],
                ],
                'links' => [['label' => 'Browse the lab', 'href' => '#'], ['label' => 'Study notes', 'href' => '#']],
            ],
            [
                'slug' => 'ai-assisted-development-notes', 'file' => 'ai-dev-notes.md',
                'date_label' => 'JUN 2025', 'title' => 'AI-Assisted Development Notes', 'tag' => 'AI Workflow',
                'year' => '2025', 'role' => 'Researcher · Writer', 'client' => 'Living document', 'duration' => 'Weekly',
                'cover' => $notes, 'video' => 'https://videos.pexels.com/video-files/6804109/6804109-uhd_4096_2160_25fps.mp4',
                'summary' => 'An evolving set of notes on AI workflows: prompt patterns, tooling experiments, and practical guidance for shipping faster without losing quality.',
                'description' => [
                    'Daily building with LLMs produced a pile of habits that worked and a pile that quietly did not. These notes are the archaeology of both.',
                    'The core finding: prompts are not assets, evals are. A pretty prompt without a way to measure its output is a lottery ticket.',
                    'It lives in public as weekly-updated markdown: twenty-six catalogued patterns, the eval harnesses behind them, and honest post-mortems.',
                ],
                'stack' => ['LLM APIs', 'RAG', 'Eval Harnesses', 'Prompt Tooling', 'Python'],
                'highlights' => [['Notes', '120+'], ['Patterns catalogued', '26'], ['Cadence', 'Weekly'], ['Format', 'Markdown']],
                'gallery' => [
                    ['src' => $notes, 'caption' => 'The pattern index, annotated'],
                    ['src' => $dash, 'caption' => 'Eval scorecard for a writeup flow'],
                    ['src' => $motion, 'caption' => 'Tooling experiment log'],
                ],
                'links' => [['label' => 'Read the notes', 'href' => '#'], ['label' => 'Pattern index', 'href' => '#']],
            ],
            [
                'slug' => 'esports-teamplay', 'file' => 'esports-teamplay.log',
                'date_label' => 'ONGOING', 'title' => 'Esports & Teamplay', 'tag' => 'Esports Log',
                'year' => 'ONGOING', 'role' => 'IGL · Sentinel', 'client' => 'Five-stack', 'duration' => 'Ongoing',
                'cover' => $esport, 'video' => 'https://videos.pexels.com/video-files/7914780/7914780-hd_1920_1080_30fps.mp4',
                'summary' => 'Competitive discipline and communication practice: a personal space for teamwork, coordination, strategy breakdowns, and scrims.',
                'description' => [
                    'Esports is where I practice the exact thing my day job keeps asking for: communicating clearly inside a team while everything is on fire.',
                    'The ritual is the point. Every scrim gets logged, every loss gets a VOD review, and the review culture is the same shape as a good engineering retro.',
                    'The strategy documents that come out of those sessions have become their own archive: economy maps, rotation notes, comms frameworks.',
                ],
                'stack' => ['Valorant', 'VOD Review', 'Comms Frameworks', 'Strategy Docs'],
                'highlights' => [['Peak rank', 'Ascendant'], ['Scrims logged', '140+'], ['Stack', '5'], ['Call', 'IGL']],
                'gallery' => [
                    ['src' => $esport, 'caption' => 'Scrims night — post-round debrief'],
                    ['src' => $motion, 'caption' => 'Reaction training off-day'],
                    ['src' => $dash, 'caption' => 'Scrim log dashboard'],
                ],
                'links' => [['label' => 'Match history', 'href' => '#'], ['label' => 'Strategy archive', 'href' => '#']],
            ],
        ];

        foreach ($rows as $i => $row) {
            Quest::updateOrCreate(['slug' => $row['slug']], $row + ['position' => $i]);
        }
    }
}
