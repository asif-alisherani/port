<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames((['route', 'item']));

foreach ($attributes->all() as $__key => $__value) {
    if (in_array($__key, $__propNames)) {
        $$__key = $$__key ?? $__value;
    } else {
        $__newAttributes[$__key] = $__value;
    }
}

$attributes = new \Illuminate\View\ComponentAttributeBag($__newAttributes);

unset($__propNames);
unset($__newAttributes);

foreach (array_filter((['route', 'item']), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>

<div class="flex shrink-0 items-center gap-2">
    <a href="<?php echo e(route($route . '.edit', $item)); ?>"
       class="border border-white/10 px-3 py-1.5 font-mono text-[9px] tracking-[.2em] text-neutral-400 uppercase transition hover:border-amber-400/50 hover:text-amber-300">
        Edit
    </a>
    <form method="POST" action="<?php echo e(route($route . '.destroy', $item)); ?>"
          onsubmit="return confirm('Delete this entry permanently?')">
        <?php echo csrf_field(); ?> <?php echo method_field('DELETE'); ?>
        <button class="border border-white/10 px-3 py-1.5 font-mono text-[9px] tracking-[.2em] text-neutral-500 uppercase transition hover:border-red-500/50 hover:text-red-400">
            Delete
        </button>
    </form>
</div>
<?php /**PATH /home/user/sandbox/backend/resources/views/components/row-actions.blade.php ENDPATH**/ ?>