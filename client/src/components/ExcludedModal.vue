<script setup>
import Step2Store from '@/stores/step2.js';
import { getTranslation, setListOnCookies } from '@/utils/utils.js';

const viewModel = Step2Store; // View model

// Event on closing the excluded dialog
const handleCloseDialogPress = () => {
    setListOnCookies(); // Save list on cookies
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
                <label class="checkbox-wrapper" v-for="(partecipante) in viewModel.excludedDialogModel.excluded">
                    <input type="checkbox" v-model="partecipante.itemExcluded" />
                    <span class="check"></span>{{ partecipante.name }}
                </label>
            </div>
            <div class="modal-footer justify-content-end mb-3">
                <button class="button style-danger close-modal" @click="handleCloseDialogPress">{{ getTranslation("button.close") }}</button>
            </div>
        </div>
    </div>
</template>