@extends('layouts.admin')
@section('title', 'Messages')

@section('content')
    <div class="border border-white/10">
        @forelse ($messages as $msg)
            <a href="{{ route('admin.messages.show', $msg) }}"
               class="flex items-center justify-between gap-4 border-b border-white/5 bg-neutral-950 px-5 py-4 transition last:border-0 hover:bg-neutral-900">
                <div class="min-w-0">
                    <p class="truncate text-sm font-medium text-neutral-100">
                        {{ $msg->name }}
                        <span class="ml-1 font-mono text-[11px] text-neutral-600">&lt;{{ $msg->email }}&gt;</span>
                        @unless ($msg->read_at)
                            <span class="ml-2 align-middle text-[9px] tracking-[.2em] text-amber-400 uppercase">● new</span>
                        @endunless
                    </p>
                    <p class="mt-1 truncate text-xs text-neutral-500">{{ \Illuminate\Support\Str::limit($msg->message, 120) }}</p>
                </div>
                <span class="shrink-0 font-mono text-[10px] text-neutral-600">{{ $msg->created_at->diffForHumans() }}</span>
            </a>
        @empty
            <p class="bg-neutral-950 px-5 py-10 text-center text-sm text-neutral-600">Inbox empty.</p>
        @endforelse
    </div>

    @if (!$messages->onFirstPage() || $messages->hasMorePages())
        <div class="mt-6 flex items-center justify-end gap-3">
            @if (!$messages->onFirstPage() && $messages->previousPageUrl())
                <a href="{{ $messages->previousPageUrl() }}"
                   class="border border-white/10 px-4 py-2 font-mono text-[10px] tracking-[.2em] text-neutral-400 transition hover:border-amber-400/50 hover:text-amber-300 uppercase">
                    ← Newer
                </a>
            @endif
            @if ($messages->hasMorePages() && $messages->nextPageUrl())
                <a href="{{ $messages->nextPageUrl() }}"
                   class="border border-white/10 px-4 py-2 font-mono text-[10px] tracking-[.2em] text-neutral-400 transition hover:border-amber-400/50 hover:text-amber-300 uppercase">
                    Older →
                </a>
            @endif
        </div>
    @endif
@endsection
