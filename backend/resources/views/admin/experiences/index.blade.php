@extends('layouts.admin')
@section('title', 'Experience — section 03')

@section('content')
    <x-toolbar :route="$route" :title="$title" :count="$items->count()" />

    <div class="border border-white/10">
        @forelse ($items as $item)
            <div class="flex items-center gap-4 border-b border-white/5 bg-neutral-950 px-4 py-3.5 last:border-0">
                <span class="h-2 w-2 shrink-0 rounded-full {{ $item->is_current ? 'bg-amber-400 shadow-[0_0_8px_rgba(252,211,77,.6)]' : 'border border-amber-400/50' }}"></span>
                <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-neutral-100">
                        {{ $item->role }}
                        <span class="text-neutral-500">· {{ $item->company }}</span>
                        @if ($item->is_current)
                            <span class="ml-2 border border-amber-400/40 px-1.5 py-0.5 text-[8px] tracking-[.2em] text-amber-300 uppercase">on duty</span>
                        @endif
                        @unless ($item->is_published)
                            <span class="ml-2 text-[9px] tracking-[.2em] text-neutral-600 uppercase">draft</span>
                        @endunless
                    </p>
                    <p class="mt-0.5 font-mono text-[10px] tracking-[.2em] text-neutral-600 uppercase">
                        {{ $item->period }} · {{ implode(', ', $item->stack ?? []) }}
                    </p>
                </div>
                <span class="hidden font-mono text-[10px] text-neutral-700 sm:block">#{{ $item->position }}</span>
                <x-row-actions :route="$route" :item="$item" />
            </div>
        @empty
            <p class="bg-neutral-950 px-5 py-10 text-center text-sm text-neutral-600">No experience yet. The section is hidden on the site until you add one.</p>
        @endforelse
    </div>
@endsection
