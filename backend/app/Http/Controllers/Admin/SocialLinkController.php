<?php

namespace App\Http\Controllers\Admin;

use App\Models\SocialLink;
use Illuminate\Database\Eloquent\Model;

class SocialLinkController extends ResourceController
{
    protected string $model = SocialLink::class;
    protected string $view = 'links';
    protected string $route = 'admin.links';
    protected string $title = 'Link';

    protected function rules(?Model $item = null): array
    {
        return [
            'label' => ['required', 'string', 'max:60'],
            'url' => ['required', 'url:http,https', 'max:500'],
            'position' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
