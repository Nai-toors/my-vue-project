<template>
    <div ref="chartRef" class="base-chart"></div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
  import * as echarts from 'echarts';
  // Опционально: импорт тем, если нужно
  // import 'echarts/theme/dark';
  
  // --- Пропсы ---
  const props = defineProps({
    options: {
      type: Object,
      required: true,
    },
    theme: {
      type: String,
      default: null, // null = стандартная тема
    },
  });
  
  // --- Рефы и Переменные ---
  const chartRef = ref(null); // Ссылка на DOM-элемент
  let chartInstance = null;   // Экземпляр ECharts
  let resizeObserver = null;  // Экземпляр ResizeObserver
  
  // --- Функции ---
  
  /**
   * Инициализирует или обновляет график ECharts с новыми опциями.
   */
  const initOrUpdateChart = () => {
    if (!chartRef.value) {
      console.warn('[BaseChart] DOM элемент не найден для инициализации.');
      return;
    }
  
    try {
      // Если экземпляр уже есть, обновляем опции
      if (chartInstance) {
        // console.log('[BaseChart] Обновление опций:', props.options);
        // notMerge: true важно, чтобы полностью заменить опции,
        // особенно при переходе от "Загрузка..." к реальным данным.
        chartInstance.setOption(props.options, { notMerge: true, lazyUpdate: false });
      }
      // Иначе инициализируем новый экземпляр
      else {
        // console.log('[BaseChart] Инициализация нового экземпляра с опциями:', props.options);
        chartInstance = echarts.init(chartRef.value, props.theme);
        chartInstance.setOption(props.options);
      }
    } catch (error) {
      console.error('[BaseChart] Ошибка при установке опций ECharts:', error, 'Опции:', props.options);
    }
  };
  
  /**
   * Обработчик изменения размера для ECharts.
   * Вызывается ResizeObserver'ом или window.resize (если используется).
   */
  const resizeEchartsInstance = () => {
    // requestAnimationFrame для плавности и избежания лишних ресайзов
    requestAnimationFrame(() => {
      if (chartInstance && chartRef.value?.offsetParent !== null) { // Проверяем видимость
        // console.log('[BaseChart] Ресайз экземпляра ECharts');
        chartInstance.resize();
      }
    });
  };
  
  // --- Хуки Жизненного Цикла и Наблюдатели ---
  
  onMounted(() => {
    // console.log('[BaseChart] Компонент смонтирован');
    // Небольшая задержка перед первой инициализацией, чтобы DOM точно был готов
    nextTick(() => {
      initOrUpdateChart(); // Первая инициализация/отрисовка
  
      // Настройка ResizeObserver для автоматического ресайза
      if (chartRef.value) {
        resizeObserver = new ResizeObserver(resizeEchartsInstance);
        resizeObserver.observe(chartRef.value);
        // console.log('[BaseChart] ResizeObserver запущен');
      } else {
         console.error('[BaseChart] Не удалось запустить ResizeObserver: chartRef не найден.');
      }
    });
  });
  
  onUnmounted(() => {
    // console.log('[BaseChart] Компонент размонтирован');
    // Отключаем ResizeObserver
    if (resizeObserver && chartRef.value) {
      resizeObserver.unobserve(chartRef.value);
      // console.log('[BaseChart] ResizeObserver остановлен');
    }
    resizeObserver = null;
  
    // Уничтожаем экземпляр ECharts для освобождения памяти
    if (chartInstance) {
      chartInstance.dispose();
      // console.log('[BaseChart] Экземпляр ECharts уничтожен');
      chartInstance = null;
    }
  });
  
  // Следим за глубокими изменениями в пропсе 'options'
  watch(() => props.options, (newOptions) => {
    // Проверяем, что опции не пустые и компонент смонтирован
    if (newOptions && Object.keys(newOptions).length > 0 && chartRef.value) {
      // console.log('[BaseChart] Пропс options изменился, обновление графика...');
      // Используем nextTick, чтобы Vue успел обработать изменения перед обновлением графика
      nextTick(initOrUpdateChart);
    } else {
      // console.log('[BaseChart] Пропс options изменился, но опции пустые или компонент не смонтирован.');
    }
  }, { deep: true }); // deep: true ОБЯЗАТЕЛЬНО для отслеживания изменений внутри объекта опций
  
  // --- Предоставляем методы (если нужны извне, но для ресайза уже не надо) ---
  defineExpose({
    getInstance: () => chartInstance, // Полезно для отладки
    // resizeChart: resizeEchartsInstance // Больше не нужно, т.к. есть ResizeObserver
  });
  
  </script>
  
  <style scoped>
  .base-chart {
    width: 100%;  /* Занимать всю ширину родительского контейнера */
    height: 100%; /* Занимать всю высоту родительского контейнера */
    min-height: 350px; /* Минимальная высота для отображения */
  }
  </style>