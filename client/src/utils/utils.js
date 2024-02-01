import GlobalStore from "@/stores/store";
import $ from "jquery";
import CryptoJS from "crypto-js";
import { useRouter } from "vue-router";

// Prendo il testo tradotto
export const getTranslation = (key) => {
    return GlobalStore.translations[GlobalStore.currentLanguage][key] || key;
}

// Imposto la lingua dell'applicazione in base alla lingua del browser
export const setAppLanguage = () => {
    let userLanguage = navigator.language || navigator.userLanguage;
    userLanguage = userLanguage.split("-")[0];
    let exist = GlobalStore.availableLanguages.find(x => x.code === userLanguage);
    GlobalStore.currentLanguage = exist ? userLanguage : "en";
}

// Formatto la lista degli esclusi
export const formatListEsclusi = (list) => {
    if (!list) return getTranslation("lbl.no.one"); // Se vuota esco
    let esclusi = list.filter(item => item.escluso).map(item => item.nome);
    return esclusi.length > 0 ? esclusi.join(", ") : getTranslation("lbl.no.one");
}

// Azione sul modal
export const actionModal = (id, action) => {
    const button = $("<button>", { // Creazione del pulsante
        style: "display: none",
        class: action === "open" ? "open-modal" : "close-modal",
        "data-modal-target": `.${id}`
    });

    // Aggiungo il pulsante al body e lo triggero
    $("body").append(button);
    button.trigger("click");
    button.remove();
}

// Setto il busy
export const busy = (busy) => {
    if (busy)
        $("#fullScreenBusy").fadeIn(150);
    else
        $("#fullScreenBusy").fadeOut(150);
}

// Salvo la lista degli utenti nei cookie
export const setListOnCookies = () => {
    let objectString = JSON.stringify(GlobalStore.elencoPartecipanti);
    objectString = encodeURIComponent(encrypt(objectString));
    document.cookie = "secretSantaParticipantsList=" + objectString + ";path=/";
}

// Prendo la lista dai cookie
export const getListFromCookie = () => {
    let myCookie = document.cookie?.split("; ")?.find(row => row.startsWith("secretSantaParticipantsList="))?.split("=")[1];
    myCookie = myCookie ? decrypt(decodeURIComponent(myCookie)) : "";
    GlobalStore.elencoPartecipanti = myCookie ? JSON.parse(myCookie) : [];
}

// Elimino i cookie
export const deleteCookies = () => {
    document.cookie = "secretSantaParticipantsList=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
}

// Controllo se ci sono gli elementi, altrimenti redirect
export const checkIfRedirect = () => {
    const router = useRouter();
    if (!(GlobalStore.elencoPartecipanti?.length >= 3 && GlobalStore.elencoPartecipanti[0]?.esclusi?.length !== undefined))
        router.push('/draw/step1'); // Torno all'inizio
};

// Prendo l'URL per il backend
export const getBaseApiUrl = () => {
    return process.env.NODE_ENV === "development" ? "http://localhost/santa/public" : "/santa";
}

// Clono l'oggetto
export const cloneObject = (object) => {
    return JSON.parse(JSON.stringify(object));
}

// Funzione di criptazione
const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, getCryptoKey()).toString();
}

// Funzione di decriptazione
const decrypt = (cipherText) => {
    let bytes = CryptoJS.AES.decrypt(cipherText, getCryptoKey());
    return bytes.toString(CryptoJS.enc.Utf8);
}

// Chiave e IV per la criptazione
const getCryptoKey = () => {
    return "f329d76eb570a60cc8362fa5127c1601c9c77aff618171c0e3a564d36744f8ab"; // Chiave a 256 bit
}