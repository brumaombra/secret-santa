<script setup>
import { onMounted } from 'vue';
import GlobalStore from '@/stores/store';
import { getTranslation, formatListEsclusi, actionModal, checkIfRedirect } from '@/utils/utils';
import { useRouter } from 'vue-router';

const router = useRouter();

// Ricomincio da capo
const handleNavBackRestartApp = () => {
    GlobalStore.elencoPartecipanti = [];
    router.push('/draw/step1'); // Torno all'inizio
};

// Appena è montato
onMounted(() => {
    actionModal("modalMessaggiSuccesso", "open"); // Apro il modal
});

checkIfRedirect(); // Controllo se ci sono gli elementi, altrimenti redirect
</script>

<template>
    <div id="step4View">
        <!-- Alert info -->
        <div class="alert" role="alert">
            <h4 class="alert-heading mb-1">{{ getTranslation("alert.step4.congrats") }}</h4>
            <p class="mb-0">{{ getTranslation("alert.step4.closingRemarks") }}</p>
            <p class="mb-0">{{ getTranslation("alert.step4.closingRemarks.2") }}</p>
        </div>

        <!-- Tabella partecipanti -->
        <div class="table-responsive-margin-top">
            <!-- Navbar tabella -->
            <div class="inline-flex flex-center justify-content-between w-100 mb-2 bruma-table-navbar">
                <div class="inline-flex flex-center">
                    <h2>{{ getTranslation("table.participants.summary") }}</h2>
                    <span class="badge edge-circle size-2x ml-2">{{ GlobalStore.elencoPartecipanti.length }}</span>
                </div>
            </div>

            <!-- Tabella -->
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
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(person, index) in GlobalStore.elencoPartecipanti">
                            <td class="table-cell-center bold">{{ index + 1 }}</td>
                            <td>{{ person.nome }}</td>
                            <td>{{ person.email }}</td>
                            <td>{{ formatListEsclusi(person.esclusi) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Navbar inferiore -->
            <div class="inline-flex flex-center justify-content-end w-100 mt-2 bruma-table-navbar navbar-table-bottom">
                <button class="button style-green w-100-mobile" @click="handleNavBackRestartApp"><i
                        class="fa-solid fa-arrow-rotate-left mr-2"></i>{{ getTranslation("button.redo") }}</button>
            </div>
        </div>

        <!-- Fuochi -->
        <div id="firework1" class="fireworks simple size-3x" aria-hidden="true">
            <span class="spark"></span>
            <span class="spark"></span>
            <span class="spark"></span>
            <span class="spark"></span>
        </div>
        <div id="firework2" class="fireworks simple size-3x" aria-hidden="true">
            <span class="spark"></span>
            <span class="spark"></span>
            <span class="spark"></span>
            <span class="spark"></span>
        </div>
        <div id="firework3" class="fireworks simple size-3x" aria-hidden="true">
            <span class="spark"></span>
            <span class="spark"></span>
            <span class="spark"></span>
            <span class="spark"></span>
        </div>
        <div id="firework4" class="fireworks simple size-3x" aria-hidden="true">
            <span class="spark"></span>
            <span class="spark"></span>
            <span class="spark"></span>
            <span class="spark"></span>
        </div>

        <!-- Modal successo -->
        <div id="modalMessaggiSuccesso" class="modal modalMessaggiSuccesso" tabindex="-1"
            aria-labelledby="modalMessaggiSuccessoTitle">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="inline-flex flex-center">
                        <i class="fa-solid fa-face-smile success size-2x mr-2"></i>
                        <h5 id="modalMessaggiSuccessoTitle" class="modal-title">{{ getTranslation("modal.success.title") }}
                        </h5>
                    </div>
                </div>
                <div class="modal-body">
                    <p>{{ GlobalStore.successModal.message }}</p>
                    <div class="mt-3" v-for="message in GlobalStore.successModal.list">
                        <!-- Alert di successo -->
                        <div v-if="message.code === '00'" class="alert style-success has-icon table-cell-center mb-0"
                            role="alert">
                            <div class="alert-svg">
                                <i class="fa-solid fa-check"></i>
                            </div>
                            {{ message.message }}
                        </div>

                        <!-- Alert di errore -->
                        <div v-if="message.code !== '00'" class="alert style-danger has-icon table-cell-center mb-0"
                            role="alert">
                            <div class="alert-svg">
                                <i class="fa-solid fa-xmark"></i>
                            </div>
                            {{ message.message }}
                        </div>
                    </div>
                </div>
                <div class="modal-footer justify-content-end mb-3">
                    <button class="button style-danger close-modal">{{ getTranslation("button.close") }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#firework1 {
    position: absolute;
    top: 30%;
    left: 75%;
}

#firework2 {
    position: absolute;
    top: 30%;
    left: 10%;
    --flatify__firework-animation-delay: 1.8s;
}

#firework3 {
    position: absolute;
    top: 40%;
    left: 30%;
    --flatify__firework-animation-delay: 1.1s;
}

#firework4 {
    position: absolute;
    top: 35%;
    left: 60%;
    --flatify__firework-animation-delay: 2.4s;
}

/* Mobile */
@media (max-width: 576px) {
    #firework1 {
        top: 30%;
        left: 65%;
    }

    #firework2 {
        top: 15%;
        left: 15%;
    }

    #firework3 {
        top: 40%;
        left: 30%;
    }

    #firework4 {
        top: 35%;
        left: 60%;
    }
}
</style>