@extends('layouts.admin')
@section('title', $mode === 'create' ? 'New stack domain' : 'Edit stack domain')

@section('content')
<form method="POST"
      action="{{ $mode === 'create' ? route($route . '.store') : route($route . '.update', $item) }}"
      class="max-w-2xl">
    @csrf
    @if ($mode === 'edit') @method('PUT') @endif

    <div class="grid gap-x-8 md:grid-cols-2">
        <x-field name="label" label="Domain label" :value="$item->label" hint="Frontend, Backend, AI / ML…" required />
        <x-field name="icon"  label="Icon key"     :value="$item->icon ?? 'code'"
                 hint="code · database · chart · sparkles · mobile" required />
    </div>

    <x-field name="tools" label="Tools" type="textarea" :rows="8" :value="$item->tools"
             hint="one tool per line" />

    <x-field name="position" label="Sort order" type="number" :value="$item->position ?? 0" />
    <x-field name="is_published" label="Status" type="checkbox" :value="$item->is_published ?? true" />

    <div class="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
        <button class="bg-amber-400 px-6 py-3 font-mono text-[11px] font-medium tracking-[.3em] text-black uppercase transition hover:bg-amber-300">
            {{ $mode === 'create' ? 'Create domain' : 'Save changes' }}
        </button>
        <a href="{{ route($route . '.index') }}"
           class="px-5 py-3 font-mono text-[10px] tracking-[.25em] text-neutral-500 uppercase transition hover:text-neutral-200">
            Cancel
        </a>
    </div>
</form>
@endsection
