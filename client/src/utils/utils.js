import GlobalStore from "@/stores/global.js";
import CryptoJS from "crypto-js";
import { useRouter } from "vue-router";

const devUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://bruma.cloud:3001';

// Prendo il testo tradotto
export const getTranslation = (key) => {
    return GlobalStore.translations[GlobalStore.currentLanguage][key] || key;
};

// Imposto la lingua dell'applicazione in base alla lingua del browser
export const setAppLanguage = () => {
    let userLanguage = navigator.language || navigator.userLanguage;
    userLanguage = userLanguage.split("-")[0];
    let exist = GlobalStore.availableLanguages.find(x => x.code === userLanguage);
    GlobalStore.currentLanguage = exist ? userLanguage : "en";
};

// Formatto la lista degli esclusi
export const formatListEsclusi = (list) => {
    if (!list) return getTranslation("lbl.no.one"); // Se vuota esco
    let esclusi = list.filter(item => item.escluso).map(item => item.nome);
    return esclusi.length > 0 ? esclusi.join(", ") : getTranslation("lbl.no.one");
};

// Azione sul modal
export const actionModal = (id, action) => {
    const button = document.createElement('button');
    button.style.display = 'none';
    button.className = action === 'open' ? 'open-modal' : 'close-modal';
    button.setAttribute('data-modal-target', `#${id}`);
    document.body.appendChild(button); // Add the element to the DOM
    button.click(); // Trigger the click event
    document.body.removeChild(button); // Remove the element from the DOM
};

// Setto il busy
export const busy = busy => {
    const fullScreenBusy = document.getElementById("fullScreenBusy");
    if (!fullScreenBusy) return; // If the element is not found, do nothing
    fullScreenBusy.style.transition = "opacity 150ms";
    if (busy) {
        fullScreenBusy.style.opacity = 1;
        fullScreenBusy.style.display = "block";
    } else {
        fullScreenBusy.style.opacity = 0;
        setTimeout(() => {
            fullScreenBusy.style.display = "none";
        }, 150);
    }
};

// Salvo la lista degli utenti nei cookie
export const setListOnCookies = () => {
    let objectString = JSON.stringify(GlobalStore.elencoPartecipanti);
    objectString = encodeURIComponent(encrypt(objectString));
    document.cookie = "secretSantaParticipantsList=" + objectString + ";path=/";
};

// Prendo la lista dai cookie
export const getListFromCookie = () => {
    let myCookie = document.cookie?.split("; ")?.find(row => row.startsWith("secretSantaParticipantsList="))?.split("=")[1];
    myCookie = myCookie ? decrypt(decodeURIComponent(myCookie)) : "";
    GlobalStore.elencoPartecipanti = myCookie ? JSON.parse(myCookie) : [];
};

// Elimino i cookie
export const deleteCookies = () => {
    document.cookie = "secretSantaParticipantsList=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
};

// Controllo se ci sono gli elementi, altrimenti redirect
export const checkIfRedirect = () => {
    const router = useRouter();
    if (!(GlobalStore.elencoPartecipanti?.length >= 3 && GlobalStore.elencoPartecipanti[0]?.esclusi?.length !== undefined))
        router.push('/draw/step1'); // Torno all'inizio
};

// Prendo l'URL per il backend
export const getBaseApiUrl = () => {
    return process.env.NODE_ENV === "development" ? "http://localhost/santa/public" : "/santa";
};

// Clono l'oggetto
export const cloneObject = (object) => {
    return JSON.parse(JSON.stringify(object));
};

// Funzione di criptazione
const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, getCryptoKey()).toString();
};

// Funzione di decriptazione
const decrypt = (cipherText) => {
    let bytes = CryptoJS.AES.decrypt(cipherText, getCryptoKey());
    return bytes.toString(CryptoJS.enc.Utf8);
};

// Chiave e IV per la criptazione
const getCryptoKey = () => {
    return "f329d76eb570a60cc8362fa5127c1601c9c77aff618171c0e3a564d36744f8ab"; // Chiave a 256 bit
};

// Draw the pairs
export const drawPairs = async (participants, lang) => {
    try {
        const response = await fetch(`${devUrl}/api/draw`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ participants, lang })
        });
        const data = await response.json(); // Get the data
        if (data.status === 'OK') { // Success
            return data;
        } else { // Error
            const error = new Error(data.message || 'Error while extracting the pairs');
            error.data = data; // Attach data to the error object
            throw error;
        }
    } catch (error) {
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};