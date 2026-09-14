<?php

use Inertia\Testing\AssertableInertia as Assert;

uses(Tests\TestCase::class);

test('traditional Chinese is the default public locale', function () {
    $this->get('/about')
        ->assertOk()
        ->assertCookie('locale', 'zh-TW')
        ->assertSee('<html lang="zh-TW"', false)
        ->assertInertia(fn (Assert $page) => $page
            ->component('About')
            ->where('locale', 'zh-TW')
            ->where('supportedLocales', ['zh-TW', 'en']));
});

test('English public URLs set the English locale', function () {
    $this->get('/en/about')
        ->assertOk()
        ->assertCookie('locale', 'en')
        ->assertSee('<html lang="en"', false)
        ->assertInertia(fn (Assert $page) => $page
            ->component('About')
            ->where('locale', 'en'));
});

test('an English preference redirects Chinese public URLs and preserves the query string', function () {
    $this->withCookie('locale', 'en')
        ->get('/about?source=resume')
        ->assertRedirect('/en/about?source=resume');
});

test('admin URLs are not redirected by the public locale preference', function () {
    $this->withCookie('locale', 'en')
        ->get('/management/login')
        ->assertOk();
});
