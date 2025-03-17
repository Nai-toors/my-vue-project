<script setup>
// setup script при необходимости
</script>

<template>
  <div class="header">
    <div class="surface-0 shadow-2 p-3">
      <div class="flex justify-content-between align-items-center">
        <div class="logo text-2xl font-bold">
          <router-link to="/" class="text-primary no-underline">Vue Project</router-link>
        </div>
        <div class="flex align-items-center">
          <ul class="menu flex list-none m-0 p-0">
            <li class="mr-4">
              <router-link :to="{ name: 'Home' }" class="no-underline text-700 hover:text-primary">Главная</router-link>
            </li>
            <li class="mr-4">
              <router-link :to="{ name: 'About' }" class="no-underline text-700 hover:text-primary">О проекте</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  width: 100%;
}

.logo {
  transition: color 0.2s;
}
</style>
