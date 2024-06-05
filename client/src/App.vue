<script setup>
import { RouterView } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import MessageListModal from '@/components/MessageListModal.vue';
import Busy from '@/components/Busy.vue';
import { setAppLanguage, getListFromCookie } from '@/utils/utils.js';

// Init functions
setAppLanguage();
getListFromCookie();
</script>

<template>
	<!-- App container -->
	<div class="mb-5">
		<!-- Navbar -->
		<Navbar />

		<!-- Main container -->
		<div class="container-xxl main-content-container">
			<RouterView />
		</div>
	</div>

	<!-- Message list modal -->
	<MessageListModal />

	<!-- Busy indicator -->
	<Busy />
</template>

<style scoped>
/* Container app */
.main-content-container {
	padding-top: 2rem;
}

/* Mobile */
@media (max-width: 576px) {
	.main-content-container {
		padding-top: 2rem;
		padding-left: 1rem;
		padding-right: 1rem;
	}
}
</style>