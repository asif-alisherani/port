<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Project;
use App\Models\Quest;
use App\Models\Service;
use App\Models\SocialLink;
use App\Models\TechDomain;

class DashboardController extends Controller
{
    public function index()
    {
        return view('admin.dashboard', [
            'stats' => [
                ['label' => 'Projects', 'value' => Project::count(), 'route' => route('admin.projects.index')],
                ['label' => 'Side quests', 'value' => Quest::count(), 'route' => route('admin.quests.index')],
                ['label' => 'Service cards', 'value' => Service::count(), 'route' => route('admin.services.index')],
                ['label' => 'Stack domains', 'value' => TechDomain::count(), 'route' => route('admin.tech-domains.index')],
                ['label' => 'Links', 'value' => SocialLink::count(), 'route' => route('admin.links.index')],
                ['label' => 'Unread messages', 'value' => ContactMessage::unread()->count(), 'route' => route('admin.messages.index')],
            ],
            'recent' => ContactMessage::latest()->take(5)->get(),
        ]);
    }
}
