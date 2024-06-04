<script setup>
import GlobalStore from '@/stores/global.js';
import { getTranslation } from '@/utils/utils.js';
</script>

<template>
    <div id="settingsModal" class="modal" tabindex="-1">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ getTranslation("lbl.modal.settings.title") }}</h5>
            </div>
            <div class="modal-body">
                <!-- Language -->
                <div>
                    <div class="inline-flex flex-center justify-content-between w-100">
                        <label class="form-label">{{ getTranslation("lbl.language") }}</label>
                        <img :src="`/img/flags/${GlobalStore.currentLanguage}-flag.png`" class="flagIconLanguage" />
                    </div>
                    <select class="form-select w-100" v-model="GlobalStore.currentLanguage">
                        <option v-for="item in GlobalStore.availableLanguages" :value="item.code">{{ item.name }}</option>
                    </select>
                    <div class="help-text size-sm lbl-m-l">{{ getTranslation("lbl.language.help.text") }}</div>
                </div>
            </div>
            <div class="modal-footer justify-content-end mb-3">
                <button class="button style-danger close-modal">{{ getTranslation("button.close") }}</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Flag icon */
.flagIconLanguage {
    width: 50px;
}
</style>