<script setup>
import GlobalStore from '@/stores/global.js';
import { getTranslation } from '@/utils/utils.js';

const viewModel = GlobalStore; // View model
</script>

<template>
    <div id="messageListModal" class="modal" tabindex="-1">
        <div class="modal-content">
            <div class="modal-header">
                <div v-if="viewModel.messageListDialogModel.type === 'SUCCESS'" class="inline-flex flex-center">
                    <i class="fa-solid fa-face-smile success size-2x mr-2"></i>
                    <h5 class="modal-title">{{ getTranslation("modal.success.title") }}</h5>
                </div>
                <div v-if="viewModel.messageListDialogModel.type === 'ERROR'" class="inline-flex flex-center">
                    <i class="fa-solid fa-face-frown danger size-2x mr-2"></i>
                    <h5 class="modal-title">{{ getTranslation("modal.error.title") }}</h5>
                </div>
            </div>
            <div class="modal-body">
                <p>{{ viewModel.messageListDialogModel.message }}</p>
                <div class="mt-3" v-for="messageItem in viewModel.messageListDialogModel.list">
                    <!-- Success alert -->
                    <div v-if="messageItem.code === 'SUCCESS'" class="alert style-success has-icon table-cell-center mb-0" role="alert">
                        <div class="alert-svg">
                            <i class="fa-solid fa-check"></i>
                        </div>
                        {{ messageItem.message }}
                    </div>

                    <!-- Error alert -->
                    <div v-if="messageItem.code === 'ERROR'" class="alert style-danger has-icon table-cell-center mb-0" role="alert">
                        <div class="alert-svg">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                        {{ messageItem.message }}
                    </div>
                </div>
            </div>
            <div class="modal-footer justify-content-end mb-3">
                <button class="button style-danger close-modal">{{ getTranslation("button.close") }}</button>
            </div>
        </div>
    </div>
</template>