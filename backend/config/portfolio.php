<?php

return [
    /** Where the built React site is served from (CORS + "View site" link). */
    'frontend_url' => env('FRONTEND_URL', 'http://localhost:5173'),

    /** Address that receives a copy of every contact submission. */
    'contact_notify' => env('CONTACT_NOTIFY_EMAIL'),

    /*
    | Admin media uploads (project / side-quest covers, videos, galleries).
    | MEDIA_DISK=public → storage/app/public/uploads/… served from /storage/…
    |                     (run `php artisan storage:link` once) — good for local.
    | MEDIA_DISK=s3     → S3-compatible bucket (see AWS_* in .env) — use on
    |                     hosts with ephemeral disks such as Render.
    | Sizes are in kilobytes.
    */
    'uploads' => [
        'disk' => env('MEDIA_DISK', 'public'),
        'image_max_kb' => (int) env('UPLOAD_IMAGE_MAX_KB', 10240),   // 10 MB
        'video_max_kb' => (int) env('UPLOAD_VIDEO_MAX_KB', 204800),  // 200 MB
        'image_mimes' => 'jpg,jpeg,png,webp,gif,avif',
        'video_mimes' => 'mp4,webm',
    ],
];
