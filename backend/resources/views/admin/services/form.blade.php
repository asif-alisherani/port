@extends('layouts.admin')
@section('title', $mode === 'create' ? 'New service card' : 'Edit service card')

@section('content')
<form method="POST"
      action="{{ $mode === 'create' ? route($route . '.store') : route($route . '.update', $item) }}"
      class="max-w-2xl">
    @csrf
    @if ($mode === 'edit') @method('PUT') @endif

    <x-field name="title" label="Title" :value="$item->title" required />
    <x-field name="body"  label="Body"  type="textarea" :rows="3" :value="$item->body" required />

    <div class="grid gap-x-8 md:grid-cols-2">
        <x-field name="icon" label="Icon key" :value="$item->icon ?? 'cube'"
                 hint="cube · database · mobile · brain · code · sparkles" required />
        <x-field name="position" label="Sort order" type="number" :value="$item->position ?? 0" />
    </div>

    <div class="mb-6 border border-white/10 bg-neutral-950 p-4">
        <p class="font-mono text-[10px] tracking-[.25em] text-neutral-500 uppercase">Available icons</p>
        <p class="mt-2 font-mono text-xs leading-relaxed text-neutral-400">
            cube, database, mobile, brain, code, sparkles, layers, terminal, chart, shield
        </p>
    </div>

    <x-field name="is_published" label="Status" type="checkbox" :value="$item->is_published ?? true" />

    <div class="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
        <button class="bg-amber-400 px-6 py-3 font-mono text-[11px] font-medium tracking-[.3em] text-black uppercase transition hover:bg-amber-300">
            {{ $mode === 'create' ? 'Create card' : 'Save changes' }}
        </button>
        <a href="{{ route($route . '.index') }}"
           class="px-5 py-3 font-mono text-[10px] tracking-[.25em] text-neutral-500 uppercase transition hover:text-neutral-200">
            Cancel
        </a>
    </div>
</form>
@endsection
