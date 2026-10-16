@extends('layouts.admin')
@section('title', 'Links — footer & contact')

@section('content')
    <x-toolbar :route="$route" :title="$title" :count="$items->count()" />

    <div class="border border-white/10">
        @forelse ($items as $item)
            <div class="flex items-center gap-4 border-b border-white/5 bg-neutral-950 px-4 py-3.5 last:border-0">
                <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-neutral-100">
                        {{ $item->label }}
                        @unless ($item->is_published)
                            <span class="ml-2 text-[9px] tracking-[.2em] text-neutral-600 uppercase">hidden</span>
                        @endunless
                    </p>
                    <p class="mt-0.5 truncate font-mono text-[11px] text-neutral-600">{{ $item->url }}</p>
                </div>
                <span class="hidden font-mono text-[10px] text-neutral-700 sm:block">#{{ $item->position }}</span>
                <x-row-actions :route="$route" :item="$item" />
            </div>
        @empty
            <p class="bg-neutral-950 px-5 py-10 text-center text-sm text-neutral-600">No links yet.</p>
        @endforelse
    </div>
@endsection
