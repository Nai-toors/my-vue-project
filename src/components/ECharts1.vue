<template>
    <div>
      <!-- Блок фильтров -->
      <div class="filter-container">
        <button :class="{ active: isAllActive }" @click="toggleAll">Все</button>
        <button
          v-for="chart in charts"
          :key="chart.id"
          :class="{ active: isActive(chart.id) }"
          @click="toggleFilter(chart.id)"
        >
          {{ chart.label }}
        </button>
      </div>
  
      <!-- Дашборд с графиками через vue3-grid-layout -->
      <grid-layout
        :layout="layout"
        :col-num="2"
        :row-height="150"
        :is-draggable="true"
        :is-resizable="true"
        :vertical-compact="true"
        :margin="[10, 10]"
      >
        <grid-item
          v-for="chart in activeCharts"
          :key="chart.id"
          :x="chart.x"
          :y="chart.y"
          :w="chart.w"
          :h="chart.h"
        >
          <div class="chart-container">
            <h2>{{ chart.label }}</h2>
            <!-- Контейнер для графика -->
            <div :ref="chart.refName" class="chart"></div>
          </div>
        </grid-item>
      </grid-layout>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, watch, nextTick } from 'vue';
  import axios from 'axios';
  import * as echarts from 'echarts';
  import { pieChartData, barChartData, candlestickData } from '@/stores/chartsData.js';
  import { GridLayout, GridItem } from 'vue3-grid-layout';
  
  export default {
    name: 'ChartsComponent',
    components: {
      GridLayout,
      GridItem,
    },
    setup() {
      // Определяем список графиков с их размерами и начальными позициями в сетке
      const charts = [
        // Line Chart (данные с API)
        { id: 'line', label: 'Line Chart', refName: 'line', x: 0, y: 0, w: 1, h: 1 },
        // Pie Chart (данные из store)
        { id: 'pie', label: 'Pie Chart', refName: 'pie', x: 1, y: 0, w: 1, h: 1 },
        // Bar Chart (данные из store)
        { id: 'bar', label: 'Bar Chart', refName: 'bar', x: 0, y: 1, w: 2, h: 1 },
        // Candlestick Chart (данные из store)
        { id: 'candlestick', label: 'Candlestick Chart', refName: 'candlestick', x: 0, y: 2, w: 2, h: 2 },
      ];
  
      // Список активных графиков (по умолчанию все включены)
      const activeFilters = ref(charts.map(chart => chart.id));
  
      // Создаем рефы для каждого графика
      const chartRefs = {
        line: ref(null),
        pie: ref(null),
        bar: ref(null),
        candlestick: ref(null),
      };
  
      // Объект для хранения экземпляров ECharts
      const chartInstances = {
        line: null,
        pie: null,
        bar: null,
        candlestick: null,
      };
  
      // Вычисляем активные графики для отображения
      const activeCharts = computed(() =>
        charts.filter(chart => activeFilters.value.includes(chart.id))
      );
  
      // Формируем layout для vue3-grid-layout
      const layout = computed(() =>
        activeCharts.value.map(chart => ({
          i: chart.id,
          x: chart.x,
          y: chart.y,
          w: chart.w,
          h: chart.h,
        }))
      );
  
      // Методы для фильтрации графиков
      const isActive = id => activeFilters.value.includes(id);
      const toggleFilter = id => {
        if (isActive(id)) {
          activeFilters.value = activeFilters.value.filter(f => f !== id);
        } else {
          activeFilters.value.push(id);
        }
      };
      const isAllActive = computed(() => activeFilters.value.length === charts.length);
      const toggleAll = () => {
        activeFilters.value = isAllActive.value ? [] : charts.map(chart => chart.id);
      };
  
      // Функция для получения данных для LineChart через axios
      const fetchDataForLineChart = async () => {
        try {
          const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
          const posts = response.data.slice(0, 10);
          const xData = posts.map(post => post.id);
          const yData = posts.map(post => post.title.length);
          return { xData, yData };
        } catch (error) {
          console.error('Ошибка при загрузке данных:', error);
          return { xData: [], yData: [] };
        }
      };
  
      // Обновление размеров графиков после изменений в layout или окна браузера
      const updateChartSizes = () => {
        nextTick(() => {
          Object.values(chartInstances).forEach(instance => {
            if (instance) instance.resize();
          });
        });
      };
  
      watch(activeFilters, updateChartSizes);
  
      onMounted(async () => {
        // Ждем обновления DOM
        await nextTick();
  
        // Инициализация LineChart
        chartInstances.line = echarts.init(chartRefs.line.value);
        const { xData, yData } = await fetchDataForLineChart();
        const lineOption = {
          title: { text: 'Line Chart - Длина заголовка поста' },
          tooltip: {},
          xAxis: { type: 'category', data: xData },
          yAxis: { type: 'value' },
          series: [{ data: yData, type: 'line' }],
        };
        chartInstances.line.setOption(lineOption);
  
        // Инициализация PieChart
        chartInstances.pie = echarts.init(chartRefs.pie.value);
        const pieOption = {
          title: { text: 'Pie Chart - Пример данных' },
          tooltip: { trigger: 'item' },
          series: [{
            name: 'Пример',
            type: 'pie',
            radius: '50%',
            data: pieChartData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0,0,0,0.5)',
              },
            },
          }],
        };
        chartInstances.pie.setOption(pieOption);
  
        // Инициализация BarChart
        chartInstances.bar = echarts.init(chartRefs.bar.value);
        const barOption = {
          title: { text: 'Bar Chart - Пример данных' },
          tooltip: {},
          xAxis: { type: 'category', data: barChartData.categories },
          yAxis: { type: 'value' },
          series: [{ data: barChartData.data, type: 'bar' }],
        };
        chartInstances.bar.setOption(barOption);
  
        // Инициализация Candlestick Chart
        chartInstances.candlestick = echarts.init(chartRefs.candlestick.value);
        const { dates, kData } = candlestickData;
        const candlestickOption = {
          title: { text: 'Candlestick Chart - Пример данных' },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              const data = params[0].data;
              return `Дата: ${dates[params[0].dataIndex]}<br/>
                      Открытие: ${data[0]}<br/>
                      Закрытие: ${data[1]}<br/>
                      Минимум: ${data[2]}<br/>
                      Максимум: ${data[3]}`;
            },
          },
          xAxis: { type: 'category', data: dates, axisLine: { onZero: false } },
          yAxis: { scale: true },
          series: [{
            type: 'candlestick',
            data: kData,
            itemStyle: {
              color: '#06B800',
              color0: '#FA0000',
              borderColor: '#06B800',
              borderColor0: '#FA0000',
            },
          }],
        };
        chartInstances.candlestick.setOption(candlestickOption);
  
        // Обновление размеров графиков при изменении размеров окна
        window.addEventListener('resize', () => {
          Object.values(chartInstances).forEach(instance => {
            if (instance) instance.resize();
          });
        });
      });
  
      return {
        charts,
        activeFilters,
        isActive,
        toggleFilter,
        isAllActive,
        toggleAll,
        layout,
        activeCharts,
        // Передаем рефы для графиков
        ...chartRefs,
      };
    },
  };
  </script>
  
  <style scoped>
  .filter-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .filter-container button {
    border-radius: 8px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 10px 15px;
    margin: 0 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .filter-container button:hover {
    background-color: #e0e0e0;
  }
  
  .filter-container button.active {
    background-color: #007bff;
    color: #fff;
    border-color: #007bff;
  }
  
  .chart-container {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .chart {
    width: 100%;
    height: 100%;
    min-height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-style: italic;
    color: #666;
  }
  </style>
  