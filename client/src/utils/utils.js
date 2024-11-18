import { useRouter } from 'vue-router';
import CryptoJS from 'crypto-js';
import GlobalStore from '@/stores/global.js';

// Custom error class
export class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CustomError';
        this.isCustom = true;
        this.messages = [];
    }
}

// Get the translated text
export const getTranslation = key => {
    return GlobalStore.translations[GlobalStore.currentLanguage][key] || key;
};

// Set the application language based on the browser's language
export const setAppLanguage = () => {
    let userLanguage = navigator.language || navigator.userLanguage;
    userLanguage = userLanguage.split('-')[0];
    const exist = GlobalStore.availableLanguages.find(x => x.code === userLanguage);
    GlobalStore.currentLanguage = exist ? userLanguage : 'en';
};

// Format the list of excluded items
export const formatListEsclusi = list => {
    if (!list) return getTranslation('lbl.no.one'); // Exit if empty
    const excluded = list.filter(item => item.itemExcluded).map(item => item.name);
    return excluded.length > 0 ? excluded.join(', ') : getTranslation('lbl.no.one');
};

// Action on modal
export const actionModal = (id, action) => {
    const button = document.createElement('button');
    button.style.display = 'none';
    button.className = action === 'open' ? 'open-modal' : 'close-modal';
    button.setAttribute('data-modal-target', `#${id}`);
    document.body.appendChild(button); // Add the element to the DOM
    button.click(); // Trigger the click event
    document.body.removeChild(button); // Remove the element from the DOM
};

// Open the message list modal
export const openMessageListModal = (action, type, message, list = []) => {
    GlobalStore.messageListDialogModel.type = type;
    GlobalStore.messageListDialogModel.message = message;
    GlobalStore.messageListDialogModel.list = list;
    actionModal('messageListModal', action); // Open/close the modal
};

// Busy indicator
export const busy = busy => {
    const fullScreenBusy = document.getElementById('fullScreenBusy');
    if (!fullScreenBusy) return; // If the element is not found, do nothing
    fullScreenBusy.style.transition = 'opacity 150ms';
    if (busy) {
        fullScreenBusy.style.opacity = 1;
        fullScreenBusy.style.display = 'block';
    } else {
        fullScreenBusy.style.opacity = 0;
        setTimeout(() => {
            fullScreenBusy.style.display = 'none';
        }, 150);
    }
};

// Save the data to cookies
export const setListOnCookies = () => {
    let objectString = JSON.stringify(GlobalStore.elencoPartecipanti);
    objectString = encodeURIComponent(encrypt(objectString));
    document.cookie = 'secretSantaParticipantsList=' + objectString + ';path=/';
};

// Get the data from cookies
export const getListFromCookie = () => {
    let myCookie = document.cookie?.split('; ')?.find(row => row.startsWith('secretSantaParticipantsList='))?.split('=')[1];
    myCookie = myCookie ? decrypt(decodeURIComponent(myCookie)) : '';
    GlobalStore.elencoPartecipanti = myCookie ? JSON.parse(myCookie) : [];
};

// Delete cookies
export const deleteCookies = () => {
    document.cookie = 'secretSantaParticipantsList=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
};

// Check if elements exist, otherwise redirect
export const checkIfRedirect = () => {
    const router = useRouter();
    if (!(GlobalStore.elencoPartecipanti?.length >= 3 && GlobalStore.elencoPartecipanti[0]?.excluded?.length !== undefined))
        router.push('/draw/step1'); // Go back to the start
};

// Clone the object
export const cloneObject = object => {
    return JSON.parse(JSON.stringify(object));
};

// Encryption function
const encrypt = text => {
    return CryptoJS.AES.encrypt(text, getCryptoKey()).toString();
};

// Decryption function
const decrypt = cipherText => {
    const bytes = CryptoJS.AES.decrypt(cipherText, getCryptoKey());
    return bytes.toString(CryptoJS.enc.Utf8);
};

// Key and IV for encryption
const getCryptoKey = () => {
    return 'f329d76eb570a60cc8362fa5127c1601c9c77aff618171c0e3a564d36744f8ab'; // 256-bit key
};