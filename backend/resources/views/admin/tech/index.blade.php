@extends('layouts.admin')
@section('title', 'Stack domains — section 04')

@section('content')
    <x-toolbar :route="$route" :title="$title" :count="$items->count()" />

    <div class="border border-white/10">
        @forelse ($items as $item)
            <div class="border-b border-white/5 bg-neutral-950 p-5 last:border-0">
                <div class="flex items-start justify-between gap-4">
                    <div class="min-w-0">
                        <p class="font-semibold text-neutral-100">
                            {{ $item->label }}
                            <span class="ml-2 font-mono text-[10px] tracking-[.2em] text-amber-400/70 uppercase">{{ $item->icon }}</span>
                            @unless ($item->is_published)
                                <span class="ml-2 text-[9px] tracking-[.2em] text-neutral-600 uppercase">draft</span>
                            @endunless
                        </p>
                        <div class="mt-3 flex flex-wrap gap-1.5">
                            @foreach ($item->tools ?? [] as $tool)
                                <span class="border border-white/10 px-2 py-0.5 font-mono text-[10px] text-neutral-400">{{ $tool }}</span>
                            @endforeach
                        </div>
                    </div>
                    <x-row-actions :route="$route" :item="$item" />
                </div>
            </div>
        @empty
            <p class="bg-neutral-950 px-5 py-10 text-center text-sm text-neutral-600">No domains yet.</p>
        @endforelse
    </div>
@endsection
