<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Fireworks from '@/components/Fireworks.vue';
import GlobalStore from '@/stores/global.js';
import { getTranslation, formatListEsclusi, checkIfRedirect } from '@/utils/utils.js';

const router = useRouter(); // Router

// Restart from the beginning
const handleNavBackRestartApp = () => {
    GlobalStore.elencoPartecipanti = [];
    router.push('/draw/step1'); // Go back to the beginning
};

// onMounted hook
onMounted(() => {
    checkIfRedirect(); // Check if there are elements, otherwise redirect
});
</script>

<template>
    <div id="step4View">
        <!-- Alert info -->
        <div class="alert" role="alert">
            <h4 class="alert-heading mb-1">{{ getTranslation("alert.step4.congrats") }}</h4>
            <p class="mb-0">{{ getTranslation("alert.step4.closingRemarks") }}</p>
            <p class="mb-0">{{ getTranslation("alert.step4.closingRemarks.2") }}</p>
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

            <!-- Table -->
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

            <!-- Lower navbar -->
            <div class="inline-flex flex-center justify-content-end w-100 mt-2 bruma-table-navbar navbar-table-bottom">
                <button class="button style-green w-100-mobile" @click="handleNavBackRestartApp"><i class="fa-solid fa-arrow-rotate-left mr-2"></i>{{ getTranslation("button.redo") }}</button>
            </div>
        </div>

        <!-- Fireworks -->
        <Fireworks />
    </div>
</template>