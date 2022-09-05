<script setup>
  import Header from './components/Header.vue'
  import Footer from './components/Footer.vue'
</script>

<template>
  <div class="min-h-screen w-full">
    <Header></Header>
    <div class="flex justify-center">
      <router-view></router-view>
    </div>
    <Footer></Footer>
  </div>
</template>
