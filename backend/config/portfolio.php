<?php

return [
    /** Where the built React site is served from (CORS + "View site" link). */
    'frontend_url' => env('FRONTEND_URL', 'http://localhost:5173'),

    /** Address that receives a copy of every contact submission. */
    'contact_notify' => env('CONTACT_NOTIFY_EMAIL'),
];
