<script setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
  <div class="app-container">
    <Header />
    <main class="flex-1">
      <div class="container mx-auto">
        <router-view />
      </div>
    </main>
    <Footer />
  </div>
</template>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

body {
  margin: 0;
  padding: 0;
}

.container {
  width: 100%;
  margin: 0 auto;
}
</style>
