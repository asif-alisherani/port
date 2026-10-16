@props(['route', 'item'])

<div class="flex shrink-0 items-center gap-2">
    <a href="{{ route($route . '.edit', $item) }}"
       class="border border-white/10 px-3 py-1.5 font-mono text-[9px] tracking-[.2em] text-neutral-400 uppercase transition hover:border-amber-400/50 hover:text-amber-300">
        Edit
    </a>
    <form method="POST" action="{{ route($route . '.destroy', $item) }}"
          onsubmit="return confirm('Delete this entry permanently?')">
        @csrf @method('DELETE')
        <button class="border border-white/10 px-3 py-1.5 font-mono text-[9px] tracking-[.2em] text-neutral-500 uppercase transition hover:border-red-500/50 hover:text-red-400">
            Delete
        </button>
    </form>
</div>
