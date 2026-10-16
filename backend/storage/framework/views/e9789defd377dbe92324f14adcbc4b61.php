<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames((['route', 'title', 'count' => 0]));

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

foreach (array_filter((['route', 'title', 'count' => 0]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>

<div class="mb-6 flex flex-wrap items-center justify-between gap-4">
    <p class="font-mono text-[10px] tracking-[.25em] text-neutral-500 uppercase">
        <?php echo e($count); ?> <?php echo e(\Illuminate\Support\Str::plural('entry', $count)); ?>

    </p>
    <a href="<?php echo e(route($route . '.create')); ?>"
       class="bg-amber-400 px-4 py-2.5 font-mono text-[10px] font-medium tracking-[.25em] text-black uppercase transition hover:bg-amber-300">
        + New <?php echo e(strtolower($title)); ?>

    </a>
</div>
<?php /**PATH /home/user/sandbox/backend/resources/views/components/toolbar.blade.php ENDPATH**/ ?>