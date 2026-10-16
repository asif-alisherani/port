<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class SocialLink extends Model
{
    protected $guarded = [];

    protected $casts = ['is_published' => 'boolean'];

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
        return ['label' => $this->label, 'href' => $this->url];
    }
}
