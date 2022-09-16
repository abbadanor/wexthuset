import { createRouter, createWebHistory } from "vue-router";
import Index from '../views/Index.vue'
import Measurements from '../views/Measurements.vue'
import Configure from '../views/Configure.vue'

const routes = [
    {
        path: '/',
        component: Index
    },
    {
        path: '/measurements',
        component: Measurements
    },
    {
        path: '/configure',
        component: Configure
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
