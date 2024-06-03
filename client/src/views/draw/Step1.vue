<script setup>
import { useRouter } from 'vue-router';
import ParticipantModal from '@/components/ParticipantModal.vue';
import Step1Store from '@/stores/step1.js';
import GlobalStore from '@/stores/global.js';
import { getTranslation, setListOnCookies, actionModal, cloneObject } from '@/utils/utils.js';

const router = useRouter(); // Router
const viewModel = Step1Store; // View model

// Handler del pulsante aggiungi del dialog
const handleAggiungiPartecipante = () => {
    let partecipante = { // Oggetto nuovo partecipante
        nome: viewModel.participantDialogModel.nome,
        email: viewModel.participantDialogModel.email
    };

    // Aggiungo o modifico
    if (viewModel.participantDialogModel.currentEdit !== null) // Se l'utente sta modificando un partecipante
        GlobalStore.elencoPartecipanti.splice(viewModel.participantDialogModel.currentEdit, 1, partecipante); // Modifico record
    else // Se l'utente sta aggiungendo un nuovo partecipante
        GlobalStore.elencoPartecipanti.push(partecipante); // Aggiungo
    clearModalNuovoPartecipante(); // Svuoto modal nuovo partecipante
    setListOnCookies(); // Salvo lista su cookie
    actionModal("participantModal", "close"); // Nascondo dialog
};

// Elimino un partecipante dalla lista
const handleEliminaPartecipante = index => {
    GlobalStore.elencoPartecipanti.splice(index, 1); // Elimino record
    setListOnCookies(); // Salvo lista su cookie
};

// Handler del pulsante modifica del dialog
const handleModificaPartecipante = index => {
    Object.assign(viewModel.participantDialogModel, cloneObject(GlobalStore.elencoPartecipanti[index]));
    viewModel.participantDialogModel.currentEdit = index; // Flag per indicare che l'utente sta modificando un partecipante
    viewModel.participantDialogModel.nomeIsValid = true; // Flag per indicare se il nome è valido
    viewModel.participantDialogModel.emailIsValid = true; // Flag per indicare se l'email è valida
    viewModel.participantDialogModel.buttonSaveEnabled = true; // Flag per indicare se il pulsante salva è abilitato
    setListOnCookies(); // Salvo lista su cookie
    actionModal("participantModal", "open"); // Nascondo dialog
};

// Svuoto modal nuovo partecipante
const clearModalNuovoPartecipante = () => {
    Object.assign(viewModel.participantDialogModel, {
        nome: "",
        email: "",
        nomeIsValid: false, // Flag per indicare se il nome è valido
        emailIsValid: false, // Flag per indicare se l'email è valida
        buttonSaveEnabled: false, // Flag per indicare se il pulsante salva è abilitato
        currentEdit: null // Flag per indicare se l'utente sta modificando un partecipante o aggiungendo un nuovo partecipante
    });
};

// Handlewr della pressione del pulsante avanti
const handleNextStepPress = () => {
    let elencoPartecipanti = cloneObject(GlobalStore.elencoPartecipanti).map((item, index) => {
        return {
            id: index,
            nome: item.nome,
            escluso: false
        }
    });
    GlobalStore.elencoPartecipanti.forEach((item, index) => {
        let filteredList = elencoPartecipanti.filter(partecipante => partecipante.id !== index); // Rimuovo lui stesso dalla lista delle persone escludibili
        item.esclusi = cloneObject(filteredList);
    });
    GlobalStore.elencoPartecipanti = cloneObject(GlobalStore.elencoPartecipanti); // Workaround per ripulire puntamenti
    router.push("/draw/step2"); // Avanzo allo step successivo
};
</script>

<template>
    <div id="step1View">
        <!-- Alert info -->
        <div class="alert" role="alert">
            <h4 class="alert-heading mb-1">{{ getTranslation("alert.step1.heading") }}</h4>
            <p class="mb-0">{{ getTranslation("alert.step1.welcomeMessage") }}</p>
            <hr />
            <p class="mb-0">{{ getTranslation("alert.step1.instruction1") }}</p>
            <p class="mb-0">{{ getTranslation("alert.step1.instruction2") }}</p>
            <p class="mb-0">{{ getTranslation("alert.step1.instruction3") }}</p>
        </div>

        <!-- Tabella partecipanti -->
        <div class="table-responsive-margin-top">
            <!-- Navbar tabella -->
            <div class="inline-flex flex-center justify-content-between w-100 mb-2 bruma-table-navbar step1-table-navbar">
                <div class="inline-flex flex-center">
                    <h2>{{ getTranslation("table.participants.heading") }}</h2>
                    <span class="badge edge-circle size-2x ml-2">{{ GlobalStore.elencoPartecipanti.length }}</span>
                </div>
                <button class="button style-accent open-modal" data-modal-target="#participantModal" @click="clearModalNuovoPartecipante"><i class="fa-solid fa-plus mr-2"></i>{{ getTranslation("button.add") }}</button>
            </div>

            <!-- Corpo tabella -->
            <div class="responsive-table-container">
                <table class="bordered responsive-table">
                    <thead>
                        <tr>
                            <th width="60px" class="table-cell-center">{{ getTranslation("table.participants.columnNumber") }}</th>
                            <th>{{ getTranslation("table.participants.columnName") }}</th>
                            <th>{{ getTranslation("table.participants.columnEmail") }}</th>
                            <th width="60px"></th>
                            <th width="60px"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Placeholder record -->
                        <tr v-if="GlobalStore.elencoPartecipanti.length === 0">
                            <td colspan="5" class="text-center">{{ getTranslation("table.participants.noParticipants") }}</td>
                        </tr>

                        <!-- Record validi -->
                        <tr v-if="GlobalStore.elencoPartecipanti.length > 0" v-for="(person, index) in GlobalStore.elencoPartecipanti">
                            <td class="table-cell-center bold">{{ index + 1 }}</td>
                            <td>{{ person.nome }}</td>
                            <td>{{ person.email }}</td>
                            <td class="table-cell-center"><i class="fa-solid fa-pen-to-square bruma-table-partecipanti-icon edit" :title="getTranslation('table.participants.btnEdit')" @click="handleModificaPartecipante(index)"></i></td>
                            <td class="table-cell-center"><i class="fa-solid fa-trash bruma-table-partecipanti-icon delete" :title="getTranslation('table.participants.btnDelete')" @click="handleEliminaPartecipante(index)"></i></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Navbar inferiore -->
            <div class="inline-flex flex-center justify-content-end w-100 mt-2 bruma-table-navbar navbar-table-bottom">
                <button class="button style-accent" :disabled="GlobalStore.elencoPartecipanti.length < 3" @click="handleNextStepPress">{{ getTranslation("button.forward") }}<i class="fa-solid fa-arrow-right ml-2"></i></button>
            </div>
        </div>

        <!-- Participant modal -->
        <ParticipantModal @savePress="handleAggiungiPartecipante" />
    </div>
</template>