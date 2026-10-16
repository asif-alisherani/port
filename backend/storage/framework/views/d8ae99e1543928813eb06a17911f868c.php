<!doctype html>
<html lang="en" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo $__env->yieldContent('title', 'Admin'); ?> — Portfolio Control</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: { extend: { fontFamily: {
                sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            } } }
        }
    </script>
</head>
<body class="min-h-screen bg-black font-sans text-neutral-200 antialiased">

<?php
    $nav = [
        ['admin.dashboard',        'Dashboard',     'admin'],
        ['admin.projects.index',   'Projects',      'admin/projects'],
        ['admin.quests.index',     'Side quests',   'admin/quests'],
        ['admin.services.index',   'Service cards', 'admin/services'],
        ['admin.tech-domains.index','Stack',        'admin/tech-domains'],
        ['admin.links.index',      'Links',         'admin/links'],
        ['admin.messages.index',   'Messages',      'admin/messages'],
    ];
?>

<div class="flex min-h-screen">
    
    <aside class="hidden w-60 shrink-0 border-r border-white/10 bg-neutral-950 lg:block">
        <div class="flex items-center gap-2.5 border-b border-white/10 px-5 py-4">
            <svg viewBox="0 0 32 32" class="h-5 w-5">
                <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(252,211,77,.55)" stroke-width="2"/>
                <circle cx="16" cy="16" r="5" fill="#fcd34d"/>
            </svg>
            <span class="font-mono text-[11px] tracking-[.3em] text-neutral-100">ASA<span class="text-amber-400">.</span></span>
        </div>

        <nav class="p-3">
            <?php $__currentLoopData = $nav; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as [$route, $label, $prefix]): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <?php $active = request()->is($prefix) || request()->is($prefix.'/*'); ?>
                <a href="<?php echo e(route($route)); ?>"
                   class="mb-1 flex items-center justify-between rounded px-3 py-2.5 font-mono text-[10px] tracking-[.2em] uppercase transition
                          <?php echo e($active ? 'bg-amber-400/10 text-amber-300' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-200'); ?>">
                    <?php echo e($label); ?>

                    <?php if($label === 'Messages' && ($unread = \App\Models\ContactMessage::unread()->count())): ?>
                        <span class="rounded-full bg-amber-400 px-1.5 text-[9px] font-bold text-black"><?php echo e($unread); ?></span>
                    <?php endif; ?>
                </a>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </nav>

        <div class="mt-auto p-3">
            <a href="<?php echo e(config('portfolio.frontend_url')); ?>" target="_blank"
               class="block rounded border border-white/10 px-3 py-2.5 text-center font-mono text-[10px] tracking-[.2em] text-neutral-400 uppercase transition hover:border-amber-400/50 hover:text-amber-300">
                View site ↗
            </a>
        </div>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
        
        <header class="flex items-center justify-between border-b border-white/10 bg-neutral-950/70 px-5 py-3.5 backdrop-blur md:px-8">
            <h1 class="font-semibold tracking-tight text-neutral-100"><?php echo $__env->yieldContent('title', 'Dashboard'); ?></h1>
            <form method="POST" action="<?php echo e(route('logout')); ?>">
                <?php echo csrf_field(); ?>
                <button class="font-mono text-[10px] tracking-[.25em] text-neutral-500 uppercase transition hover:text-amber-300">
                    Sign out
                </button>
            </form>
        </header>

        <main class="flex-1 p-5 md:p-8">
            <?php if(session('status')): ?>
                <div class="mb-6 border border-amber-400/40 bg-amber-400/10 px-4 py-3 font-mono text-[11px] tracking-[.15em] text-amber-200 uppercase">
                    <?php echo e(session('status')); ?>

                </div>
            <?php endif; ?>

            <?php if($errors->any()): ?>
                <div class="mb-6 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    <p class="mb-1 font-mono text-[10px] tracking-[.2em] uppercase">Fix these fields</p>
                    <ul class="list-inside list-disc">
                        <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?><li><?php echo e($error); ?></li><?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </ul>
                </div>
            <?php endif; ?>

            <?php echo $__env->yieldContent('content'); ?>
        </main>
    </div>
</div>

</body>
</html>
<?php /**PATH /home/user/sandbox/backend/resources/views/layouts/admin.blade.php ENDPATH**/ ?>