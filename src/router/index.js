import { createRouter, createWebHistory } from "vue-router";
import Index from '../views/Index.vue'
import Measurements from '../views/Measurements.vue'

const routes = [
    {
        path: '/',
        component: Index
    },
    {
        path: '/measurements',
        component: Measurements
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
