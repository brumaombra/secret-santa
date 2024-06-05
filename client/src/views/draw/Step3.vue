<script setup>
import GlobalStore from '@/stores/global.js';
import ConfirmModal from '@/components/ConfirmModal.vue';
import { getTranslation, busy, deleteCookies, actionModal, formatListEsclusi, checkIfRedirect, drawPairs } from '@/utils/utils.js';
import { useRouter } from 'vue-router';

const router = useRouter(); // Router

// Handler del pulsante conferma del dialog
const handleConfermaPress = async () => {
    const globalStore = JSON.parse(JSON.stringify(GlobalStore)); // Clono l'oggetto per non creare casini
    const participants = formattaPartecipanti(globalStore.elencoPartecipanti);
    const lang = globalStore.currentLanguage;

    // Chiamata al backend
    busy(true); // Busy on
    try {
        const response = await drawPairs(participants, lang);
        GlobalStore.messageListDialogModel.type = "SUCCESS";
        GlobalStore.messageListDialogModel.message = response.message || getTranslation("modal.success.default.text"); // Messaggio di successo
        GlobalStore.messageListDialogModel.list = response.list || []; // Lista dei messaggi
        router.push('/draw/step4'); // Avanzo lo step
        // deleteCookies(); // Elimino i cookie
        busy(false); // Busy off
        actionModal("messageListModal", "open"); // Apro il modal
    } catch (error) {
        busy(false); // Busy off
        GlobalStore.messageListDialogModel.type = "ERROR";
        GlobalStore.messageListDialogModel.message = error.data?.message || getTranslation("message.error.call"); // Messaggio di errore
        GlobalStore.messageListDialogModel.list = error.data?.list || []; // Lista messaggi di dettaglio
        actionModal("messageListModal", "open"); // Apro il modal
    }
};

// Formatto i partecipanti per la chiamata al backend
const formattaPartecipanti = partecipanti => {
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
                            <th width="60px" class="table-cell-center">{{ getTranslation("table.participants.columnNumber") }}</th>
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
                <button class="button style-accent" @click="router.push('/draw/step2')"><i class="fa-solid fa-arrow-left mr-2"></i>{{ getTranslation("button.back") }}</button>
                <button class="button style-green open-modal" data-modal-target="#confirmModal"><i class="fa-solid fa-paper-plane mr-2"></i>{{ getTranslation("button.send") }}</button>
            </div>
        </div>

        <!-- Modal conferma -->
        <ConfirmModal :message="getTranslation('modal.confirmation.body')" @confirm="handleConfermaPress" />
    </div>
</template>