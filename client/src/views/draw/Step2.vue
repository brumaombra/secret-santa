<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ExcludedModal from '@/components/ExcludedModal.vue';
import GlobalStore from '@/stores/global.js';
import Step2Store from '@/stores/step2.js';
import { getTranslation, formatListEsclusi, actionModal, checkIfRedirect } from '@/utils/utils.js';

const router = useRouter(); // Router
const viewModel = Step2Store; // View model

// Open the dialog to exclude participants
const handleOpenEscludiDialogPress = index => {
    const selected = GlobalStore.elencoPartecipanti[index];
    Object.assign(viewModel.excludedDialogModel, {
        name: selected.name,
        email: selected.email,
        excluded: selected.excluded
    });
    actionModal('excludedModal', 'open'); // Open the modal
};

// onMounted hook
onMounted(() => {
    checkIfRedirect(); // Check if there are elements, otherwise redirect
});
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

        <!-- Participants table -->
        <div class="table-responsive-margin-top">
            <!-- Table navbar -->
            <div class="inline-flex flex-center justify-content-between w-100 mb-2 bruma-table-navbar">
                <div class="inline-flex flex-center">
                    <h2>{{ getTranslation("table.participants.heading") }}</h2>
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
                            <th width="60px"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(person, index) in GlobalStore.elencoPartecipanti">
                            <td class="table-cell-center bold">{{ index + 1 }}</td>
                            <td>{{ person.name }}</td>
                            <td>{{ person.email }}</td>
                            <td>{{ formatListEsclusi(person.excluded) }}</td>
                            <td class="table-cell-center"><i class="fa-solid fa-list-check bruma-table-partecipanti-icon exclude" @click="handleOpenEscludiDialogPress(index)"></i></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Bottom navbar -->
            <div class="inline-flex flex-center justify-content-between w-100 mt-2 bruma-table-navbar navbar-table-bottom">
                <button class="button style-accent" @click="router.push('/draw/step1')"><i class="fa-solid fa-arrow-left mr-2"></i>{{ getTranslation("button.back") }}</button>
                <button class="button style-accent" @click="router.push('/draw/step3')">{{ getTranslation("button.forward") }}<i class="fa-solid fa-arrow-right ml-2"></i></button>
            </div>
        </div>

        <!-- Excluded modal -->
        <ExcludedModal />
    </div>
</template>