<script setup>
import GlobalStore from '../stores/store';
import { getTranslation } from '@/utils/utils';
</script>

<template>
    <!-- Header -->
    <nav class="menu-items-wrapper navbar sticky-top">
        <div class="container-xxl inline-flex flex-center justify-content-between w-100">
            <ul class="links">
                <li class="link-title inline-flex flex-center">
                    <RouterLink to="/">{{ getTranslation("lbl.navbar.app.title") }}</RouterLink>
                    <img src="/img/secret_santa_logo.png" width="40px" class="ml-2" />
                </li>
            </ul>
            <div class="push-right">
                <i class="fa-solid fa-gear settings-icon open-modal" data-modal-target=".modalImpostazioni"></i>
            </div>
        </div>
    </nav>

    <!-- Modal impostazioni -->
    <div id="modalImpostazioni" class="modal modalImpostazioni" tabindex="-1" aria-labelledby="modalImpostazioniTitle">
        <div class="modal-content">
            <div class="modal-header">
                <h5 id="modalImpostazioniTitle" class="modal-title">{{ getTranslation("lbl.modal.settings.title") }}</h5>
            </div>
            <div class="modal-body">
                <!-- Lingua -->
                <div>
                    <div class="inline-flex flex-center justify-content-between w-100">
                        <label for="selectLingua" class="form-label">{{ getTranslation("lbl.language") }}</label>
                        <img :src="`/santa/img/flags/${GlobalStore.currentLanguage}-flag.png`" class="flagIconLanguage" />
                    </div>
                    <select id="selectLingua" class="form-select w-100" v-model="GlobalStore.currentLanguage">
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
.navbar .link-title a {
    font-size: 23px;
    font-weight: 1000;
    text-decoration: none;
}

.navbar .settings-icon {
    font-size: 23px;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
}
</style>