<script setup>
import { getTranslation } from '@/utils/utils.js';

// Props
const props = defineProps({
    id: { type: String, default: "confirmModal" },
    message: { type: String, default: "Confirm?" }
});

const emit = defineEmits(['confirm']); // Define emits
</script>

<template>
    <div :id="props.id" class="modal" tabindex="-1">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ getTranslation("modal.confirmation.title") }}</h5>
            </div>
            <div class="modal-body">
                <p>{{ props.message }}</p>
            </div>
            <div class="modal-footer mb-3">
                <button class="button style-danger close-modal">{{ getTranslation("button.close") }}</button>
                <button class="button two-layer-button style-green close-modal" @click="$emit('confirm')">{{ getTranslation("button.confirm") }}
                    <span class="secondary-text">
                        <i class="fa-solid fa-thumbs-up"></i>
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>