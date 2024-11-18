import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'flatifycss/dist/css/flatify-min.css';
import 'flatifycss/dist/js/flatify-min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'wow.js/css/libs/animate.css';
import './assets/styles/main.css';

const app = createApp(App);
app.use(router);
app.mount('#app');