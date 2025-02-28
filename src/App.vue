<template>
  <div class="app-container">
    <Header />
    
    <main class="content p-4 md:p-6">
      <div class="container mx-auto">
        <DataTable />
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import DataTable from './components/DataTable.vue'
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.content {
  flex: 1;
}

body {
  margin: 0;
  padding: 0;
  font-family: var(--font-family);
  color: var(--text-color);
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
</style>