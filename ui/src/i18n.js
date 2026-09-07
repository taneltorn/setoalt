import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from "i18next-browser-languagedetector";

i18n
    .use(LanguageDetector)
    .use(HttpApi)
    .use(initReactI18next)
    .init({
        fallbackLng: 'et',

        backend: {
            loadPath: `${import.meta.env.VITE_PUBLIC_URL}/locales/{{lng}}/{{ns}}.json`
        },

        ns: ['translation'],
        defaultNS: 'translation',

        keySeparator: ".",

        interpolation: {
            escapeValue: false
        },

        detection: {
            order: ["localStorage"],
            caches: ["localStorage"],
            lookupLocalStorage: "lang",
            fallbackLng: "et",
        },

        react: {
            useSuspense: true,
        }
    });

export default i18n;
