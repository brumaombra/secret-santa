<script setup>
import validator from 'validator';
import Step1Store from '@/stores/step1.js';
import { getTranslation } from '@/utils/utils.js';

const emit = defineEmits(['savePress']); // Define emits
const viewModel = Step1Store; // View model

// Valido il campo nome
const validateNome = event => {
    viewModel.participantDialogModel.nomeIsValid = event.target.value.trim() ? validator.matches(event.target.value, /^[a-zA-Z0-9 ]*$/) : false; // Valido il nome
    viewModel.participantDialogModel.buttonSaveEnabled = viewModel.participantDialogModel.nomeIsValid && viewModel.participantDialogModel.emailIsValid; // Abilito o disabilito il pulsante salva
};

// Valido il campo email
const validateEmail = event => {
    viewModel.participantDialogModel.emailIsValid = validator.isEmail(event.target.value); // Valido l'email
    viewModel.participantDialogModel.buttonSaveEnabled = viewModel.participantDialogModel.nomeIsValid && viewModel.participantDialogModel.emailIsValid; // Abilito o disabilito il pulsante salva
};
</script>

<template>
    <div id="participantModal" class="modal" tabindex="-1">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ viewModel.participantDialogModel.currentEdit ? getTranslation("modal.editParticipant") : getTranslation("modal.addParticipant") }}</h5>
            </div>
            <div class="modal-body">
                <p>{{ viewModel.participantDialogModel.currentEdit ? getTranslation("modal.editParticipantInstruction") : getTranslation("modal.addParticipantInstruction") }}</p>

                <!-- Name -->
                <div class="mt-3">
                    <label class="form-label">{{ getTranslation("modal.participantName") }}</label>
                    <input v-model="viewModel.participantDialogModel.nome" type="text" @input="validateNome" maxlength="50" class="form-control w-100" :class="{ 'is-invalid': !viewModel.participantDialogModel.nomeIsValid }" />
                    <div class="help-text size-sm lbl-m-l">{{ getTranslation("modal.participantNameHelp") }}</div>
                </div>

                <!-- Email -->
                <div class="mt-3">
                    <label class="form-label">{{ getTranslation("modal.participantEmail") }}</label>
                    <input v-model="viewModel.participantDialogModel.email" type="email" @input="validateEmail" maxlength="50" class="form-control w-100" :class="{ 'is-invalid': !viewModel.participantDialogModel.emailIsValid }">
                    <div class="help-text size-sm lbl-m-l">{{ getTranslation("modal.participantEmailHelp") }}</div>
                </div>
            </div>
            <div class="modal-footer mb-3">
                <button class="button style-danger close-modal">{{ getTranslation("modal.closeButton") }}</button>
                <button class="button style-info close-modal" @click="$emit('savePress')" :disabled="!viewModel.participantDialogModel.buttonSaveEnabled">{{ getTranslation("modal.saveButton") }}</button>
            </div>
        </div>
    </div>
</template>