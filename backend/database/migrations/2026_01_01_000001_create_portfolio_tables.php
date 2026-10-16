<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Section 01 — "What I build" cards
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('body');
            $table->string('icon')->default('cube');   // key into the frontend icon registry
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        // Section 02 — Projects (full case studies)
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('tag');
            $table->string('year')->nullable();
            $table->string('role')->nullable();
            $table->string('client')->nullable();
            $table->string('duration')->nullable();
            $table->text('summary')->nullable();
            $table->string('cover')->nullable();
            $table->string('video')->nullable();
            $table->json('description')->nullable();   // ["para", "para"]
            $table->json('stack')->nullable();         // ["React", ...]
            $table->json('highlights')->nullable();    // [["Pages","36"], ...]
            $table->json('gallery')->nullable();       // [{src, caption}, ...]
            $table->json('links')->nullable();         // [{label, href}, ...]
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        // Section 05 — Beyond the brief (side quests)
        Schema::create('quests', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('file');                    // dashboard-template.repo
            $table->string('date_label');              // FEB 2025
            $table->string('title');
            $table->string('tag');
            $table->string('year')->nullable();
            $table->string('role')->nullable();
            $table->string('client')->nullable();
            $table->string('duration')->nullable();
            $table->text('summary')->nullable();
            $table->string('cover')->nullable();
            $table->string('video')->nullable();
            $table->json('description')->nullable();
            $table->json('stack')->nullable();
            $table->json('highlights')->nullable();
            $table->json('gallery')->nullable();
            $table->json('links')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        // Section 04 — Technology universe (stack domains)
        Schema::create('tech_domains', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('icon')->default('code');
            $table->json('tools');                     // ["React", "Vite", ...]
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        // Footer / contact links (LinkedIn, GitHub, anything)
        Schema::create('social_links', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('url');
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        // Contact form submissions
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->text('message');
            $table->string('ip_address')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('social_links');
        Schema::dropIfExists('tech_domains');
        Schema::dropIfExists('quests');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('services');
    }
};
