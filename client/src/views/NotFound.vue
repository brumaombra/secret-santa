<script setup>
import { getTranslation } from '@/utils/utils.js';
</script>

<template>
    <div class="d-flex justify-content-center text-center pl-4">
        <h1 class="mb-3">404</h1>
        <p class="mb-4"><b>{{ getTranslation("pageNotFound.wrong.page") }}</b></p>
        <RouterLink to="/"><button class="button custom-red-style">{{ getTranslation("pageNotFound.btn.go.back") }}</button></RouterLink>
        <img src="/img/santa_presents.png" class="santa-image mt-5" />
    </div>
</template>

<style scoped>
.santa-image {
    border-radius: 80px;
}
</style>