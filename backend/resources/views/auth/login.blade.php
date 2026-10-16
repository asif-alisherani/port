<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sign in — Portfolio Control</title>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="grid min-h-screen place-items-center bg-black px-4 font-['Space_Grotesk'] text-neutral-200">

<div class="w-full max-w-sm">
    <div class="mb-8 flex items-center gap-3">
        <svg viewBox="0 0 32 32" class="h-7 w-7">
            <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(252,211,77,.55)" stroke-width="2"/>
            <circle cx="16" cy="16" r="5" fill="#fcd34d"/>
        </svg>
        <span class="font-['JetBrains_Mono'] text-xs tracking-[.3em] text-neutral-100">PORTFOLIO CONTROL</span>
    </div>

    <div class="border border-white/15 bg-neutral-950 p-7">
        <h1 class="text-2xl font-semibold tracking-tight">Sign in<span class="text-amber-400">.</span></h1>
        <p class="mt-2 text-sm text-neutral-500">Admin access to the content deck.</p>

        @if ($errors->any())
            <p class="mt-5 border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {{ $errors->first() }}
            </p>
        @endif

        <form method="POST" action="{{ route('login') }}" class="mt-6 space-y-4">
            @csrf
            <div>
                <label class="font-['JetBrains_Mono'] text-[10px] tracking-[.25em] text-neutral-500 uppercase">Email</label>
                <input name="email" type="email" value="{{ old('email') }}" required autofocus
                       class="mt-2 w-full border border-white/10 bg-black px-3 py-2.5 text-sm outline-none transition focus:border-amber-400/70">
            </div>
            <div>
                <label class="font-['JetBrains_Mono'] text-[10px] tracking-[.25em] text-neutral-500 uppercase">Password</label>
                <input name="password" type="password" required
                       class="mt-2 w-full border border-white/10 bg-black px-3 py-2.5 text-sm outline-none transition focus:border-amber-400/70">
            </div>
            <label class="flex items-center gap-2 font-['JetBrains_Mono'] text-[10px] tracking-[.2em] text-neutral-500 uppercase">
                <input type="checkbox" name="remember" class="accent-amber-400"> Remember me
            </label>
            <button class="w-full bg-amber-400 px-4 py-3 font-['JetBrains_Mono'] text-[11px] font-medium tracking-[.3em] text-black uppercase transition hover:bg-amber-300">
                Enter
            </button>
        </form>
    </div>
</div>

</body>
</html>
