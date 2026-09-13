<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchVerdictRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'query' => 'required|string|max:255',
            'sort_by' => 'sometimes|string|in:desc,asc',
            'page' => 'sometimes|integer|min:1',

            'court' => 'sometimes|string|exists:courts,name',
            'type' => 'sometimes|string|exists:verdicts,type',
            'year' => 'sometimes|integer',
        ];
    }

    public function validated($key = null, $default = null)
    {
        $validated = parent::validated($key, $default);

        return [
            'query' => $validated['query'],
            'sortBy' => $validated['sort_by'] ?? 'desc',
            'page' => $validated['page'] ?? 1,

            'court' => $validated['court'] ?? null,
            'type' => $validated['type'] ?? null,
            'year' => $validated['year'] ?? null,
        ];
    }
}
