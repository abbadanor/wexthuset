<script setup>
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
</script>

<template>
    <Header></Header>
    <div class="w-full">
        <router-view></router-view>
    </div>
    <Footer></Footer>
</template>
