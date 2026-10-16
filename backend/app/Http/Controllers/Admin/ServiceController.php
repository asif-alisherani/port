<?php

namespace App\Http\Controllers\Admin;

use App\Models\Service;
use Illuminate\Database\Eloquent\Model;

class ServiceController extends ResourceController
{
    protected string $model = Service::class;
    protected string $view = 'services';
    protected string $route = 'admin.services';
    protected string $title = 'Service card';

    protected function rules(?Model $item = null): array
    {
        return [
            'title' => ['required', 'string', 'max:160'],
            'body' => ['required', 'string', 'max:600'],
            'icon' => ['required', 'string', 'max:40'],
            'position' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
