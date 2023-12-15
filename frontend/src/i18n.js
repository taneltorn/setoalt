import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18n
    .use(HttpApi)
    .use(initReactI18next)
    .init({
        lng: 'ee',
        fallbackLng: 'ee',

        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json'
        },

        ns: ['translation'],
        defaultNS: 'translation',

        keySeparator: ".",

        interpolation: {
            escapeValue: false
        },

        react: {
            useSuspense: true,
        }
    });

export default i18n;
