<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-mantine-color-scheme="{{ $page['props']['colorScheme'] ?? 'light' }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                try {
                    // 在伺服器送來的 HTML 主題不對時，盡快修正它。
                    const cookieName = 'mantine-color-scheme';
                    const localStorageKey = 'mantine-color-scheme-value';

                    // 優先級 1: 使用者在本地的明確選擇
                    const localStorageValue = window.localStorage.getItem(localStorageKey);
                    if (localStorageValue === 'light' || localStorageValue === 'dark') {
                        // 如果 localStorage 的值和伺服器送來的不一樣，立即修正
                        if (document.documentElement.getAttribute('data-mantine-color-scheme') !== localStorageValue) {
                            document.documentElement.setAttribute('data-mantine-color-scheme', localStorageValue);
                        }
                        // 同時確保 cookie 也同步 (處理跨分頁/設備同步後 cookie 未更新的邊界情況)
                        document.cookie = `${cookieName}=${localStorageValue}; path=/; samesite=Lax; max-age=31536000`;
                        return; // 修正完畢，結束
                    }

                    // 優先級 2: 處理全新使用者，根據系統偏好設定
                    // 只有在 localStorage 沒有明確設定時才執行這段
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    const systemScheme = prefersDark ? 'dark' : 'light';
                    
                    // 將系統偏好同時寫入 localStorage 和 cookie，為下次訪問做準備
                    window.localStorage.setItem(localStorageKey, systemScheme);
                    document.cookie = `${cookieName}=${systemScheme}; path=/; samesite=Lax; max-age=31536000`;

                    // 應用系統偏好
                    document.documentElement.setAttribute('data-mantine-color-scheme', systemScheme);
                } catch (e) {
                    // 在極端情況下（如瀏覽器不支援） gracefully fail。
                }
            })();
        </script>

        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-JD5C8LY128"></script>
        <script>
            window.dataLayer = window.dataLayer || [];

            function gtag() {
                dataLayer.push(arguments);
            }
            gtag('js', new Date());

            gtag('config', 'G-JD5C8LY128');
        </script>

        <!-- Google Ads -->
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5384070877829940"
        crossorigin="anonymous"></script>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link rel="preload" href="https://fonts.bunny.net/css?family=noto-sans-tc:400,500,600,700" as="style" onload="this.onload=null;this.rel='stylesheet'">
        <noscript>
            <link rel="stylesheet" href="https://fonts.bunny.net/css?family=noto-sans-tc:400,500,600,700">
        </noscript>

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body>
        @inertia
    </body>
</html>
