@props([
    'name',
    'label',
    'value' => null,
    'type' => 'text',
    'rows' => 3,
    'hint' => null,
    'required' => false,
])

@php
    $val = old($name, $value);
    if (is_array($val)) {
        $val = in_array($name, ['highlights', 'gallery', 'links'], true)
            ? json_encode($val, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
            : implode("\n", $val);
    }
    $base = 'mt-2 w-full border border-white/10 bg-black px-3 py-2.5 text-sm text-neutral-100 outline-none transition focus:border-amber-400/70 placeholder:text-neutral-700';
@endphp

<div class="mb-5">
    <label for="f-{{ $name }}" class="flex items-baseline justify-between gap-3">
        <span class="font-mono text-[10px] tracking-[.25em] text-neutral-500 uppercase">
            {{ $label }}@if ($required)<span class="text-amber-400"> *</span>@endif
        </span>
        @if ($hint)
            <span class="font-mono text-[9px] text-neutral-700">{{ $hint }}</span>
        @endif
    </label>

    @if ($type === 'textarea')
        <textarea id="f-{{ $name }}" name="{{ $name }}" rows="{{ $rows }}"
                  class="{{ $base }} resize-y font-mono text-xs leading-relaxed">{{ $val }}</textarea>
    @elseif ($type === 'checkbox')
        <label class="mt-2 flex items-center gap-2 text-sm text-neutral-300">
            <input type="hidden" name="{{ $name }}" value="0">
            <input type="checkbox" name="{{ $name }}" value="1" @checked($val) class="accent-amber-400">
            Visible on the site
        </label>
    @else
        <input id="f-{{ $name }}" name="{{ $name }}" type="{{ $type }}" value="{{ $val }}"
               class="{{ $base }}">
    @endif

    @error($name)
        <p class="mt-1.5 text-xs text-red-400">{{ $message }}</p>
    @enderror
</div>
