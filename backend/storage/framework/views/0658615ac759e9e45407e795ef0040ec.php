<?php $__env->startSection('title', 'Dashboard'); ?>

<?php $__env->startSection('content'); ?>
    <div class="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
        <?php $__currentLoopData = $stats; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $stat): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <a href="<?php echo e($stat['route']); ?>" class="group bg-neutral-950 p-6 transition hover:bg-neutral-900">
                <p class="font-mono text-[10px] tracking-[.25em] text-neutral-500 uppercase"><?php echo e($stat['label']); ?></p>
                <p class="mt-3 text-4xl font-semibold text-amber-300"><?php echo e($stat['value']); ?></p>
                <p class="mt-3 font-mono text-[9px] tracking-[.2em] text-neutral-600 uppercase transition group-hover:text-amber-400/70">
                    Manage →
                </p>
            </a>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </div>

    <h2 class="mt-12 font-mono text-[11px] tracking-[.3em] text-amber-400/90 uppercase">Recent messages</h2>

    <div class="mt-5 border border-white/10">
        <?php $__empty_1 = true; $__currentLoopData = $recent; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $msg): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
            <a href="<?php echo e(route('admin.messages.show', $msg)); ?>"
               class="flex items-center justify-between gap-4 border-b border-white/5 bg-neutral-950 px-5 py-4 transition last:border-0 hover:bg-neutral-900">
                <div class="min-w-0">
                    <p class="truncate text-sm font-medium text-neutral-100">
                        <?php echo e($msg->name); ?>

                        <?php if (! ($msg->read_at)): ?>
                            <span class="ml-2 align-middle text-[9px] tracking-[.2em] text-amber-400 uppercase">● new</span>
                        <?php endif; ?>
                    </p>
                    <p class="mt-1 truncate text-xs text-neutral-500"><?php echo e(\Illuminate\Support\Str::limit($msg->message, 90)); ?></p>
                </div>
                <span class="shrink-0 font-mono text-[10px] text-neutral-600"><?php echo e($msg->created_at->diffForHumans()); ?></span>
            </a>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
            <p class="bg-neutral-950 px-5 py-8 text-center text-sm text-neutral-600">No messages yet.</p>
        <?php endif; ?>
    </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /home/user/sandbox/backend/resources/views/admin/dashboard.blade.php ENDPATH**/ ?>