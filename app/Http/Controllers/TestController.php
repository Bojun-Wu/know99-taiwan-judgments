<?php

namespace App\Http\Controllers;

use App\Http\Resources\VerdictResource;
use App\Models\Verdict;
use App\Services\VerdictSummaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TestController extends Controller
{
    protected VerdictSummaryService $summaryService;

    public function __construct(VerdictSummaryService $summaryService)
    {
        $this->summaryService = $summaryService;
    }

    public function test()
    {
        return response()->json([
            'message' => 'Hello, World!',
        ], 200);
    }

    public function adminTest(Request $request)
    {
        // return request info
        return response()->json([
            'ip' => $request->ip(),
            'ips' => $request->ips(),
            'session' => $request->session()->all(),
            'user' => $request->user()?->toArray(),
            'headers' => $request->header(),
        ], 200);
    }
}
