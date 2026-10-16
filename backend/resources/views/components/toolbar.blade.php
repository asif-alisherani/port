@props(['route', 'title', 'count' => 0])

<div class="mb-6 flex flex-wrap items-center justify-between gap-4">
    <p class="font-mono text-[10px] tracking-[.25em] text-neutral-500 uppercase">
        {{ $count }} {{ \Illuminate\Support\Str::plural('entry', $count) }}
    </p>
    <a href="{{ route($route . '.create') }}"
       class="bg-amber-400 px-4 py-2.5 font-mono text-[10px] font-medium tracking-[.25em] text-black uppercase transition hover:bg-amber-300">
        + New {{ strtolower($title) }}
    </a>
</div>
