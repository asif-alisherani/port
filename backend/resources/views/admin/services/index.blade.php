@extends('layouts.admin')
@section('title', 'Service cards — section 01')

@section('content')
    <x-toolbar :route="$route" :title="$title" :count="$items->count()" />

    <div class="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
        @forelse ($items as $item)
            <div class="flex flex-col bg-neutral-950 p-5">
                <div class="flex items-start justify-between gap-3">
                    <span class="font-mono text-[10px] tracking-[.25em] text-amber-400/80 uppercase">{{ $item->icon }}</span>
                    @unless ($item->is_published)
                        <span class="text-[9px] tracking-[.2em] text-neutral-600 uppercase">draft</span>
                    @endunless
                </div>
                <p class="mt-3 font-semibold text-neutral-100">{{ $item->title }}</p>
                <p class="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{{ $item->body }}</p>
                <div class="mt-5 flex items-center justify-between">
                    <span class="font-mono text-[10px] text-neutral-700">#{{ $item->position }}</span>
                    <x-row-actions :route="$route" :item="$item" />
                </div>
            </div>
        @empty
            <p class="bg-neutral-950 px-5 py-10 text-center text-sm text-neutral-600 sm:col-span-2">No cards yet.</p>
        @endforelse
    </div>
@endsection
