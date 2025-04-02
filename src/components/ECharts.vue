<script>
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import axios from 'axios';
import * as echarts from 'echarts';
import { pieChartData, barChartData, candlestickData } from '@/stores/chartsData.js';

export default {
  name: 'ChartsComponent',
  setup() {
    // Список возможных фильтров
    const filters = ['line', 'pie', 'bar', 'candlestick'];

    // По умолчанию все графики включены
    const activeFilters = ref([...filters]);

    // Рефы для DOM-элементов графиков
    const lineChart = ref(null);
    const pieChart = ref(null);
    const barChart = ref(null);
    const candlestickChart = ref(null);

    // Экземпляры графиков ECharts
    let lineChartInstance = null;
    let pieChartInstance = null;
    let barChartInstance = null;
    let candlestickChartInstance = null;

    // Проверяем, включён ли конкретный фильтр
    const isActive = filter => {
      return activeFilters.value.includes(filter);
    };

    // Переключаем конкретный фильтр
    const toggleFilter = filter => {
      if (isActive(filter)) {
        // Если уже есть в списке, убираем
        activeFilters.value = activeFilters.value.filter(f => f !== filter);
      } else {
        // Иначе добавляем
        activeFilters.value.push(filter);
      }
    };

    // Проверка: все ли графики выбраны
    const isAllActive = computed(() => {
      return activeFilters.value.length === filters.length;
    });

    // Переключение кнопки "Все": либо все графики, либо ни одного
    const toggleAll = () => {
      if (isAllActive.value) {
        // Если уже все выбраны, убираем все
        activeFilters.value = [];
      } else {
        // Иначе включаем все
        activeFilters.value = [...filters];
      }
    };

    // Функция для получения данных для LineChart через axios
    const fetchDataForLineChart = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        // Берём первые 10 постов
        const posts = response.data.slice(0, 10);
        // xAxis – id постов, yAxis – длина заголовков
        const xData = posts.map(post => post.id);
        const yData = posts.map(post => post.title.length);
        return { xData, yData };
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return { xData: [], yData: [] };
      }
    };

    // Обновляем размеры графиков при изменении фильтров (появление новых графиков)
    const updateChartSizes = () => {
      nextTick(() => {
        if (lineChartInstance) lineChartInstance.resize();
        if (pieChartInstance) pieChartInstance.resize();
        if (barChartInstance) barChartInstance.resize();
        if (candlestickChartInstance) candlestickChartInstance.resize();
      });
    };

    watch(activeFilters, () => {
      updateChartSizes();
    });

    onMounted(async () => {
      // Инициализация LineChart с данными из API
      lineChartInstance = echarts.init(lineChart.value);
      const { xData, yData } = await fetchDataForLineChart();
      const lineOption = {
        title: { text: 'Line Chart - Длина заголовка поста' },
        tooltip: {},
        xAxis: { type: 'category', data: xData },
        yAxis: { type: 'value' },
        series: [
          {
            data: yData,
            type: 'line',
          },
        ],
      };
      lineChartInstance.setOption(lineOption);

      // Инициализация PieChart
      pieChartInstance = echarts.init(pieChart.value);
      const pieOption = {
        title: { text: 'Pie Chart - Пример данных' },
        tooltip: { trigger: 'item' },
        series: [
          {
            name: 'Пример',
            type: 'pie',
            radius: '50%',
            data: pieChartData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
      pieChartInstance.setOption(pieOption);

      // Инициализация BarChart
      barChartInstance = echarts.init(barChart.value);
      const barOption = {
        title: { text: 'Bar Chart - Пример данных' },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: barChartData.categories,
        },
        yAxis: { type: 'value' },
        series: [
          {
            data: barChartData.data,
            type: 'bar',
          },
        ],
      };
      barChartInstance.setOption(barOption);

      // Инициализация Candlestick Chart
      candlestickChartInstance = echarts.init(candlestickChart.value);
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
        xAxis: {
          type: 'category',
          data: dates,
          axisLine: { onZero: false },
        },
        yAxis: { scale: true },
        series: [
          {
            type: 'candlestick',
            data: kData,
            itemStyle: {
              color: '#06B800',
              color0: '#FA0000',
              borderColor: '#06B800',
              borderColor0: '#FA0000',
            },
          },
        ],
      };
      candlestickChartInstance.setOption(candlestickOption);

      // Обработка изменения размеров окна
      window.addEventListener('resize', () => {
        lineChartInstance.resize();
        pieChartInstance.resize();
        barChartInstance.resize();
        candlestickChartInstance.resize();
      });
    });

    return {
      lineChart,
      pieChart,
      barChart,
      candlestickChart,
      activeFilters,
      isActive,
      toggleFilter,
      isAllActive,
      toggleAll,
    };
  },
};
</script>

<template>
  <div>
    <!-- Блок фильтров -->
    <div class="filter-container">
      <!-- Кнопка "Все" -->
      <button :class="{ active: isAllActive }" @click="toggleAll">Все</button>

      <!-- Кнопки отдельных графиков -->
      <button :class="{ active: isActive('line') }" @click="toggleFilter('line')">Line Chart</button>
      <button :class="{ active: isActive('pie') }" @click="toggleFilter('pie')">Pie Chart</button>
      <button :class="{ active: isActive('bar') }" @click="toggleFilter('bar')">Bar Chart</button>
      <button :class="{ active: isActive('candlestick') }" @click="toggleFilter('candlestick')">Candlestick Chart</button>
    </div>

    <!-- Графики -->
    <div v-show="activeFilters.includes('line')" class="chart-container">
      <h2>Line Chart (Данные с API)</h2>
      <div ref="lineChart" class="chart"></div>
    </div>

    <div v-show="activeFilters.includes('pie')" class="chart-container">
      <h2>Pie Chart</h2>
      <div ref="pieChart" class="chart"></div>
    </div>

    <div v-show="activeFilters.includes('bar')" class="chart-container">
      <h2>Bar Chart</h2>
      <div ref="barChart" class="chart"></div>
    </div>

    <div v-show="activeFilters.includes('candlestick')" class="chart-container">
      <h2>Candlestick Chart</h2>
      <div ref="candlestickChart" class="chart"></div>
    </div>
  </div>
</template>

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
  margin: 20px 0;
  text-align: center;
}

.chart {
  width: 600px;
  height: 400px;
  margin: 0 auto;
}
</style>
