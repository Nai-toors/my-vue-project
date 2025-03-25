<script setup>
import aboutImage from '@/assets/rock.jpg'; // Импорт изображения из папки assets
</script>

<template>
  <div class="table-wrapper mt-6">
    <div class="flex justify-content-center">
      <img :src="aboutImage" alt="Описание изображения" class="" />
    </div>
    <p>опа</p>
  </div>
</template>

<style scoped>
.table-wrapper {
  max-width: 95%;
  margin: 0 auto;
}
</style>
