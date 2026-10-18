<?php

namespace App\Http\Controllers\Admin;

use App\Models\Experience;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ExperienceController extends ResourceController
{
    protected string $model = Experience::class;
    protected string $view = 'experiences';
    protected string $route = 'admin.experiences';
    protected string $title = 'Experience';

    /** One technology per line. */
    protected array $lineFields = ['stack'];

    protected function rules(?Model $item = null): array
    {
        return [
            'role' => ['required', 'string', 'max:160'],
            'company' => ['required', 'string', 'max:160'],
            'period' => ['required', 'string', 'max:60'],
            'summary' => ['nullable', 'string', 'max:1200'],
            'stack' => ['nullable', 'string'],
            'position' => ['nullable', 'integer', 'min:0'],
        ];
    }

    protected function prepare(Request $request, array $data): array
    {
        $data = parent::prepare($request, $data);
        $data['is_current'] = $request->boolean('is_current');

        return $data;
    }
}
