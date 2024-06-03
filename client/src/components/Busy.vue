<template>
    <!-- Full screen busy indicator -->
    <div id="fullScreenBusy" class="fullscreen-loader">
        <div class="spinner-container">
            <span class="loading color-blue size-3x"></span>
        </div>
    </div>
</template>

<style scoped>
.fullscreen-loader {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 9999;
}
.fullscreen-loader .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>