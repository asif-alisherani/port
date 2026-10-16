<?php

namespace App\Http\Controllers\Admin;

use App\Models\TechDomain;
use Illuminate\Database\Eloquent\Model;

class TechDomainController extends ResourceController
{
    protected string $model = TechDomain::class;
    protected string $view = 'tech';
    protected string $route = 'admin.tech-domains';
    protected string $title = 'Stack domain';

    protected array $lineFields = ['tools'];

    protected function rules(?Model $item = null): array
    {
        return [
            'label' => ['required', 'string', 'max:80'],
            'icon' => ['required', 'string', 'max:40'],
            'tools' => ['nullable', 'string'],
            'position' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
