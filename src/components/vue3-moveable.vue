<template>
  <div 
    class="window"
    :style="{ 
      top: windowTop + 'px', 
      left: windowLeft + 'px',
      width: windowWidth + 'px',
      height: windowHeight + 'px'
    }"
  >
    <div 
      class="window-header"
      @mousedown="startDrag"
    >
      Перемещаемое окно
      <button @click="closeWindow" class="close-btn">×</button>
    </div>
    <div class="window-body" :style="{ height: `calc(${windowHeight}px - 41px)` }">
      <draggable 
        v-model="users"
        item-key="id"
        @update="onDragUpdate"
      >
        <template #item="{ element }">
          <div class="user-item">
            <div class="user-info">
              <div class="user-name">{{ element.name }}</div>
              <div class="user-email">{{ element.email }}</div>
              <div class="user-status" :class="statusClass(element.status)">
                {{ element.status }}
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <!-- Ручка изменения размера -->
    <div class="resize-handle" @mousedown="startResize"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useDataStore } from '../stores/data';
import draggable from 'vuedraggable';

const store = useDataStore();
const users = ref([...store.users]);

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

const startDrag = (e) => {
  // Пропускаем, если клик был на кнопке закрытия или на ручке изменения размера
  if (e.target.classList.contains('close-btn') || 
      e.target.classList.contains('resize-handle')) return;
  
  isDragging.value = true;
  startX = e.clientX - windowLeft.value;
  startY = e.clientY - windowTop.value;
  
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
};

const onDrag = (e) => {
  if (!isDragging.value) return;
  
  windowLeft.value = e.clientX - startX;
  windowTop.value = e.clientY - startY;
  
  // Ограничиваем окно в пределах viewport
  const maxX = window.innerWidth - windowWidth.value;
  const maxY = window.innerHeight - windowHeight.value-60;
  
  windowLeft.value = Math.max(0, Math.min(windowLeft.value, maxX));
  windowTop.value = Math.max(0, Math.min(windowTop.value, maxY));
};

// Логика изменения размера
const startResize = (e) => {
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

const onResize = (e) => {
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
const statusClass = (status) => ({
  'text-green-500': status === 'Активен',
  'text-red-500': status === 'Неактивен'
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

<style scoped>
.window {
  position: fixed;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
  z-index: 1000;
  min-width: 250px;
  min-height: 200px;
}

.window-header {
  padding: 10px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  cursor: move;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0 5px;
}

.close-btn:hover {
  color: #666;
}

.window-body {
  padding: 10px;
  overflow-y: auto;
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

.user-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.user-email {
  font-size: 0.9em;
  color: #666;
}

.user-status {
  font-size: 0.8em;
}

.text-green-500 {
  color: green;
}

.text-red-500 {
  color: red;
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
  content: "";
  position: absolute;
  right: 4px;
  bottom: 4px;
  width: 8px;
  height: 8px;
  border-right: 2px solid #ccc;
  border-bottom: 2px solid #ccc;
}
</style>
