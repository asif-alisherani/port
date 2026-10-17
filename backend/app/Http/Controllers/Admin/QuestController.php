<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\ManagesMedia;
use App\Models\Quest;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

class QuestController extends ResourceController
{
    use ManagesMedia;

    protected string $model = Quest::class;
    protected string $view = 'quests';
    protected string $route = 'admin.quests';
    protected string $title = 'Side quest';

    protected array $lineFields = ['description', 'stack'];
    protected array $jsonFields = ['highlights', 'links'];  // gallery is handled by ManagesMedia

    protected function rules(?Model $item = null): array
    {
        return [
            'slug' => ['required', 'alpha_dash', 'max:120', Rule::unique('quests')->ignore($item?->id)],
            'file' => ['required', 'string', 'max:120'],
            'date_label' => ['required', 'string', 'max:40'],
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
        return 'quests';
    }
}
