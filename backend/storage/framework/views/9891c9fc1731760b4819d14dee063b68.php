<?php $__env->startSection('title', 'Messages'); ?>

<?php $__env->startSection('content'); ?>
    <div class="border border-white/10">
        <?php $__empty_1 = true; $__currentLoopData = $messages; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $msg): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
            <a href="<?php echo e(route('admin.messages.show', $msg)); ?>"
               class="flex items-center justify-between gap-4 border-b border-white/5 bg-neutral-950 px-5 py-4 transition last:border-0 hover:bg-neutral-900">
                <div class="min-w-0">
                    <p class="truncate text-sm font-medium text-neutral-100">
                        <?php echo e($msg->name); ?>

                        <span class="ml-1 font-mono text-[11px] text-neutral-600">&lt;<?php echo e($msg->email); ?>&gt;</span>
                        <?php if (! ($msg->read_at)): ?>
                            <span class="ml-2 align-middle text-[9px] tracking-[.2em] text-amber-400 uppercase">● new</span>
                        <?php endif; ?>
                    </p>
                    <p class="mt-1 truncate text-xs text-neutral-500"><?php echo e(\Illuminate\Support\Str::limit($msg->message, 120)); ?></p>
                </div>
                <span class="shrink-0 font-mono text-[10px] text-neutral-600"><?php echo e($msg->created_at->diffForHumans()); ?></span>
            </a>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
            <p class="bg-neutral-950 px-5 py-10 text-center text-sm text-neutral-600">Inbox empty.</p>
        <?php endif; ?>
    </div>

    <?php if(!$messages->onFirstPage() || $messages->hasMorePages()): ?>
        <div class="mt-6 flex items-center justify-end gap-3">
            <?php if(!$messages->onFirstPage() && $messages->previousPageUrl()): ?>
                <a href="<?php echo e($messages->previousPageUrl()); ?>"
                   class="border border-white/10 px-4 py-2 font-mono text-[10px] tracking-[.2em] text-neutral-400 transition hover:border-amber-400/50 hover:text-amber-300 uppercase">
                    ← Newer
                </a>
            <?php endif; ?>
            <?php if($messages->hasMorePages() && $messages->nextPageUrl()): ?>
                <a href="<?php echo e($messages->nextPageUrl()); ?>"
                   class="border border-white/10 px-4 py-2 font-mono text-[10px] tracking-[.2em] text-neutral-400 transition hover:border-amber-400/50 hover:text-amber-300 uppercase">
                    Older →
                </a>
            <?php endif; ?>
        </div>
    <?php endif; ?>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /home/user/sandbox/backend/resources/views/admin/messages/index.blade.php ENDPATH**/ ?>