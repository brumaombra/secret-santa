<script setup>
import Navbar from '@/components/Navbar.vue';
import Busy from '@/components/Busy.vue';
import { RouterView } from 'vue-router';
import { setAppLanguage, getListFromCookie } from '@/utils/utils';

// Funzioni iniziali
setAppLanguage();
getListFromCookie();
</script>

<template>
	<!-- Contenitore app -->
	<div class="mb-5 app-container">
		<!-- Navbar -->
		<Navbar />

		<!-- Container principale -->
		<div class="container-xxl main-content-container">
			<RouterView />
		</div>

		<!-- Busy -->
		<Busy />
	</div>
</template>

<style scoped>
@keyframes fadeIn {
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
}

.app-container {
	opacity: 0;

	/* Animazione fade-In */
	animation-name: fadeIn;
	animation-duration: 1s;
	animation-fill-mode: forwards;
	animation-delay: .5s;
}

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