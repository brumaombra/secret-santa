<script setup>
import Step2Store from '@/stores/step2.js';
import { getTranslation, setListOnCookies } from '@/utils/utils.js';

const viewModel = Step2Store; // View model

// Evento alla chiusura del dialog esclusi
const onDialogEsclusiClose = () => {
    setListOnCookies(); // Salvo lista su cookie
};
</script>

<template>
    <div id="excludedModal" class="modal" tabindex="-1">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ getTranslation("modal.excludeParticipants.title") }}</h5>
            </div>
            <div class="modal-body">
                <p>{{ getTranslation("modal.excludeParticipants.description") }}</p>

                <!-- Checkbox -->
                <label class="checkbox-wrapper" v-for="(partecipante) in viewModel.excludedDialogModel.esclusi">
                    <input type="checkbox" v-model="partecipante.escluso" />
                    <span class="check"></span>{{ partecipante.nome }}
                </label>
            </div>
            <div class="modal-footer justify-content-end mb-3">
                <button class="button style-danger close-modal" @click="onDialogEsclusiClose">{{ getTranslation("button.close") }}</button>
            </div>
        </div>
    </div>
</template>