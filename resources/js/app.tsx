import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { createI18n } from './i18n';
import type { Locale } from './i18n/locales';
import { theme } from './theme';

createInertiaApp({
    title: (title) => `${title} | Know99`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const locale = (props.initialPage.props.locale || 'zh-TW') as Locale;
        const i18n = createI18n(locale);

        document.documentElement.lang = locale;

        root.render(
            <I18nextProvider i18n={i18n}>
                <MantineProvider theme={theme} defaultColorScheme="auto">
                    <Notifications />
                    <App {...props} />
                </MantineProvider>
            </I18nextProvider>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
