<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $guarded = [];

    protected $casts = [
        'description' => 'array',
        'stack' => 'array',
        'highlights' => 'array',
        'gallery' => 'array',
        'links' => 'array',
        'is_published' => 'boolean',
    ];

    public function scopePublished(Builder $q): Builder
    {
        return $q->where('is_published', true);
    }

    public function scopeOrdered(Builder $q): Builder
    {
        return $q->orderBy('position')->orderBy('id');
    }

    /** Shape consumed by the React front end. */
    public function toApi(): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'tag' => $this->tag,
            'year' => $this->year,
            'role' => $this->role,
            'client' => $this->client,
            'duration' => $this->duration,
            'summary' => $this->summary,
            'cover' => $this->cover,
            'video' => $this->video,
            'description' => $this->description ?? [],
            'stack' => $this->stack ?? [],
            'highlights' => $this->highlights ?? [],
            'gallery' => $this->gallery ?? [],
            'links' => $this->links ?? [],
        ];
    }
}
