<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ConfirmModal from '@/components/ConfirmModal.vue';
import GlobalStore from '@/stores/global.js';
import { getTranslation, busy, deleteCookies, formatListEsclusi, checkIfRedirect, drawPairs, cloneObject, openMessageListModal } from '@/utils/utils.js';

const router = useRouter(); // Router

// Format participants for the backend call
const formatParticipants = participants => {
    participants.forEach((participant, index) => {
        const excluded = participant.excluded ? participant.excluded.filter(item => item.itemExcluded).map(item => item.id) : []; // Remove unselected excluded participants and keep only IDs
        participant.id = index;
        participant.excluded = excluded;
        participant.recipient = null;
    });
    return participants; // Return the formatted array
};

// Call the backend
const drawPairsbackend = async (formattedParticipants, lang) => {
    try {
        busy(true); // Busy on
        const response = await drawPairs(formattedParticipants, lang);
        // deleteCookies(); // Delete cookies
        setTimeout(() => { // Workaround to display dark background
            busy(false); // Busy off
            setTimeout(() => {
                router.push('/draw/step4'); // Advance the step
                setTimeout(() => {
                    openMessageListModal('open', 'SUCCESS', response.message || getTranslation('modal.success.default.text'), response.list); // Open the modal
                }, 250);
            }, 250);
        }, 250);
    } catch (error) {
        setTimeout(() => { // Workaround to display dark background
            busy(false); // Busy off
            setTimeout(() => {
                openMessageListModal('open', 'ERROR', error.message || getTranslation('message.error.extraction')); // Open the modal
            }, 250);
        }, 250);
    }
};

// Handler for the confirm button in the dialog
const handleConfermaPress = () => {
    const participants = cloneObject(GlobalStore.elencoPartecipanti);
    const formattedParticipants = formatParticipants(participants);
    const lang = cloneObject(GlobalStore.currentLanguage);
    drawPairsbackend(formattedParticipants, lang); // Call the backend
};

// onMounted hook
onMounted(() => {
    checkIfRedirect(); // Check if there are elements, otherwise redirect
});
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

        <!-- Participants table -->
        <div class="table-responsive-margin-top">
            <!-- Table navbar -->
            <div class="inline-flex flex-center justify-content-between w-100 mb-2 bruma-table-navbar">
                <div class="inline-flex flex-center">
                    <h2>{{ getTranslation("table.participants.summary") }}</h2>
                    <span class="badge edge-circle size-2x ml-2">{{ GlobalStore.elencoPartecipanti.length }}</span>
                </div>
            </div>

            <!-- Table body -->
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
                            <td>{{ person.name }}</td>
                            <td>{{ person.email }}</td>
                            <td>{{ formatListEsclusi(person.excluded) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Bottom navbar -->
            <div class="inline-flex flex-center justify-content-between w-100 mt-2 bruma-table-navbar navbar-table-bottom">
                <button class="button style-accent" @click="router.push('/draw/step2')"><i class="fa-solid fa-arrow-left mr-2"></i>{{ getTranslation("button.back") }}</button>
                <button class="button style-green open-modal" data-modal-target="#confirmModalSend"><i class="fa-solid fa-paper-plane mr-2"></i>{{ getTranslation("button.send") }}</button>
            </div>
        </div>

        <!-- Confirm modal -->
        <ConfirmModal id="confirmModalSend" :message="getTranslation('modal.confirmation.body')" @confirm="handleConfermaPress" />
    </div>
</template>