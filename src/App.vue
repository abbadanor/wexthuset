<script setup>
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
</script>

<template>
    <div class="min-h-screen relative overflow-hidden pb-16">
        <Header></Header>
        <router-view></router-view>
        <Footer></Footer>
    </div>
</template>
