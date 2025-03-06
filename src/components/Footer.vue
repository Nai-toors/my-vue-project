<script setup>
// Используем setup script для нового стиля компонентов Vue 3
</script>

<template>
  <div class="footer bg-primary text-white p-3">
    <div class="container">
      <div class="flex justify-content-between align-items-center">
        <div>
          <p class="m-0 p-1">&copy; 2025 Vue Project. Все права защищены.</p>
        </div>
        <div>
          <ul class="footer-links flex list-none m-0 p-0">
            <li class="mr-3">
              <a href="#" class="text-white no-underline hover:text-blue-200"
                >Политика конфиденциальности</a
              >
            </li>
            <li>
              <a href="#" class="text-white no-underline hover:text-blue-200"
                >Условия использования</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.footer {
  margin-top: auto;
  background-color: black !important;
}
</style>
