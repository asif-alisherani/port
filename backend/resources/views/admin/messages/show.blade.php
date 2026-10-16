@extends('layouts.admin')
@section('title', 'Message')

@section('content')
<div class="max-w-3xl">
    <a href="{{ route('admin.messages.index') }}"
       class="font-mono text-[10px] tracking-[.25em] text-neutral-500 uppercase transition hover:text-amber-300">
        ← Back to inbox
    </a>

    <div class="mt-5 border border-white/15 bg-neutral-950">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
            <div>
                <p class="font-semibold text-neutral-100">{{ $message->name }}</p>
                <a href="mailto:{{ $message->email }}" class="font-mono text-xs text-amber-400/80 hover:text-amber-300">
                    {{ $message->email }}
                </a>
            </div>
            <span class="font-mono text-[10px] tracking-[.2em] text-neutral-600 uppercase">
                {{ $message->created_at->format('d M Y · H:i') }}
            </span>
        </div>

        <div class="px-6 py-6">
            <p class="text-sm leading-relaxed whitespace-pre-wrap text-neutral-300">{{ $message->message }}</p>
        </div>

        <div class="flex items-center justify-between gap-3 border-t border-white/10 px-6 py-4">
            <span class="font-mono text-[9px] tracking-[.2em] text-neutral-700 uppercase">
                IP {{ $message->ip_address ?? 'unknown' }}
            </span>
            <div class="flex items-center gap-3">
                <a href="mailto:{{ $message->email }}?subject=Re: your message"
                   class="bg-amber-400 px-4 py-2.5 font-mono text-[10px] font-medium tracking-[.25em] text-black uppercase transition hover:bg-amber-300">
                    Reply
                </a>
                <form method="POST" action="{{ route('admin.messages.destroy', $message) }}"
                      onsubmit="return confirm('Delete this message?')">
                    @csrf @method('DELETE')
                    <button class="border border-white/10 px-4 py-2.5 font-mono text-[10px] tracking-[.25em] text-neutral-500 uppercase transition hover:border-red-500/50 hover:text-red-400">
                        Delete
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
