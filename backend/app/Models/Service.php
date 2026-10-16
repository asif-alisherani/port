<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
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

    public function toApi(int $i = 0): array
    {
        return [
            'id' => str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT),
            'title' => $this->title,
            'body' => $this->body,
            'icon' => $this->icon,
        ];
    }
}
