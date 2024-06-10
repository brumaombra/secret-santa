import { reactive } from 'vue';
import itTranslations from '@/translations/it.json';
import enTranslations from '@/translations/en.json';
import esTranslations from '@/translations/es.json';
import deTranslations from '@/translations/de.json';
import frTranslations from '@/translations/fr.json';

export default reactive({
    elencoPartecipanti: [],
    currentLanguage: 'it',
    availableLanguages: [ // Available languages
        { code: 'it', name: 'Italiano' },
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Español' },
        { code: 'de', name: 'Deutsch' },
        { code: 'fr', name: 'Français' }
    ], translations: { // Translation files
        it: itTranslations,
        en: enTranslations,
        es: esTranslations,
        de: deTranslations,
        fr: frTranslations
    }, messageListDialogModel: { // Message list dialog model
        type: '',
        message: '',
        list: []
    }
});