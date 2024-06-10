<script setup>
import { useRouter } from 'vue-router';
import ParticipantModal from '@/components/ParticipantModal.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import GlobalStore from '@/stores/global.js';
import Step1Store from '@/stores/step1.js';
import { getTranslation, setListOnCookies, actionModal, cloneObject } from '@/utils/utils.js';

const router = useRouter(); // Router
const viewModel = Step1Store; // View model

// Handler for the add button in the dialog
const handleSaveDialogPress = () => {
    const partecipante = { // New participant object
        name: viewModel.participantDialogModel.name,
        email: viewModel.participantDialogModel.email
    };

    // Add or modify
    if (viewModel.participantDialogModel.currentEdit !== null) // If the user is editing a participant
        GlobalStore.elencoPartecipanti.splice(viewModel.participantDialogModel.currentEdit, 1, partecipante); // Modify record
    else // If the user is adding a new participant
        GlobalStore.elencoPartecipanti.push(partecipante); // Add
    clearModalNuovoPartecipante(); // Clear new participant modal
    setListOnCookies(); // Save list to cookie
    actionModal('participantModal', 'close'); // Hide dialog
};

// Open the delete confirmation dialog
const handleOpenConfirmDeleteDialogPress = index => {
    viewModel.deleteId = index; // Save the ID to delete
    actionModal('confirmModalDelete', 'open'); // Open dialog
};

// Delete a participant from the list
const handleDeleteParticipantPress = () => {
    const index = viewModel.deleteId; // ID to delete
    GlobalStore.elencoPartecipanti.splice(index, 1); // Delete record
    setListOnCookies(); // Save list to cookie
};

// Handler for the edit button in the dialog
const handleOpenEditDialogPress = index => {
    const selected = cloneObject(GlobalStore.elencoPartecipanti[index]);
    Object.assign(viewModel.participantDialogModel, {
        name: selected.name,
        email: selected.email,
        currentEdit: index, // Flag to indicate that the user is editing a participant
        nameIsValid: true, // Flag to indicate if the name is valid
        emailIsValid: true, // Flag to indicate if the email is valid
        buttonSaveEnabled: true // Flag to indicate if the save button is enabled
    });
    setListOnCookies(); // Save list to cookie
    actionModal('participantModal', 'open'); // Open dialog
};

// Clear new participant modal
const clearModalNuovoPartecipante = () => {
    Object.assign(viewModel.participantDialogModel, {
        name: '',
        email: '',
        currentEdit: null, // Flag to indicate that the user is editing a participant
        nameIsValid: false, // Flag to indicate if the name is valid
        emailIsValid: false, // Flag to indicate if the email is valid
        buttonSaveEnabled: false // Flag to indicate if the save button is enabled
    });
};

// Add the list of excludable people
const addExcludableList = () => {
    const participantList = cloneObject(GlobalStore.elencoPartecipanti || []);
    const excludableList = participantList.map((item, index) => ({ id: index, name: item.name, itemExcluded: false })); // Create e the list of excludable people
    participantList.forEach((item, index) => {
        item.excluded = excludableList.filter(partecipante => partecipante.id !== index); // Remove itself from the list of excludable people
    });
    GlobalStore.elencoPartecipanti = cloneObject(participantList); // Set the values
};

// Handle next step button press
const handleNextStepPress = () => {
    addExcludableList(); // Add the list of excludable people
    router.push('/draw/step2'); // Move to the next step
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

        <!-- Participants table -->
        <div class="table-responsive-margin-top">
            <!-- Table navbar -->
            <div class="inline-flex flex-center justify-content-between w-100 mb-2 bruma-table-navbar step1-table-navbar">
                <div class="inline-flex flex-center">
                    <h2>{{ getTranslation("table.participants.heading") }}</h2>
                    <span class="badge edge-circle size-2x ml-2">{{ GlobalStore.elencoPartecipanti.length }}</span>
                </div>
                <button class="button style-accent open-modal" data-modal-target="#participantModal" @click="clearModalNuovoPartecipante"><i class="fa-solid fa-plus mr-2"></i>{{ getTranslation("button.add") }}</button>
            </div>

            <!-- Table body -->
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

                        <!-- Valid records -->
                        <tr v-if="GlobalStore.elencoPartecipanti.length > 0" v-for="(person, index) in GlobalStore.elencoPartecipanti">
                            <td class="table-cell-center bold">{{ index + 1 }}</td>
                            <td>{{ person.name }}</td>
                            <td>{{ person.email }}</td>
                            <td class="table-cell-center"><i class="fa-solid fa-pen-to-square bruma-table-partecipanti-icon edit" :title="getTranslation('table.participants.btnEdit')" @click="handleOpenEditDialogPress(index)"></i></td>
                            <td class="table-cell-center"><i class="fa-solid fa-trash bruma-table-partecipanti-icon delete" :title="getTranslation('table.participants.btnDelete')" @click="handleOpenConfirmDeleteDialogPress(index)"></i></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Bottom navbar -->
            <div class="inline-flex flex-center justify-content-end w-100 mt-2 bruma-table-navbar navbar-table-bottom">
                <button class="button style-accent" :disabled="GlobalStore.elencoPartecipanti.length < 3" @click="handleNextStepPress">{{ getTranslation("button.forward") }}<i class="fa-solid fa-arrow-right ml-2"></i></button>
            </div>
        </div>

        <!-- Participant modal -->
        <ParticipantModal @savePress="handleSaveDialogPress" />

        <!-- Confirm modal -->
        <ConfirmModal id="confirmModalDelete" :message="getTranslation('message.confirm.delete.participant')" @confirm="handleDeleteParticipantPress" />
    </div>
</template>