<?php

namespace App\Http\Controllers\Admin\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * File uploads for cover image, process video and gallery images.
 *
 * Form fields:
 *   cover_file              image (required when the entry has no cover yet)
 *   video_file              mp4 / webm
 *   remove_video            checkbox
 *   gallery[key][src]       existing gallery items to keep (in display order)
 *   gallery[key][caption]
 *   gallery_new[]           new images, appended after existing ones
 *   gallery_new_captions[]  captions aligned with gallery_new[]
 */
trait ManagesMedia
{
    /** Folder under uploads/, e.g. "projects" or "quests". */
    abstract protected function mediaFolder(): string;

    protected function mediaRules(?Model $item = null): array
    {
        $cfg = config('portfolio.uploads');
        $image = ['image', 'mimes:' . $cfg['image_mimes'], 'max:' . $cfg['image_max_kb']];

        return [
            'cover_file' => array_merge([$item?->cover ? 'nullable' : 'required'], $image),
            'video_file' => ['nullable', 'file', 'mimes:' . $cfg['video_mimes'], 'max:' . $cfg['video_max_kb']],
            'remove_video' => ['nullable', 'boolean'],
            'gallery' => ['nullable', 'array'],
            'gallery.*.src' => ['required', 'string', 'max:500'],
            'gallery.*.caption' => ['nullable', 'string', 'max:300'],
            'gallery_new' => ['nullable', 'array', 'max:30'],
            'gallery_new.*' => $image,
            'gallery_new_captions' => ['nullable', 'array'],
            'gallery_new_captions.*' => ['nullable', 'string', 'max:300'],
        ];
    }

    protected function mediaMessages(): array
    {
        return [
            'cover_file.required' => 'Please upload a cover image.',
            'video_file.mimes' => 'The video must be an MP4 or WebM file.',
            'gallery_new.*.image' => 'Every gallery file must be an image.',
            'gallery_new.*.max' => 'Each gallery image may not be larger than :max KB.',
        ];
    }

    /** Called by ResourceController before create/update. */
    protected function beforeSave(Request $request, array $data, ?Model $item = null): array
    {
        $folder = 'uploads/' . $this->mediaFolder();
        $garbage = [];

        // ---- cover
        if ($request->hasFile('cover_file')) {
            $data['cover'] = $this->storeUpload($request->file('cover_file'), "$folder/covers");
            $garbage[] = $item?->cover;
        }

        // ---- video
        if ($request->hasFile('video_file')) {
            $data['video'] = $this->storeUpload($request->file('video_file'), "$folder/videos");
            $garbage[] = $item?->video;
        } elseif ($request->boolean('remove_video')) {
            $data['video'] = null;
            $garbage[] = $item?->video;
        }

        // ---- gallery: keep only items that already belonged to this entry
        $old = collect($item?->gallery ?? []);
        $known = $old->pluck('src')->filter()->all();

        $gallery = collect($request->input('gallery', []))
            ->filter(fn ($g) => is_array($g) && in_array($g['src'] ?? null, $known, true))
            ->map(fn ($g) => ['src' => $g['src'], 'caption' => trim((string) ($g['caption'] ?? ''))])
            ->values();

        $captions = $request->input('gallery_new_captions', []);
        foreach ($request->file('gallery_new', []) as $i => $file) {
            $gallery->push([
                'src' => $this->storeUpload($file, "$folder/gallery"),
                'caption' => trim((string) ($captions[$i] ?? '')),
            ]);
        }

        $data['gallery'] = $gallery->all();
        $kept = $gallery->pluck('src')->all();
        $garbage = array_merge($garbage, array_diff($known, $kept));

        unset($data['cover_file'], $data['video_file'], $data['remove_video'],
              $data['gallery_new'], $data['gallery_new_captions']);

        // Delete replaced files only after the new ones are safely stored.
        $this->pendingDeletes = array_filter($garbage);

        return $data;
    }

    protected array $pendingDeletes = [];

    /** Called by ResourceController after a successful save. */
    protected function afterSave(Model $item): void
    {
        $this->deleteLocalMedia($this->pendingDeletes);
        $this->pendingDeletes = [];
    }

    /** Called by ResourceController after delete. */
    protected function afterDelete(Model $item): void
    {
        $this->deleteLocalMedia(array_merge(
            [$item->cover, $item->video],
            collect($item->gallery ?? [])->pluck('src')->all(),
        ));
    }

    private function storeUpload(UploadedFile $file, string $dir): string
    {
        return $file->store($dir, config('portfolio.uploads.disk'));
    }

    /** Remove files we own (paths under uploads/); external URLs are ignored. */
    private function deleteLocalMedia(array $values): void
    {
        $disk = Storage::disk(config('portfolio.uploads.disk'));

        foreach (array_filter($values) as $value) {
            if (str_starts_with($value, 'uploads/') && ! str_contains($value, '..')) {
                $disk->delete($value);
            }
        }
    }
}
