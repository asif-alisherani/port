<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * Shared CRUD for every simple admin resource. Subclasses declare their
 * model, view folder, route name and which fields are stored as JSON.
 */
abstract class ResourceController extends Controller
{
    /** @var class-string<Model> */
    protected string $model;

    protected string $view;    // resources/views/admin/<view>
    protected string $route;   // admin.<route>
    protected string $title;

    /** Textarea → array of lines. */
    protected array $lineFields = [];

    /** Textarea → decoded JSON. */
    protected array $jsonFields = [];

    abstract protected function rules(?Model $item = null): array;

    public function index()
    {
        $items = $this->model::query()->orderBy('position')->orderBy('id')->get();

        return view("admin.{$this->view}.index", [
            'items' => $items,
            'title' => $this->title,
            'route' => $this->route,
        ]);
    }

    public function create()
    {
        return view("admin.{$this->view}.form", [
            'item' => new $this->model,
            'title' => $this->title,
            'route' => $this->route,
            'mode' => 'create',
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->prepare($request, $request->validate($this->rules()));
        $this->model::create($data);
        $this->flushCache();

        return redirect()->route("{$this->route}.index")
            ->with('status', "{$this->title} created.");
    }

    public function edit(string $id)
    {
        return view("admin.{$this->view}.form", [
            'item' => $this->model::findOrFail($id),
            'title' => $this->title,
            'route' => $this->route,
            'mode' => 'edit',
        ]);
    }

    public function update(Request $request, string $id)
    {
        $item = $this->model::findOrFail($id);
        $data = $this->prepare($request, $request->validate($this->rules($item)));
        $item->update($data);
        $this->flushCache();

        return redirect()->route("{$this->route}.index")
            ->with('status', "{$this->title} updated.");
    }

    public function destroy(string $id)
    {
        $this->model::findOrFail($id)->delete();
        $this->flushCache();

        return redirect()->route("{$this->route}.index")
            ->with('status', "{$this->title} deleted.");
    }

    /** Normalise checkboxes, line lists and JSON blobs before saving. */
    protected function prepare(Request $request, array $data): array
    {
        $data['is_published'] = $request->boolean('is_published');
        $data['position'] = (int) ($data['position'] ?? 0);

        foreach ($this->lineFields as $field) {
            $raw = (string) $request->input($field, '');
            $data[$field] = collect(preg_split('/\r\n|\r|\n/', $raw))
                ->map(fn ($l) => trim($l))
                ->filter()
                ->values()
                ->all();
        }

        foreach ($this->jsonFields as $field) {
            $raw = trim((string) $request->input($field, ''));
            $data[$field] = $raw === '' ? [] : json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        }

        return $data;
    }

    protected function flushCache(): void
    {
        Cache::forget('api.content');
    }
}
