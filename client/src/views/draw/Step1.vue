<script setup>
import { reactive } from 'vue';
import GlobalStore from '@/stores/store';
import { getTranslation, setListOnCookies, actionModal, cloneObject } from '@/utils/utils';
import validator from 'validator';
import { useRouter } from 'vue-router';

const router = useRouter();
let modalNuovoPartecipante = reactive({});

// Handler del pulsante aggiungi del dialog
const handleAggiungiPartecipante = () => {
    let partecipante = { // Oggetto nuovo partecipante
        nome: modalNuovoPartecipante.nome,
        email: modalNuovoPartecipante.email
    };

    // Aggiungo o modifico
    if (modalNuovoPartecipante.currentEdit !== null) // Se l'utente sta modificando un partecipante
        GlobalStore.elencoPartecipanti.splice(modalNuovoPartecipante.currentEdit, 1, partecipante); // Modifico record
    else // Se l'utente sta aggiungendo un nuovo partecipante
        GlobalStore.elencoPartecipanti.push(partecipante); // Aggiungo
    clearModalNuovoPartecipante(); // Svuoto modal nuovo partecipante
    setListOnCookies(); // Salvo lista su cookie
    actionModal("modalNuovoPartecipante", "close"); // Nascondo dialog
};

// Elimino un partecipante dalla lista
const handleEliminaPartecipante = (index) => {
    GlobalStore.elencoPartecipanti.splice(index, 1); // Elimino record
    setListOnCookies(); // Salvo lista su cookie
};

// Handler del pulsante modifica del dialog
const handleModificaPartecipante = (index) => {
    Object.assign(modalNuovoPartecipante, cloneObject(GlobalStore.elencoPartecipanti[index]));
    modalNuovoPartecipante.currentEdit = index; // Flag per indicare che l'utente sta modificando un partecipante
    modalNuovoPartecipante.nomeIsValid = true; // Flag per indicare se il nome è valido
    modalNuovoPartecipante.emailIsValid = true; // Flag per indicare se l'email è valida
    modalNuovoPartecipante.buttonSaveEnabled = true; // Flag per indicare se il pulsante salva è abilitato
    setListOnCookies(); // Salvo lista su cookie
    actionModal("modalNuovoPartecipante", "open"); // Nascondo dialog
};

// Svuoto modal nuovo partecipante
const clearModalNuovoPartecipante = () => {
    Object.assign(modalNuovoPartecipante, {
        nome: "",
        email: "",
        nomeIsValid: false, // Flag per indicare se il nome è valido
        emailIsValid: false, // Flag per indicare se l'email è valida
        buttonSaveEnabled: false, // Flag per indicare se il pulsante salva è abilitato
        currentEdit: null // Flag per indicare se l'utente sta modificando un partecipante o aggiungendo un nuovo partecipante
    });
};

// Valido il campo nome
const validateNome = (event) => {
    modalNuovoPartecipante.nomeIsValid = event.target.value.trim() ? validator.matches(event.target.value, /^[a-zA-Z0-9 ]*$/) : false; // Valido il nome
    modalNuovoPartecipante.buttonSaveEnabled = modalNuovoPartecipante.nomeIsValid && modalNuovoPartecipante.emailIsValid; // Abilito o disabilito il pulsante salva
};

// Valido il campo email
const validateEmail = (event) => {
    modalNuovoPartecipante.emailIsValid = validator.isEmail(event.target.value); // Valido l'email
    modalNuovoPartecipante.buttonSaveEnabled = modalNuovoPartecipante.nomeIsValid && modalNuovoPartecipante.emailIsValid; // Abilito o disabilito il pulsante salva
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
                <button class="button style-accent open-modal" data-modal-target=".modalNuovoPartecipante"
                    @click="clearModalNuovoPartecipante"><i class="fa-solid fa-plus mr-2"></i>{{
                        getTranslation("button.add")
                    }}</button>
            </div>

            <!-- Corpo tabella -->
            <div class="responsive-table-container">
                <table class="bordered responsive-table">
                    <thead>
                        <tr>
                            <th width="60px" class="table-cell-center">{{
                                getTranslation("table.participants.columnNumber") }}</th>
                            <th>{{ getTranslation("table.participants.columnName") }}</th>
                            <th>{{ getTranslation("table.participants.columnEmail") }}</th>
                            <th width="60px"></th>
                            <th width="60px"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Placeholder record -->
                        <tr v-if="GlobalStore.elencoPartecipanti.length === 0">
                            <td colspan="5" class="text-center">{{
                                getTranslation("table.participants.noParticipants") }}</td>
                        </tr>

                        <!-- Record validi -->
                        <tr v-if="GlobalStore.elencoPartecipanti.length > 0"
                            v-for="(person, index) in GlobalStore.elencoPartecipanti">
                            <td class="table-cell-center bold">{{ index + 1 }}</td>
                            <td>{{ person.nome }}</td>
                            <td>{{ person.email }}</td>
                            <td class="table-cell-center"><i
                                    class="fa-solid fa-pen-to-square bruma-table-partecipanti-icon edit"
                                    @click="handleModificaPartecipante(index)"></i></td>
                            <td class="table-cell-center"><i class="fa-solid fa-trash bruma-table-partecipanti-icon delete"
                                    @click="handleEliminaPartecipante(index)"></i></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Navbar inferiore -->
            <div class="inline-flex flex-center justify-content-between w-100 mt-2 bruma-table-navbar navbar-table-bottom">
                <p></p>
                <button class="button style-accent" v-if="GlobalStore.elencoPartecipanti.length > 2"
                    @click="handleNextStepPress">{{
                        getTranslation("button.forward") }}<i class="fa-solid fa-arrow-right ml-2"></i></button>
                <button class="button style-accent" v-if="!(GlobalStore.elencoPartecipanti.length > 2)" disabled>{{
                    getTranslation("button.forward") }}<i class="fa-solid fa-arrow-right ml-2"></i></button>
            </div>
        </div>

        <!-- Modal aggiungi -->
        <div id="modalNuovoPartecipante" class="modal modalNuovoPartecipante" tabindex="-1"
            aria-labelledby="modalNuovoPartecipanteTitle">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="modalNuovoPartecipanteTitle" class="modal-title">{{ modalNuovoPartecipante.currentEdit ?
                        getTranslation("modal.editParticipant") : getTranslation("modal.addParticipant")
                    }}</h5>
                </div>
                <div class="modal-body">
                    <p>{{ modalNuovoPartecipante.currentEdit ? getTranslation("modal.editParticipantInstruction") :
                        getTranslation("modal.addParticipantInstruction") }}</p>

                    <!-- Nome -->
                    <div class="mt-3">
                        <label for="inputNome" class="form-label">{{ getTranslation("modal.participantName")
                        }}</label>
                        <input id="inputNome" v-model="modalNuovoPartecipante.nome" type="text" @input="validateNome"
                            maxlength="50" class="form-control w-100"
                            :class="{ 'is-invalid': !modalNuovoPartecipante.nomeIsValid }">
                        <div class="help-text size-sm lbl-m-l">{{ getTranslation("modal.participantNameHelp") }}
                        </div>
                    </div>

                    <!-- Email -->
                    <div class="mt-3">
                        <label for="inputEmail" class="form-label">{{ getTranslation("modal.participantEmail")
                        }}</label>
                        <input id="inputEmail" v-model="modalNuovoPartecipante.email" type="email" @input="validateEmail"
                            maxlength="50" class="form-control w-100"
                            :class="{ 'is-invalid': !modalNuovoPartecipante.emailIsValid }">
                        <div class="help-text size-sm lbl-m-l">{{ getTranslation("modal.participantEmailHelp") }}
                        </div>
                    </div>
                </div>
                <div class="modal-footer mb-3">
                    <button class="button style-danger close-modal">{{ getTranslation("modal.closeButton")
                    }}</button>
                    <button class="button style-info" v-if="modalNuovoPartecipante.buttonSaveEnabled"
                        @click="handleAggiungiPartecipante">{{ getTranslation("modal.saveButton") }}</button>
                    <button class="button style-info" v-if="!modalNuovoPartecipante.buttonSaveEnabled" disabled>{{
                        getTranslation("modal.saveButton") }}</button>
                </div>
            </div>
        </div>
    </div>
</template>