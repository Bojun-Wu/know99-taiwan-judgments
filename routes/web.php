<?php

use App\Http\Controllers\TestController;
use App\Http\Controllers\VerdictAIAnalysisController;
use App\Http\Controllers\VerdictController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminCourtController;
use App\Http\Controllers\Admin\AdminVerdictController;
use App\Http\Controllers\Admin\AdminVerdictSummaryController;
use App\Http\Controllers\Admin\AdminOrganizationController;
use App\Http\Controllers\Admin\AdminPersonController;
use App\Http\Controllers\Admin\AdminPostController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\EntityController;
use App\Http\Middleware\AdminMiddleware;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

// Verdicts
Route::get('/', [VerdictController::class, 'home'])->name('home');
Route::get('/search', [VerdictController::class, 'search'])->name('verdicts.search');
Route::get('/trending', [VerdictController::class, 'trending'])->name('verdicts.trending');
Route::get('/verdicts', [VerdictController::class, 'index'])->name('verdicts.index');
Route::get('/verdicts/{verdict}', [VerdictController::class, 'show'])->name('verdicts.show');

// Posts
Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');

// Entities (People & Organizations)
Route::get('/entities', [EntityController::class, 'index'])->name('entities.index');
Route::get('/people/{name}', [EntityController::class, 'showPerson'])->name('people.show');
Route::get('/organizations/{name}', [EntityController::class, 'showOrganization'])->name('organizations.show');

// general
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

// api
Route::prefix('api')->group(function () {
    Route::get('/verdicts-ai-analysis/{verdict}', [VerdictAIAnalysisController::class, 'getAIAnalysisVerdict'])->name('verdicts.ai-analysis');
    Route::post('/verdicts-ai-analysis/upvote/{summary}', [VerdictAIAnalysisController::class, 'upvoteVerdictSummary'])->name('verdicts.ai-analysis.upvote');
    Route::post('/verdicts-ai-analysis/downvote/{summary}', [VerdictAIAnalysisController::class, 'downvoteVerdictSummary'])->name('verdicts.ai-analysis.downvote');
});

// Test
Route::get('/test', [TestController::class, 'test'])->name('test');

// Admin Authentication Routes
Route::prefix('management')->name('admin.')->group(function () {
    Route::get('login', [AdminAuthController::class, 'showLoginForm'])->name('login');
    Route::post('login', [AdminAuthController::class, 'login']);
    Route::post('logout', [AdminAuthController::class, 'logout'])->name('logout');

    // Protected Admin Routes
    Route::middleware([AdminMiddleware::class])->group(function () {
        Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');

        // Verdicts
        Route::get('verdicts', [AdminVerdictController::class, 'index'])->name('verdicts.index');
        Route::get('verdicts/{verdict:id}', [AdminVerdictController::class, 'edit'])->name('verdicts.edit');
        Route::put('verdicts/{verdict:id}', [AdminVerdictController::class, 'update'])->name('verdicts.update');
        Route::delete('verdicts/{verdict:id}', [AdminVerdictController::class, 'destroy'])->name('verdicts.destroy');

        // Verdict Summaries
        Route::get('verdict-summaries', [AdminVerdictSummaryController::class, 'index'])->name('verdict-summaries.index');
        Route::get('verdict-summaries/{summary:id}/edit', [AdminVerdictSummaryController::class, 'edit'])->name('verdict-summaries.edit');
        Route::put('verdict-summaries/{summary:id}', [AdminVerdictSummaryController::class, 'update'])->name('verdict-summaries.update');
        Route::delete('verdict-summaries/{summary:id}', [AdminVerdictSummaryController::class, 'deprecate'])->name('verdict-summaries.deprecate');

        // Organizations
        Route::get('organizations', [AdminOrganizationController::class, 'index'])->name('organizations.index');
        Route::get('organizations/create', [AdminOrganizationController::class, 'create'])->name('organizations.create');
        Route::post('organizations', [AdminOrganizationController::class, 'store'])->name('organizations.store');
        Route::get('organizations/{organization:id}/edit', [AdminOrganizationController::class, 'edit'])->name('organizations.edit');
        Route::put('organizations/{organization:id}', [AdminOrganizationController::class, 'update'])->name('organizations.update');
        Route::delete('organizations/{organization:id}', [AdminOrganizationController::class, 'destroy'])->name('organizations.destroy');
        Route::delete('organizations/{organization:id}/verdicts/{verdict:id}', [AdminOrganizationController::class, 'detachVerdict'])
            ->name('organizations.verdicts.detach');

        // People
        Route::get('people', [AdminPersonController::class, 'index'])->name('people.index');
        Route::get('people/create', [AdminPersonController::class, 'create'])->name('people.create');
        Route::post('people', [AdminPersonController::class, 'store'])->name('people.store');
        Route::get('people/{person:id}/edit', [AdminPersonController::class, 'edit'])->name('people.edit');
        Route::put('people/{person:id}', [AdminPersonController::class, 'update'])->name('people.update');
        Route::delete('people/{person:id}', [AdminPersonController::class, 'destroy'])->name('people.destroy');
        Route::delete('people/{person:id}/verdicts/{verdict:id}', [AdminPersonController::class, 'detachVerdict'])
            ->name('people.verdicts.detach');

        // Courts
        Route::get('courts', [AdminCourtController::class, 'index'])->name('courts.index');
        Route::get('courts/{court}/edit', [AdminCourtController::class, 'edit'])->name('courts.edit');
        Route::put('courts/{court}', [AdminCourtController::class, 'update'])->name('courts.update');


        // Posts
        Route::get('posts', [AdminPostController::class, 'index'])->name('posts.index');
        Route::get('posts/create', [AdminPostController::class, 'create'])->name('posts.create');
        Route::post('posts', [AdminPostController::class, 'store'])->name('posts.store');
        Route::get('posts/{post:id}/edit', [AdminPostController::class, 'edit'])->name('posts.edit');
        Route::put('posts/{post:id}', [AdminPostController::class, 'update'])->name('posts.update');
        Route::delete('posts/{post:id}', [AdminPostController::class, 'destroy'])->name('posts.destroy');

        // Test
        Route::get('test', [TestController::class, 'adminTest'])->name('test');
    });
});

require __DIR__ . '/auth.php';
