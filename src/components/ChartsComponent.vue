<script setup>
// --- Импорты ---
import { ref, onMounted, computed, reactive, nextTick } from 'vue';
import axios from 'axios';
import { pieChartData, barChartData, candlestickData } from '@/stores/chartsData.js'; // Убедитесь, что путь верный
import BaseChart from '@/components/BaseChart.vue'; // Убедитесь, что путь верный

// --- Конфигурация графиков ---
const chartConfigs = reactive([
  {
    id: 'line',
    name: 'Line Chart (API)',
    isLoading: ref(false),
    error: ref(null),
    options: ref({}), // Начинаем с пустого ref для опций
    /** Асинхронная функция загрузки данных для этого графика */
    async fetchData() {
      // console.log(`[${this.id}] Начинаем fetchData`);
      this.isLoading.value = true;
      this.error.value = null;
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        // console.log(`[${this.id}] API ответ получен`);
        const posts = response.data.slice(0, 10);
        if (!posts || posts.length === 0) throw new Error('Данные постов не получены');

        const xData = posts.map(post => post.id);
        const yData = posts.map(post => post.title.length);
        // console.log(`[${this.id}] Данные обработаны`);

        // Формируем и устанавливаем новые опции
        this.options.value = {
          title: { text: 'Длина заголовка поста (API)' },
          tooltip: { trigger: 'axis' }, // 'axis' лучше для line chart
          xAxis: { type: 'category', data: xData },
          yAxis: { type: 'value' },
          series: [{ data: yData, type: 'line', smooth: true }], // smooth для красоты
          grid: { containLabel: true },
        };
        // console.log(`[${this.id}] Новые опции установлены`);

      } catch (err) {
        const errorMessage = `Ошибка API: ${err.message || 'Неизвестная ошибка'}`;
        console.error(`[${this.id}] Ошибка в fetchData:`, err);
        this.error.value = errorMessage;
        // Устанавливаем опции для отображения ошибки на графике
        this.options.value = {
            title: {
                text: 'Ошибка загрузки',
                subtext: errorMessage.substring(0, 100) + (errorMessage.length > 100 ? '...' : ''), // Ограничим длину
                left: 'center', top: 'center',
                textStyle: { color: '#dc3545', fontSize: 16 },
                subtextStyle: { color: '#dc3545', fontSize: 12 }
             }
        };
      } finally {
        this.isLoading.value = false;
        // console.log(`[${this.id}] fetchData завершен`);
      }
    },
    /** Устанавливает начальные опции (например, "Загрузка...") */
    initOptions() {
      // console.log(`[${this.id}] Установка начальных опций (Загрузка...)`);
      this.options.value = {
        title: { text: 'Загрузка...', left: 'center', top: 'center' }
      };
    }
  },
  {
    id: 'pie',
    name: 'Pie Chart',
    isLoading: ref(false), // Хотя загрузки нет, оставим для единообразия
    error: ref(null),
    options: ref({ // Статические опции задаем сразу
      title: { text: 'Pie Chart - Пример данных' },
      tooltip: { trigger: 'item' },
      legend: { top: 'bottom' }, // Добавим легенду
      series: [{
        name: 'Пример', type: 'pie',
        radius: ['40%', '70%'], // Бублик
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: {
            label: { show: true, fontSize: '20', fontWeight: 'bold' }
        },
        labelLine: { show: false },
        data: pieChartData,
      }],
      grid: { containLabel: true } // Хотя для pie не так важно, оставим
    }),
    fetchData: null, initOptions: null,
  },
  {
    id: 'bar',
    name: 'Bar Chart',
    isLoading: ref(false), error: ref(null),
    options: ref({
      title: { text: 'Bar Chart - Пример данных' },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: { type: 'category', data: barChartData.categories },
      yAxis: { type: 'value' },
      series: [{ data: barChartData.data, type: 'bar' }],
      grid: { containLabel: true },
    }),
    fetchData: null, initOptions: null,
  },
  {
    id: 'candlestick',
    name: 'Candlestick Chart',
    isLoading: ref(false), error: ref(null),
    options: ref({
      title: { text: 'Candlestick Chart - Пример данных' },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        // Можно вернуть ваш formatter, если стандартный не устраивает
      },
      xAxis: { type: 'category', data: candlestickData.dates, axisLine: { onZero: false } },
      yAxis: { scale: true, splitArea: { show: true } }, // splitArea для лучшей читаемости
      dataZoom: [ { type: 'inside' }, { type: 'slider' } ], // Добавим зум
      series: [{
        type: 'candlestick',
        // Убедимся, что данные в формате [open, close, lowest, highest]
        data: candlestickData.kData.map(item => [item[0], item[1], item[2], item[3]]),
        itemStyle: { color: '#06B800', color0: '#FA0000', borderColor: null, borderColor0: null },
      }],
      grid: { containLabel: true, bottom: 80 }, // Добавим отступ снизу для dataZoom
    }),
    fetchData: null, initOptions: null,
  },
]);

// --- Логика Фильтров ---
const filters = chartConfigs.map(c => c.id);
const activeFilters = ref([...filters]); // По умолчанию все включены

const isActive = filterId => activeFilters.value.includes(filterId);

const toggleFilter = filterId => {
  const index = activeFilters.value.indexOf(filterId);
  if (index > -1) activeFilters.value.splice(index, 1);
  else activeFilters.value.push(filterId);
  // Ресайз теперь не нужен здесь, BaseChart сам справится через ResizeObserver
  // когда его контейнер изменит размер из-за CSS Grid
};

const isAllActive = computed(() => activeFilters.value.length === filters.length);

const toggleAll = () => {
  activeFilters.value = isAllActive.value ? [] : [...filters];
  // Ресайз теперь не нужен здесь
};

// --- Управление Графиками (Ссылки для отладки) ---
const chartRefs = ref({}); // Сохраняем ссылки, если понадобятся для чего-то кроме ресайза

// --- Хук Монтирования ---
onMounted(async () => {
  // console.log('[ChartsComponent] Компонент смонтирован, инициализация графиков...');

  // Инициализируем или загружаем данные для всех графиков
  // Можно делать параллельно для ускорения
  const initPromises = chartConfigs.map(async (config) => {
    if (config.initOptions) {
      config.initOptions(); // Установить "Загрузка..."
    }
    if (config.fetchData) {
      await config.fetchData(); // Загрузить данные
    }
  });

  await Promise.all(initPromises); // Ждем завершения всех загрузок/инициализаций

  // console.log('[ChartsComponent] Все графики инициализированы/загружены.');
  // Явный вызов ресайза больше не нужен здесь,
  // т.к. BaseChart будет ресайзиться сам при появлении в DOM и изменении размера контейнера.
});

// onUnmounted и watch(activeFilters, ...) для ресайза больше не нужны,
// т.к. BaseChart с ResizeObserver справляется сам.

</script>

<template>
  <div class="charts-page">
    <!-- Блок фильтров -->
    <div class="filter-controls">
      <button :class="{ active: isAllActive }" @click="toggleAll">
        {{ isAllActive ? 'Снять все' : 'Выбрать все' }}
      </button>
      <button
        v-for="config in chartConfigs"
        :key="config.id"
        :class="{ active: isActive(config.id) }"
        @click="toggleFilter(config.id)"
      >
        {{ config.name }}
      </button>
    </div>

    <!-- Контейнер для графиков с анимацией и CSS Grid -->
    <transition-group name="chart-fade" tag="div" class="charts-grid">
      <!-- Рендерим только активные графики -->
      <div
        v-for="config in chartConfigs.filter(c => isActive(c.id))"
        :key="config.id"
        class="chart-wrapper"
      >
        <!-- Оверлеи Загрузки/Ошибки (с безопасным доступом) -->
        <div v-if="config.isLoading?.value" class="chart-overlay">Загрузка...</div>
        <div v-else-if="config.error?.value" class="chart-overlay error">{{ config.error?.value ?? 'Произошла ошибка' }}</div>

        <!-- Сам график BaseChart -->
        <BaseChart
          :ref="el => { if (el) chartRefs[config.id] = el }"
          :options="config.options" 
        />
      </div>
    </transition-group>

    <!-- Сообщение, если ни один график не выбран -->
    <div v-if="activeFilters.length === 0 && chartConfigs.length > 0" class="no-charts-message">
      Выберите хотя бы один график для отображения.
    </div>
  </div>
</template>

<style scoped>
.charts-page {
  padding: 20px;
  background-color: #f8f9fa; /* Легкий фон для страницы */
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 30px;
}

.filter-controls button {
  border-radius: 15px;
  background-color: #fff; /* Белые кнопки */
  border: 1px solid #dee2e6; /* Светлая граница */
  padding: 8px 18px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-weight: 500;
  color: #495057; /* Темно-серый текст */
}

.filter-controls button:hover {
  background-color: #f1f3f5;
  border-color: #adb5bd;
}

.filter-controls button.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
  box-shadow: 0 3px 6px rgba(0, 123, 255, 0.25);
}

/* CSS Grid для адаптивной раскладки */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); /* Уменьшил minmax для лучшей адаптивности */
  gap: 25px;
}

.chart-wrapper {
  position: relative;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Мягкая тень */
  overflow: hidden; /* Важно для оверлеев и border-radius */
  display: flex; /* Для растягивания BaseChart */
  flex-direction: column;
  /* padding: 15px; Убрал padding, т.к. BaseChart займет все место */
  min-height: 430px;
  transition: all 0.3s ease-in-out; /* Плавность для тени и т.д. */
}
.chart-wrapper:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12); /* Усиление тени при наведении */
}


/* Оверлеи Загрузки/Ошибки */
.chart-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(255, 255, 255, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2em;
    z-index: 10;
    color: #6c757d;
    padding: 20px;
    text-align: center;
}
.chart-overlay.error {
    color: #dc3545;
    font-weight: bold;
}


/* Анимации появления/исчезновения */
.chart-fade-enter-active,
.chart-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.chart-fade-enter-from,
.chart-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(15px); /* Немного scale + сдвиг */
}

/* Стилизация BaseChart внутри wrapper */
/* :deep() позволяет стилизовать корневой элемент дочернего компонента */
.chart-wrapper > :deep(.base-chart) {
 flex-grow: 1; /* Занять все доступное пространство */
}

.no-charts-message {
  grid-column: 1 / -1; /* Занять всю ширину сетки */
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
  font-size: 1.1em;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Медиа-запрос для маленьких экранов */
@media (max-width: 600px) {
  .charts-grid {
    grid-template-columns: 1fr; /* Всегда одна колонка */
    gap: 20px;
  }
  .filter-controls {
      gap: 8px;
  }
  .filter-controls button {
      padding: 7px 14px;
      font-size: 0.9em;
  }
  .chart-wrapper {
      min-height: 380px; /* Немного меньше */
  }
}
</style>