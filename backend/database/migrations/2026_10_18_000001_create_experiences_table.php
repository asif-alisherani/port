<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('role');
            $table->string('company');
            $table->string('period');                 // free text, e.g. "2023 — PRESENT"
            $table->text('summary')->nullable();
            $table->json('stack')->nullable();
            $table->boolean('is_current')->default(false);
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        // Start with the entries the site already showed, so nothing changes
        // visually until they are edited in the admin.
        $now = now();
        $rows = [
            ['Senior Full-Stack Developer', 'Northwind Labs', '2023 — PRESENT',
                'Own end-to-end delivery of the core web platform: React frontends, design-system work, and the APIs behind them. Lead a pod of four, ship weekly, keep the p95s honest.',
                ['React', 'TypeScript', 'Node', 'Tailwind'], true],
            ['Full-Stack Developer', 'Hexabyte Studio', '2021 — 2023',
                'Built client products from Figma to production: Laravel services, REST APIs and React dashboards. Introduced CI and cut release time from days to hours.',
                ['Laravel', 'MySQL', 'React', 'CI/CD'], false],
            ['React Native Developer', 'Paperkite Apps', '2019 — 2021',
                'Shipped a cross-platform Android app used by 100k+ people. Owned offline sync, push flows, crash triage and store releases.',
                ['React Native', 'Android', 'REST'], false],
            ['Junior Web Developer', 'Bluebrick Media', '2018 — 2019',
                'Cut my teeth on marketing sites and CMS builds. Learned to love clean markup, fast pages and honest estimates.',
                ['HTML/CSS', 'JavaScript', 'WordPress'], false],
        ];
        foreach ($rows as $i => [$role, $company, $period, $summary, $stack, $current]) {
            DB::table('experiences')->insert([
                'role' => $role, 'company' => $company, 'period' => $period, 'summary' => $summary,
                'stack' => json_encode($stack), 'is_current' => $current, 'position' => $i,
                'is_published' => true, 'created_at' => $now, 'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('experiences');
    }
};
