<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Models\Project;
use App\Models\Quest;
use App\Models\Service;
use App\Models\SocialLink;
use App\Models\TechDomain;
use Illuminate\Support\Facades\Cache;

class ContentController extends Controller
{
    /**
     * Everything the front end needs, in one request.
     * Cached for a minute; every admin write clears the "content" cache tag.
     */
    public function index()
    {
        $payload = Cache::remember('api.content', now()->addMinutes(1), fn () => [
            'services' => Service::published()->ordered()->get()
                ->values()->map(fn ($s, $i) => $s->toApi($i))->all(),

            'projects' => Project::published()->ordered()->get()
                ->map->toApi()->all(),

            'quests' => Quest::published()->ordered()->get()
                ->map->toApi()->all(),

            'experience' => Experience::published()->ordered()->get()
                ->map->toApi()->all(),

            'techDomains' => TechDomain::published()->ordered()->get()
                ->map->toApi()->all(),

            'socialLinks' => SocialLink::published()->ordered()->get()
                ->map->toApi()->all(),
        ]);

        return response()->json($payload)
            ->header('Access-Control-Allow-Origin', '*');
    }
}
