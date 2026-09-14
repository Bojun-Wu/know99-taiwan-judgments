import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Locale, resources } from './locales';

export function createI18n(locale: Locale) {
    const instance = createInstance();

    void instance.use(initReactI18next).init({
        lng: locale,
        fallbackLng: 'zh-TW',
        resources,
        interpolation: { escapeValue: false },
        initAsync: false,
    });

    return instance;
}
