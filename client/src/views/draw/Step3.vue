<script setup>
import { reactive } from 'vue';
import GlobalStore from '@/stores/store';
import { getTranslation, busy, deleteCookies, actionModal, formatListEsclusi, getBaseApiUrl, checkIfRedirect } from '@/utils/utils';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const errorModal = reactive({
    message: "",
    list: []
});

// Handler del pulsante conferma del dialog
const handleConfermaPress = () => {
    const globalStore = JSON.parse(JSON.stringify(GlobalStore)); // Clono l'oggetto per non creare casini
    let object = { // Oggetto per chiamata
        lang: globalStore.currentLanguage,
        partecipanti: formattaPartecipanti(globalStore.elencoPartecipanti)
    };

    // Chiamata al backend
    busy(true); // Busy on
    axios.post(`${getBaseApiUrl()}/api/draw.php`, object).then(response => {
        busy(false); // Busy off
        GlobalStore.successModal.message = response.data?.message || getTranslation("modal.success.default.text"); // Messaggio di successo
        GlobalStore.successModal.list = response.data?.listaMessaggi || []; // Lista dei messaggi
        router.push('/draw/step4'); // Avanzo lo step
        deleteCookies(); // Elimino i cookie
    }).catch(error => {
        busy(false); // Busy off
        errorModal.message = error.response?.data?.message || getTranslation("message.error.call"); // Messaggio di errore
        errorModal.list = error.response?.data?.listaMessaggi || []; // Lista messaggi di dettaglio
        actionModal("modalMessaggiErrore", "open"); // Apro il modal
    });
};

// Formatto i partecipanti per la chiamata al backend
const formattaPartecipanti = (partecipanti) => {
    partecipanti.forEach((partecipante, index) => {
        partecipante.id = index;
        partecipante.esclusi = partecipante.esclusi ? partecipante.esclusi.filter(item => item.escluso).map(item => item.id) : []; // Rimuovo gli esclusi che non sono stati selezionati e prendo solo ID
        partecipante.destinatario = null;
    });
    return partecipanti; // Ritorno l'array formattato
};

checkIfRedirect(); // Controllo se ci sono gli elementi, altrimenti redirect
</script>

<template>
    <div id="step3View">
        <!-- Alert info -->
        <div class="alert" role="alert">
            <h4 class="alert-heading mb-1">{{ getTranslation("alert.step3.heading") }}</h4>
            <p class="mb-0">{{ getTranslation("alert.step3.welcomeMessage") }}</p>
            <hr />
            <p class="mb-0">{{ getTranslation("alert.step3.instruction1") }}</p>
            <p class="mb-0">{{ getTranslation("alert.step3.instruction2") }}</p>
            <p class="mb-0">{{ getTranslation("alert.step3.instruction3") }}</p>
            <p class="mb-0">{{ getTranslation("alert.step3.closingRemark") }}</p>
        </div>

        <!-- Tabella partecipanti -->
        <div class="table-responsive-margin-top">
            <!-- Navbar tabella -->
            <div class="inline-flex flex-center justify-content-between w-100 mb-2 bruma-table-navbar">
                <div class="inline-flex flex-center">
                    <h2>{{ getTranslation("table.participants.summary") }}</h2>
                    <span class="badge edge-circle size-2x ml-2">{{ GlobalStore.elencoPartecipanti.length }}</span>
                </div>
            </div>

            <!-- Tabella -->
            <div class="responsive-table-container">
                <table class="bordered responsive-table">
                    <thead>
                        <tr>
                            <th width="60px" class="table-cell-center">{{ getTranslation("table.participants.columnNumber")
                            }}
                            </th>
                            <th>{{ getTranslation("table.participants.columnName") }}</th>
                            <th>{{ getTranslation("table.participants.columnEmail") }}</th>
                            <th>{{ getTranslation("table.participants.columnExcluded") }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(person, index) in GlobalStore.elencoPartecipanti">
                            <td class="table-cell-center bold">{{ index + 1 }}</td>
                            <td>{{ person.nome }}</td>
                            <td>{{ person.email }}</td>
                            <td>{{ formatListEsclusi(person.esclusi) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Navbar inferiore -->
            <div class="inline-flex flex-center justify-content-between w-100 mt-2 bruma-table-navbar navbar-table-bottom">
                <button class="button style-accent" @click="router.push('/draw/step2')"><i
                        class="fa-solid fa-arrow-left mr-2"></i>{{
                            getTranslation("button.back") }}</button>
                <button class="button style-green open-modal" data-modal-target=".modalConfermaInvio"><i
                        class="fa-solid fa-paper-plane mr-2"></i>{{ getTranslation("button.send") }}</button>
            </div>
        </div>

        <!-- Modal conferma -->
        <div class="modal modalConfermaInvio" tabindex="-1" aria-labelledby="modalConfermaInvioTitle">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="modalConfermaInvioTitle" class="modal-title">{{ getTranslation("modal.confirmation.title") }}
                    </h5>
                </div>
                <div class="modal-body">
                    <p>{{ getTranslation("modal.confirmation.body") }}</p>
                </div>
                <div class="modal-footer justify-content-end mb-3">
                    <button class="button two-layer-button style-green close-modal" @click="handleConfermaPress">{{
                        getTranslation("button.confirm") }}
                        <span class="secondary-text">
                            <i class="fa-solid fa-paper-plane mr-2"></i>
                        </span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal errore -->
        <div id="modalMessaggiErrore" class="modal modalMessaggiErrore" tabindex="-1"
            aria-labelledby="modalMessaggiErroreTitle">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="inline-flex flex-center">
                        <i class="fa-solid fa-face-frown danger size-2x mr-2"></i>
                        <h5 id="modalMessaggiErroreTitle" class="modal-title">{{ getTranslation("modal.error.title") }}</h5>
                    </div>
                </div>
                <div class="modal-body">
                    <p>{{ errorModal.message }}</p>
                    <div v-if="errorModal.list.length > 0" class="mt-3" v-for="message in errorModal.list">
                        <div class="alert style-danger has-icon table-cell-center mb-0" role="alert">
                            <div class="alert-svg">
                                <i class="fa-solid fa-xmark"></i>
                            </div>
                            {{ message.message }}
                        </div>
                    </div>
                </div>
                <div class="modal-footer justify-content-end mb-3">
                    <button class="button style-danger close-modal">{{ getTranslation("button.close") }}</button>
                </div>
            </div>
        </div>
    </div>
</template>