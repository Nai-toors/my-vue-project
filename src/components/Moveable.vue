<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useDataStore } from '../stores/data';
import draggable from 'vuedraggable';

const store = useDataStore();
const users = ref([...store.users]);

// Наблюдение за изменениями в store.users
watch(
  () => store.users, // Что отслеживаем
  (newUsers, oldUsers) => {
    console.log('store.users изменился:', { oldUsers, newUsers });
  },
  { deep: true } // Глубокое отслеживание вложенных объектов
);

// Логика перетаскивания окна
const windowTop = ref(100);
const windowLeft = ref(100);
const windowWidth = ref(300);
const windowHeight = ref(465);
const isDragging = ref(false);
const isResizing = ref(false);
let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;

const startDrag = e => {
  // Пропускаем, если клик был на кнопке закрытия или на ручке изменения размера
  if (e.target.classList.contains('close-btn') || e.target.classList.contains('resize-handle')) return;

  isDragging.value = true;
  startX = e.clientX - windowLeft.value;
  startY = e.clientY - windowTop.value;

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
};

const onDrag = e => {
  if (!isDragging.value) return;

  windowLeft.value = e.clientX - startX;
  windowTop.value = e.clientY - startY;

  // Ограничиваем окно в пределах viewport
  const maxX = window.innerWidth - windowWidth.value;
  const maxY = window.innerHeight - windowHeight.value - 60;

  windowLeft.value = Math.max(0, Math.min(windowLeft.value, maxX));
  windowTop.value = Math.max(0, Math.min(windowTop.value, maxY));
};

// Логика изменения размера
const startResize = e => {
  isResizing.value = true;
  startX = e.clientX;
  startY = e.clientY;
  startWidth = windowWidth.value;
  startHeight = windowHeight.value;

  document.addEventListener('mousemove', onResize);
  document.addEventListener('mouseup', stopResize);

  // Предотвращаем конфликты с перетаскиванием
  e.stopPropagation();
  e.preventDefault();
};

const onResize = e => {
  if (!isResizing.value) return;

  // Вычисляем новые размеры
  const newWidth = startWidth + (e.clientX - startX);
  const newHeight = startHeight + (e.clientY - startY);

  // Устанавливаем минимальные размеры
  windowWidth.value = Math.max(250, newWidth);
  windowHeight.value = Math.max(200, newHeight);
};

const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', onResize);
  document.removeEventListener('mouseup', stopResize);
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

const onDragUpdate = () => {
  store.users = [...users.value];
};

const closeWindow = () => {
  // Логика закрытия окна
};

// Функция для установки класса статуса
const statusClass = status => ({
  'text-green-500': status === 'Активен',
  'text-red-500': status === 'Неактивен',
});

onMounted(() => {
  window.addEventListener('mouseup', () => {
    stopDrag();
    stopResize();
  });
});

onUnmounted(() => {
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('mouseup', stopResize);
});
</script>

<template>
  <!-- Окно -->
  <div
    class="fixed border-round shadow-2 bg-white overflow-hidden user-select-none"
    :style="{
      top: windowTop + 'px',
      left: windowLeft + 'px',
      width: windowWidth + 'px',
      height: windowHeight + 'px',
    }"
  >
    <!-- Заголовок окна -->
    <div
      class="flex align-items-center justify-content-between p-2 border-bottom-1 surface-border bg-gray-200"
      style="cursor: move"
      @mousedown="startDrag"
    >
      <span>Перемещаемое окно</span>
      <button @click="closeWindow" class="p-link text-2xl close-btn">×</button>
    </div>

    <!-- Тело окна (список пользователей) -->
    <div class="p-2 overflow-auto" :style="{ height: `calc(${windowHeight}px - 41px)` }">
      <draggable v-model="users" item-key="id" @update="onDragUpdate">
        <template #item="{ element }">
          <div class="user-item">
            <div class="font-bold mb-1">{{ element.name }}</div>
            <div class="text-sm text-secondary mb-1">{{ element.email }}</div>
            <div class="text-xs" :class="statusClass(element.status)">
              {{ element.status }}
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <!-- Ручка изменения размера -->
    <div class="resize-handle" @mousedown="startResize"></div>
  </div>
</template>

<style scoped>
.fixed {
  position: fixed;
  z-index: 1000;
}

.close-btn {
  border: none;
  background: none;
  cursor: pointer;
}

/* Отключаем выделение текста (user-select) */
.user-select-none {
  user-select: none;
}

.user-item {
  padding: 10px;
  margin: 5px 0;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  transition: all 0.3s;
  cursor: move;
}

.user-item:hover {
  background: #f9f9f9;
  transform: translateX(5px);
}

/* Ручка изменения размера */
.resize-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  cursor: se-resize;
  background: transparent;
  z-index: 10;
}

.resize-handle::after {
  content: '';
  position: absolute;
  right: 4px;
  bottom: 4px;
  width: 8px;
  height: 8px;
  border-right: 2px solid #ccc;
  border-bottom: 2px solid #ccc;
}
</style>
