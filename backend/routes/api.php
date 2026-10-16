<?php

use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ContentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API consumed by the React front end
|--------------------------------------------------------------------------
| GET  /api/content  → every published section in one payload
| POST /api/contact  → stores a contact message (rate limited)
*/

Route::get('/content', [ContentController::class, 'index']);

Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:6,1');
