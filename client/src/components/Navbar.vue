<script setup>
import SettingsModal from '@/components/SettingsModal.vue';
import { getTranslation } from '@/utils/utils.js';
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
                <i class="fa-solid fa-gear settings-icon open-modal" data-modal-target="#settingsModal"></i>
            </div>
        </div>
    </nav>

    <!-- Settings modal -->
	<SettingsModal />
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