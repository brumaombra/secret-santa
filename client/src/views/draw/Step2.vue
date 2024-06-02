<script setup>
import { reactive } from 'vue';
import GlobalStore from '@/stores/store';
import { getTranslation, formatListEsclusi, setListOnCookies, actionModal, checkIfRedirect } from '@/utils/utils';
import { useRouter } from 'vue-router';

const router = useRouter();
let modalEscludiPartecipanti = reactive({
    nome: "",
    email: "",
    esclusi: []
});

// Apro il dialog per escludere i partecipanti
const handleOpenEscludiDialogPress = (index) => {
    modalEscludiPartecipanti.nome = GlobalStore.elencoPartecipanti[index].nome;
    modalEscludiPartecipanti.email = GlobalStore.elencoPartecipanti[index].email;
    modalEscludiPartecipanti.esclusi = GlobalStore.elencoPartecipanti[index].esclusi;
    actionModal("modalEscludiPartecipanti", "open"); // Apro il modal
};

// Evento alla chiusura del dialog esclusi
const onDialogEsclusiClose = () => {
    setListOnCookies(); // Salvo lista su cookie
};

checkIfRedirect(); // Controllo se ci sono gli elementi, altrimenti redirect
</script>

<template>
    <div id="step2View">
        <!-- Alert info -->
        <div class="alert" role="alert">
            <h4 class="alert-heading mb-1">{{ getTranslation("alert.step2.heading") }}</h4>
            <p class="mb-0">{{ getTranslation("alert.step2.welcomeMessage") }}</p>
            <p class="mb-0">{{ getTranslation("alert.step2.description") }}</p>
            <hr />
            <p class="mb-0">{{ getTranslation("alert.step2.instruction1") }}</p>
            <p class="mb-0">{{ getTranslation("alert.step2.instruction2") }}</p>
            <p class="mb-0">{{ getTranslation("alert.step2.instruction3") }}</p>
        </div>

        <!-- Tabella partecipanti -->
        <div class="table-responsive-margin-top">
            <!-- Navbar tabella -->
            <div class="inline-flex flex-center justify-content-between w-100 mb-2 bruma-table-navbar">
                <div class="inline-flex flex-center">
                    <h2>{{ getTranslation("table.participants.heading") }}</h2>
                    <span class="badge edge-circle size-2x ml-2">{{ GlobalStore.elencoPartecipanti.length }}</span>
                </div>
            </div>

            <!-- Corpo tabella -->
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
                            <th width="60px"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(person, index) in GlobalStore.elencoPartecipanti">
                            <td class="table-cell-center bold">{{ index + 1 }}</td>
                            <td>{{ person.nome }}</td>
                            <td>{{ person.email }}</td>
                            <td>{{ formatListEsclusi(person.esclusi) }}</td>
                            <td class="table-cell-center"><i
                                    class="fa-solid fa-list-check bruma-table-partecipanti-icon exclude"
                                    @click="handleOpenEscludiDialogPress(index)"></i></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Navbar inferiore -->
            <div class="inline-flex flex-center justify-content-between w-100 mt-2 bruma-table-navbar navbar-table-bottom">
                <button class="button style-accent" @click="router.push('/draw/step1')"><i
                        class="fa-solid fa-arrow-left mr-2"></i>{{
                            getTranslation("button.back") }}</button>
                <button class="button style-accent" @click="router.push('/draw/step3')">{{ getTranslation("button.forward")
                }}<i class="fa-solid fa-arrow-right ml-2"></i></button>
            </div>
        </div>

        <!-- Modal escludi partecipanti -->
        <div id="modalEscludiPartecipanti" class="modal modalEscludiPartecipanti" tabindex="-1"
            aria-labelledby="modalEscludiPartecipantiTitle">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="modalEscludiPartecipantiTitle" class="modal-title">{{
                        getTranslation("modal.excludeParticipants.title") }}
                    </h5>
                </div>
                <div class="modal-body">
                    <p>{{ getTranslation("modal.excludeParticipants.description") }}</p>

                    <!-- Checkbox -->
                    <label class="checkbox-wrapper" v-for="(partecipante) in modalEscludiPartecipanti.esclusi">
                        <input type="checkbox" v-model="partecipante.escluso" />
                        <span class="check"></span>
                        {{ partecipante.nome }}
                    </label>
                </div>
                <div class="modal-footer justify-content-end mb-3">
                    <button class="button style-danger close-modal" @click="onDialogEsclusiClose">{{
                        getTranslation("button.close")
                    }}</button>
                </div>
            </div>
        </div>
    </div>
</template>