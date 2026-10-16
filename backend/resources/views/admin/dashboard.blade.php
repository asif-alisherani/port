@extends('layouts.admin')
@section('title', 'Dashboard')

@section('content')
    <div class="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
        @foreach ($stats as $stat)
            <a href="{{ $stat['route'] }}" class="group bg-neutral-950 p-6 transition hover:bg-neutral-900">
                <p class="font-mono text-[10px] tracking-[.25em] text-neutral-500 uppercase">{{ $stat['label'] }}</p>
                <p class="mt-3 text-4xl font-semibold text-amber-300">{{ $stat['value'] }}</p>
                <p class="mt-3 font-mono text-[9px] tracking-[.2em] text-neutral-600 uppercase transition group-hover:text-amber-400/70">
                    Manage →
                </p>
            </a>
        @endforeach
    </div>

    <h2 class="mt-12 font-mono text-[11px] tracking-[.3em] text-amber-400/90 uppercase">Recent messages</h2>

    <div class="mt-5 border border-white/10">
        @forelse ($recent as $msg)
            <a href="{{ route('admin.messages.show', $msg) }}"
               class="flex items-center justify-between gap-4 border-b border-white/5 bg-neutral-950 px-5 py-4 transition last:border-0 hover:bg-neutral-900">
                <div class="min-w-0">
                    <p class="truncate text-sm font-medium text-neutral-100">
                        {{ $msg->name }}
                        @unless ($msg->read_at)
                            <span class="ml-2 align-middle text-[9px] tracking-[.2em] text-amber-400 uppercase">● new</span>
                        @endunless
                    </p>
                    <p class="mt-1 truncate text-xs text-neutral-500">{{ \Illuminate\Support\Str::limit($msg->message, 90) }}</p>
                </div>
                <span class="shrink-0 font-mono text-[10px] text-neutral-600">{{ $msg->created_at->diffForHumans() }}</span>
            </a>
        @empty
            <p class="bg-neutral-950 px-5 py-8 text-center text-sm text-neutral-600">No messages yet.</p>
        @endforelse
    </div>
@endsection
