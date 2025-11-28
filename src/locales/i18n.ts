import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslation from './en/translation.json';
import jaTranslation from './ja/translation.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        // debug: process.env.NODE_ENV === 'development',

        interpolation: {
            escapeValue: false, // React already escapes by default
        },

        detection: {
            order: ['localStorage', 'cookie', 'htmlTag', 'navigator'],
            caches: ['localStorage', 'cookie'],
        },

        resources: {
            en: {
                translation: enTranslation
            },
            ja: {
                translation: jaTranslation
            }
        }
    });

export default i18n;