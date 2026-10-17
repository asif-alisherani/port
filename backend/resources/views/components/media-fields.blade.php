@props(['item'])

{{--
    Upload UI for cover image, process video and gallery.
    Used by admin/projects/form and admin/quests/form (form must be multipart).
--}}

@php
    $cfg = config('portfolio.uploads');
    $imgAccept = collect(explode(',', $cfg['image_mimes']))->map(fn ($e) => '.' . $e)->implode(',');
    $vidAccept = collect(explode(',', $cfg['video_mimes']))->map(fn ($e) => '.' . $e)->implode(',');
    $imgMb = round($cfg['image_max_kb'] / 1024);
    $vidMb = round($cfg['video_max_kb'] / 1024);

    $coverUrl = $item->coverUrl();
    $videoUrl = $item->videoUrl();
    $gallery = collect($item->gallery ?? [])->filter(fn ($g) => ! empty($g['src']))->values();

    $label = 'font-mono text-[10px] tracking-[.25em] text-neutral-500 uppercase';
    $hintCls = 'font-mono text-[9px] text-neutral-700';
    $drop = 'media-drop relative flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-white/15 bg-black px-4 py-6 text-center transition hover:border-amber-400/60';
@endphp

<div class="mb-5 grid gap-x-8 gap-y-5 md:grid-cols-2">
    {{-- ---------------------------------------------------------- cover --}}
    <div>
        <div class="flex items-baseline justify-between gap-3">
            <span class="{{ $label }}">Cover image @unless ($coverUrl)<span class="text-amber-400"> *</span>@endunless</span>
            <span class="{{ $hintCls }}">{{ strtoupper(str_replace(',', ' · ', $cfg['image_mimes'])) }} · max {{ $imgMb }} MB</span>
        </div>

        <div class="mt-2 overflow-hidden border border-white/10 bg-neutral-950">
            <img data-preview="cover" src="{{ $coverUrl }}" alt=""
                 class="aspect-[4/5] max-h-72 w-full object-cover {{ $coverUrl ? '' : 'hidden' }}">
            <div data-empty="cover" class="{{ $coverUrl ? 'hidden' : '' }} flex aspect-[4/5] max-h-72 w-full items-center justify-center font-mono text-[10px] tracking-[.25em] text-neutral-700 uppercase">
                No cover yet
            </div>
        </div>

        <label class="{{ $drop }} mt-2">
            <input type="file" name="cover_file" accept="{{ $imgAccept }}" class="sr-only" data-single-preview="cover">
            <span class="font-mono text-[10px] tracking-[.25em] text-neutral-300 uppercase">
                {{ $coverUrl ? 'Replace cover' : 'Choose cover image' }}
            </span>
            <span class="text-[11px] text-neutral-600" data-filename="cover">click or drop a file here</span>
        </label>

        @error('cover_file') <p class="mt-1.5 text-xs text-red-400">{{ $message }}</p> @enderror
    </div>

    {{-- ---------------------------------------------------------- video --}}
    <div>
        <div class="flex items-baseline justify-between gap-3">
            <span class="{{ $label }}">Process video</span>
            <span class="{{ $hintCls }}">{{ strtoupper(str_replace(',', ' · ', $cfg['video_mimes'])) }} · max {{ $vidMb }} MB · optional</span>
        </div>

        <div class="mt-2 overflow-hidden border border-white/10 bg-neutral-950">
            <video data-preview="video" src="{{ $videoUrl }}" controls muted playsinline preload="metadata"
                   class="aspect-video w-full bg-black object-contain {{ $videoUrl ? '' : 'hidden' }}"></video>
            <div data-empty="video" class="{{ $videoUrl ? 'hidden' : '' }} flex aspect-video w-full items-center justify-center font-mono text-[10px] tracking-[.25em] text-neutral-700 uppercase">
                No video
            </div>
        </div>

        <label class="{{ $drop }} mt-2">
            <input type="file" name="video_file" accept="{{ $vidAccept }}" class="sr-only" data-single-preview="video">
            <span class="font-mono text-[10px] tracking-[.25em] text-neutral-300 uppercase">
                {{ $videoUrl ? 'Replace video' : 'Choose video' }}
            </span>
            <span class="text-[11px] text-neutral-600" data-filename="video">click or drop a file here</span>
        </label>

        @if ($videoUrl)
            <label class="mt-2 flex items-center gap-2 text-xs text-neutral-400">
                <input type="checkbox" name="remove_video" value="1" class="accent-amber-400" @checked(old('remove_video'))>
                Remove current video
            </label>
        @endif

        @error('video_file') <p class="mt-1.5 text-xs text-red-400">{{ $message }}</p> @enderror
    </div>
</div>

{{-- -------------------------------------------------------------- gallery --}}
<div class="mb-5">
    <div class="flex items-baseline justify-between gap-3">
        <span class="{{ $label }}">Gallery</span>
        <span class="{{ $hintCls }}">reorder with ← →, captions optional · max {{ $imgMb }} MB each</span>
    </div>

    <div data-gallery class="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        @foreach ($gallery as $i => $g)
            <div data-gallery-item class="group flex flex-col border border-white/10 bg-neutral-950">
                <div class="relative">
                    <img src="{{ $item::mediaUrl($g['src']) }}" alt="" class="aspect-[4/3] w-full object-cover">
                    <div class="absolute inset-x-0 top-0 flex justify-between gap-1 p-1.5 opacity-90">
                        <div class="flex gap-1">
                            <button type="button" data-move="-1" title="Move left"  class="bg-black/80 px-2 py-0.5 text-xs text-neutral-200 hover:text-amber-300">←</button>
                            <button type="button" data-move="1"  title="Move right" class="bg-black/80 px-2 py-0.5 text-xs text-neutral-200 hover:text-amber-300">→</button>
                        </div>
                        <button type="button" data-remove title="Remove" class="bg-black/80 px-2 py-0.5 text-xs text-red-300 hover:text-red-400">✕</button>
                    </div>
                </div>
                <input type="hidden" name="gallery[g{{ $i }}][src]" value="{{ $g['src'] }}">
                <input type="text" name="gallery[g{{ $i }}][caption]" value="{{ $g['caption'] ?? '' }}" placeholder="Caption"
                       class="w-full border-t border-white/10 bg-black px-2.5 py-2 text-xs text-neutral-200 outline-none placeholder:text-neutral-700 focus:border-amber-400/70">
            </div>
        @endforeach
    </div>

    <div data-gallery-new class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"></div>

    <label class="{{ $drop }} mt-3">
        <input type="file" name="gallery_new[]" accept="{{ $imgAccept }}" multiple class="sr-only" data-gallery-input>
        <span class="font-mono text-[10px] tracking-[.25em] text-neutral-300 uppercase">Add gallery images</span>
        <span class="text-[11px] text-neutral-600">select or drop one or more images</span>
    </label>

    <p data-gallery-removed class="mt-2 hidden text-xs text-amber-400/80">
        Removed images will be deleted when you save.
    </p>

    @error('gallery_new') <p class="mt-1.5 text-xs text-red-400">{{ $message }}</p> @enderror
    @foreach ($errors->get('gallery_new.*') as $msgs)
        <p class="mt-1.5 text-xs text-red-400">{{ $msgs[0] }}</p>
    @endforeach
</div>

@once
<script>
(() => {
    const form = document.currentScript.closest('form');
    if (!form) return;

    // ---- drag & drop onto any drop zone
    form.querySelectorAll('.media-drop').forEach((zone) => {
        const input = zone.querySelector('input[type=file]');
        ['dragenter', 'dragover'].forEach((ev) => zone.addEventListener(ev, (e) => {
            e.preventDefault(); zone.classList.add('border-amber-400/70', 'bg-amber-400/5');
        }));
        ['dragleave', 'drop'].forEach((ev) => zone.addEventListener(ev, (e) => {
            e.preventDefault(); zone.classList.remove('border-amber-400/70', 'bg-amber-400/5');
        }));
        zone.addEventListener('drop', (e) => {
            if (!e.dataTransfer.files.length) return;
            if (input.multiple) {
                addGalleryFiles([...e.dataTransfer.files]);
            } else {
                const dt = new DataTransfer();
                dt.items.add(e.dataTransfer.files[0]);
                input.files = dt.files;
                input.dispatchEvent(new Event('change'));
            }
        });
    });

    // ---- cover / video live preview
    form.querySelectorAll('[data-single-preview]').forEach((input) => {
        const key = input.dataset.singlePreview;
        input.addEventListener('change', () => {
            const file = input.files[0];
            if (!file) return;
            const preview = form.querySelector(`[data-preview="${key}"]`);
            preview.src = URL.createObjectURL(file);
            preview.classList.remove('hidden');
            form.querySelector(`[data-empty="${key}"]`).classList.add('hidden');
            const size = file.size >= 1048576 ? `${(file.size / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`;
            form.querySelector(`[data-filename="${key}"]`).textContent = `${file.name} · ${size}`;
        });
    });

    // ---- existing gallery: reorder + remove
    const gallery = form.querySelector('[data-gallery]');
    gallery?.addEventListener('click', (e) => {
        const item = e.target.closest('[data-gallery-item]');
        if (!item) return;
        if (e.target.closest('[data-remove]')) {
            item.remove();
            form.querySelector('[data-gallery-removed]').classList.remove('hidden');
        }
        const move = e.target.closest('[data-move]');
        if (move) {
            const dir = Number(move.dataset.move);
            const sibling = dir < 0 ? item.previousElementSibling : item.nextElementSibling;
            if (sibling) dir < 0 ? sibling.before(item) : sibling.after(item);
        }
    });

    // ---- new gallery uploads (kept in a DataTransfer so files can be removed)
    const newInput = form.querySelector('[data-gallery-input]');
    const newWrap = form.querySelector('[data-gallery-new]');
    let pending = [];   // [{file, caption}]

    function addGalleryFiles(files) {
        files.filter((f) => f.type.startsWith('image/'))
             .forEach((file) => pending.push({ file, caption: '' }));
        syncNew();
    }

    function syncNew() {
        const dt = new DataTransfer();
        pending.forEach(({ file }) => dt.items.add(file));
        newInput.files = dt.files;

        newWrap.innerHTML = '';
        pending.forEach((p, i) => {
            const card = document.createElement('div');
            card.className = 'flex flex-col border border-amber-400/30 bg-neutral-950';
            card.innerHTML = `
                <div class="relative">
                    <img class="aspect-[4/3] w-full object-cover" alt="">
                    <span class="absolute left-1.5 top-1.5 bg-amber-400 px-1.5 py-0.5 font-mono text-[9px] tracking-[.2em] text-black uppercase">new</span>
                    <button type="button" title="Remove" class="absolute right-1.5 top-1.5 bg-black/80 px-2 py-0.5 text-xs text-red-300 hover:text-red-400">✕</button>
                </div>
                <input type="text" name="gallery_new_captions[]" placeholder="Caption"
                       class="w-full border-t border-white/10 bg-black px-2.5 py-2 text-xs text-neutral-200 outline-none placeholder:text-neutral-700 focus:border-amber-400/70">`;
            card.querySelector('img').src = URL.createObjectURL(p.file);
            const cap = card.querySelector('input');
            cap.value = p.caption;
            cap.addEventListener('input', () => { p.caption = cap.value; });
            card.querySelector('button').addEventListener('click', () => {
                pending.splice(i, 1);
                syncNew();
            });
            newWrap.appendChild(card);
        });
    }

    newInput?.addEventListener('change', () => {
        // The input's files were replaced by the picker — merge with what we already had.
        const picked = [...newInput.files].filter((f) => !pending.some((p) => p.file === f));
        addGalleryFiles(picked);
    });

    // ---- show progress state on submit (large videos take a moment)
    form.addEventListener('submit', () => {
        const btn = form.querySelector('button:not([type=button])');
        if (btn) { btn.disabled = true; btn.classList.add('opacity-60'); btn.textContent = 'Uploading…'; }
    });
})();
</script>
@endonce
