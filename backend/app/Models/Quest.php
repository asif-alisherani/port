<?php

namespace App\Models;

use App\Models\Concerns\HasMedia;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Quest extends Model
{
    use HasMedia;

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

    public function toApi(): array
    {
        return [
            'slug' => $this->slug,
            'file' => $this->file,
            'date' => $this->date_label,
            'title' => $this->title,
            'tag' => $this->tag,
            'year' => $this->year,
            'role' => $this->role,
            'client' => $this->client,
            'duration' => $this->duration,
            'summary' => $this->summary,
            'cover' => $this->coverUrl(),
            'video' => $this->videoUrl(),
            'description' => $this->description ?? [],
            'stack' => $this->stack ?? [],
            'highlights' => $this->highlights ?? [],
            'gallery' => $this->galleryUrls(),
            'links' => $this->links ?? [],
        ];
    }
}
