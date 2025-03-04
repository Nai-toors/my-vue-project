<script setup>
// Используем setup script для нового стиля компонентов Vue 3
</script>

<template>
  <div class="header">
    <div class="surface-0 shadow-2 p-3">
      <div class="flex justify-content-between align-items-center">
        <div class="logo text-2xl font-bold">
          <span class="text-primary">Vue</span> Project
        </div>
        <div class="flex align-items-center">
          <ul class="menu flex list-none m-0 p-0">
            <li class="mr-4"><a href="#" class="no-underline text-700 hover:text-primary">Главная</a></li>
            <li class="mr-4"><a href="#" class="no-underline text-700 hover:text-primary">О проекте</a></li>
            <li><a href="#" class="no-underline text-700 hover:text-primary">Контакты</a></li>
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
  transition: color 0.3s;
}
</style>