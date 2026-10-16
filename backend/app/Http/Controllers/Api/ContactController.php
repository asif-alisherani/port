<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    /** Receives the front-end contact form. */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            // Honeypot: real humans never fill this in.
            'company' => ['nullable', 'size:0'],
        ], [
            'company.size' => 'Submission rejected.',
        ]);

        $message = ContactMessage::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'message' => $data['message'],
            'ip_address' => $request->ip(),
        ]);

        // Fire a plain notification if mail is configured.
        if ($to = config('portfolio.contact_notify')) {
            try {
                Mail::raw(
                    "From: {$message->name} <{$message->email}>\n\n{$message->message}",
                    fn ($mail) => $mail->to($to)->subject("Portfolio contact — {$message->name}")
                );
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return response()->json([
            'ok' => true,
            'message' => 'Transmission received.',
        ], 201)->header('Access-Control-Allow-Origin', '*');
    }
}
