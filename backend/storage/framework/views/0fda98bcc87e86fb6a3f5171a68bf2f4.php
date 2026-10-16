<?php $__env->startSection('title', 'Projects'); ?>

<?php $__env->startSection('content'); ?>
    <?php if (isset($component)) { $__componentOriginald3004b9ddb69238e6c95f297222269db = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginald3004b9ddb69238e6c95f297222269db = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.toolbar','data' => ['route' => $route,'title' => $title,'count' => $items->count()]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('toolbar'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['route' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($route),'title' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($title),'count' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($items->count())]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginald3004b9ddb69238e6c95f297222269db)): ?>
<?php $attributes = $__attributesOriginald3004b9ddb69238e6c95f297222269db; ?>
<?php unset($__attributesOriginald3004b9ddb69238e6c95f297222269db); ?>
<?php endif; ?>
<?php if (isset($__componentOriginald3004b9ddb69238e6c95f297222269db)): ?>
<?php $component = $__componentOriginald3004b9ddb69238e6c95f297222269db; ?>
<?php unset($__componentOriginald3004b9ddb69238e6c95f297222269db); ?>
<?php endif; ?>

    <div class="border border-white/10">
        <?php $__empty_1 = true; $__currentLoopData = $items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
            <div class="flex items-center gap-4 border-b border-white/5 bg-neutral-950 px-4 py-3.5 last:border-0">
                <?php if($item->cover): ?>
                    <img src="<?php echo e($item->cover); ?>" alt="" class="h-14 w-11 shrink-0 object-cover">
                <?php endif; ?>
                <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-neutral-100">
                        <?php echo e($item->title); ?>

                        <?php if (! ($item->is_published)): ?>
                            <span class="ml-2 text-[9px] tracking-[.2em] text-neutral-600 uppercase">draft</span>
                        <?php endif; ?>
                    </p>
                    <p class="mt-0.5 font-mono text-[10px] tracking-[.2em] text-neutral-600 uppercase">
                        <?php echo e($item->tag); ?> · <?php echo e($item->year); ?> · /<?php echo e($item->slug); ?>

                    </p>
                </div>
                <span class="hidden font-mono text-[10px] text-neutral-700 sm:block">#<?php echo e($item->position); ?></span>
                <?php if (isset($component)) { $__componentOriginal46b3bac9d56bec6271aaffa668486026 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal46b3bac9d56bec6271aaffa668486026 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.row-actions','data' => ['route' => $route,'item' => $item]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('row-actions'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['route' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($route),'item' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($item)]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal46b3bac9d56bec6271aaffa668486026)): ?>
<?php $attributes = $__attributesOriginal46b3bac9d56bec6271aaffa668486026; ?>
<?php unset($__attributesOriginal46b3bac9d56bec6271aaffa668486026); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal46b3bac9d56bec6271aaffa668486026)): ?>
<?php $component = $__componentOriginal46b3bac9d56bec6271aaffa668486026; ?>
<?php unset($__componentOriginal46b3bac9d56bec6271aaffa668486026); ?>
<?php endif; ?>
            </div>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
            <p class="bg-neutral-950 px-5 py-10 text-center text-sm text-neutral-600">No projects yet.</p>
        <?php endif; ?>
    </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /home/user/sandbox/backend/resources/views/admin/projects/index.blade.php ENDPATH**/ ?>