@extends('layouts.admin')
@section('title', $mode === 'create' ? 'New experience' : 'Edit experience')

@section('content')
<form method="POST"
      action="{{ $mode === 'create' ? route($route . '.store') : route($route . '.update', $item) }}"
      class="max-w-2xl">
    @csrf
    @if ($mode === 'edit') @method('PUT') @endif

    <div class="grid gap-x-8 md:grid-cols-2">
        <x-field name="role" label="Role / title" :value="$item->role" hint="e.g. Full-Stack Developer" required />
        <x-field name="company" label="Company" :value="$item->company" required />
    </div>

    <div class="grid gap-x-8 md:grid-cols-2">
        <x-field name="period" label="Period" :value="$item->period" hint="e.g. 2023 — PRESENT" required />
        <x-field name="position" label="Sort order" type="number" :value="$item->position ?? 0" hint="0 = top" />
    </div>

    <x-field name="summary" label="What you did" type="textarea" :rows="4" :value="$item->summary" />
    <x-field name="stack" label="Tech used" type="textarea" :rows="4" :value="$item->stack" hint="one per line" />

    <div class="mb-5">
        <span class="font-mono text-[10px] tracking-[.25em] text-neutral-500 uppercase">Current job</span>
        <label class="mt-2 flex items-center gap-2 text-sm text-neutral-300">
            <input type="hidden" name="is_current" value="0">
            <input type="checkbox" name="is_current" value="1" @checked(old('is_current', $item->is_current)) class="accent-amber-400">
            I work here now (shows the pulsing "On duty" badge)
        </label>
    </div>

    <x-field name="is_published" label="Status" type="checkbox" :value="$item->is_published ?? true" />

    <div class="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
        <button class="bg-amber-400 px-6 py-3 font-mono text-[11px] font-medium tracking-[.3em] text-black uppercase transition hover:bg-amber-300">
            {{ $mode === 'create' ? 'Add experience' : 'Save changes' }}
        </button>
        <a href="{{ route($route . '.index') }}"
           class="px-5 py-3 font-mono text-[10px] tracking-[.25em] text-neutral-500 uppercase transition hover:text-neutral-200">
            Cancel
        </a>
    </div>
</form>
@endsection
