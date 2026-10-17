<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\ManagesMedia;
use App\Models\Project;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

class ProjectController extends ResourceController
{
    use ManagesMedia;

    protected string $model = Project::class;
    protected string $view = 'projects';
    protected string $route = 'admin.projects';
    protected string $title = 'Project';

    protected array $lineFields = ['description', 'stack'];
    protected array $jsonFields = ['highlights', 'links'];  // gallery is handled by ManagesMedia

    protected function rules(?Model $item = null): array
    {
        return [
            'slug' => ['required', 'alpha_dash', 'max:120', Rule::unique('projects')->ignore($item?->id)],
            'title' => ['required', 'string', 'max:160'],
            'tag' => ['required', 'string', 'max:80'],
            'year' => ['nullable', 'string', 'max:40'],
            'role' => ['nullable', 'string', 'max:120'],
            'client' => ['nullable', 'string', 'max:120'],
            'duration' => ['nullable', 'string', 'max:80'],
            'summary' => ['nullable', 'string', 'max:600'],
            'description' => ['nullable', 'string'],
            'stack' => ['nullable', 'string'],
            'highlights' => ['nullable', 'json'],
            'links' => ['nullable', 'json'],
            'position' => ['nullable', 'integer', 'min:0'],
        ] + $this->mediaRules($item);
    }

    protected function messages(): array
    {
        return $this->mediaMessages();
    }

    protected function mediaFolder(): string
    {
        return 'projects';
    }
}
