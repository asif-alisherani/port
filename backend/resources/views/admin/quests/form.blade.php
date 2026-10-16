@extends('layouts.admin')
@section('title', $mode === 'create' ? 'New side quest' : 'Edit side quest')

@section('content')
<form method="POST"
      action="{{ $mode === 'create' ? route($route . '.store') : route($route . '.update', $item) }}"
      class="max-w-4xl">
    @csrf
    @if ($mode === 'edit') @method('PUT') @endif

    <div class="grid gap-x-8 md:grid-cols-2">
        <x-field name="title"      label="Title"      :value="$item->title" required />
        <x-field name="slug"       label="Slug"       :value="$item->slug" hint="url: #/quest/<slug>" required />
        <x-field name="file"       label="File name"  :value="$item->file" hint="motion-studies.lab" required />
        <x-field name="date_label" label="Date label" :value="$item->date_label" hint="APR 2025 / ONGOING" required />
        <x-field name="tag"        label="Tag"        :value="$item->tag" hint="Motion Lab, UI System…" required />
        <x-field name="year"       label="Year"       :value="$item->year" />
        <x-field name="role"       label="Role"       :value="$item->role" />
        <x-field name="client"     label="Client"     :value="$item->client" />
        <x-field name="duration"   label="Timeline"   :value="$item->duration" />
        <x-field name="position"   label="Sort order" type="number" :value="$item->position ?? 0" />
    </div>

    <x-field name="summary" label="Summary" type="textarea" :rows="2" :value="$item->summary" />

    <div class="grid gap-x-8 md:grid-cols-2">
        <x-field name="cover" label="Cover image URL" :value="$item->cover" required />
        <x-field name="video" label="Process video URL" :value="$item->video" hint="mp4" />
    </div>

    <x-field name="description" label="Description" type="textarea" :rows="8" :value="$item->description"
             hint="one paragraph per line" />
    <x-field name="stack" label="Stack & tools" type="textarea" :rows="5" :value="$item->stack"
             hint="one tool per line" />
    <x-field name="highlights" label="Highlights (JSON)" type="textarea" :rows="6" :value="$item->highlights"
             hint='[["Studies","30+"],["FPS floor","60"]]' />
    <x-field name="gallery" label="Gallery (JSON)" type="textarea" :rows="7" :value="$item->gallery"
             hint='[{"src":"https://…","caption":"…"}]' />
    <x-field name="links" label="Links (JSON)" type="textarea" :rows="5" :value="$item->links"
             hint='[{"label":"Browse the lab","href":"https://…"}]' />

    <x-field name="is_published" label="Status" type="checkbox" :value="$item->is_published ?? true" />

    <div class="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
        <button class="bg-amber-400 px-6 py-3 font-mono text-[11px] font-medium tracking-[.3em] text-black uppercase transition hover:bg-amber-300">
            {{ $mode === 'create' ? 'Create quest' : 'Save changes' }}
        </button>
        <a href="{{ route($route . '.index') }}"
           class="px-5 py-3 font-mono text-[10px] tracking-[.25em] text-neutral-500 uppercase transition hover:text-neutral-200">
            Cancel
        </a>
    </div>
</form>
@endsection
