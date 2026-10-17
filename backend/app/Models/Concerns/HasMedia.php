<?php

namespace App\Models\Concerns;

use Illuminate\Support\Facades\Storage;

/**
 * Turns a stored media value into a browser-ready URL.
 *
 * Stored values are either:
 *  - a path on the media disk, e.g. "uploads/projects/covers/abc.jpg" (admin uploads), or
 *  - a full external URL (legacy / seeded content) — returned untouched.
 */
trait HasMedia
{
    public static function mediaUrl(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (preg_match('#^(https?:)?//#i', $value) || str_starts_with($value, 'data:')) {
            return $value;
        }

        $disk = config('portfolio.uploads.disk', 'public');

        // Local public disk: build the URL from the current request host.
        if ($disk === 'public') {
            return asset('storage/' . ltrim($value, '/'));
        }

        // Cloud disk (s3/R2/…): AWS_URL + path.
        return Storage::disk($disk)->url($value);
    }

    public function coverUrl(): ?string
    {
        return static::mediaUrl($this->cover);
    }

    public function videoUrl(): ?string
    {
        return static::mediaUrl($this->video);
    }

    /** Gallery with every src resolved to a URL. */
    public function galleryUrls(): array
    {
        return collect($this->gallery ?? [])
            ->map(fn ($g) => [
                'src' => static::mediaUrl($g['src'] ?? null),
                'caption' => $g['caption'] ?? '',
            ])
            ->filter(fn ($g) => $g['src'])
            ->values()
            ->all();
    }
}
