import { createRouter } from "vue-router";
import { createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Step1 from '@/views/draw/Step1.vue';
import Step2 from '@/views/draw/Step2.vue';
import Step3 from '@/views/draw/Step3.vue';
import Step4 from '@/views/draw/Step4.vue';

export default createRouter({
    history: createWebHistory('/'),
    routes: [{
        path: '/',
        name: 'home',
        component: Home
    }, {
        path: '/draw/step1',
        name: 'step1',
        component: Step1
    }, {
        path: '/draw/step2',
        name: 'step2',
        component: Step2
    }, {
        path: '/draw/step3',
        name: 'step3',
        component: Step3
    }, {
        path: '/draw/step4',
        name: 'step4',
        component: Step4
    }]
});