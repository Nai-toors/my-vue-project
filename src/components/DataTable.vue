<script setup>
import { useDataStore } from "../stores/data";
import { computed, ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";

// Получаем данные из хранилища Pinia
const dataStore = useDataStore();
const users = computed(() => dataStore.users); //делает users реактивным

// Новое: реактивное свойство для хранения раскрытых строк
const expandedRows = ref(null);
const test = ref(123);

// Функция для определения стиля тега статуса
const getSeverity = (status) => {
  switch (status) {
    case "Активен":
      return "success";
    case "Неактивен":
      return "warn"; //оно не выделяется желтым ну никак, все перепробовал
    default:
      return null;
  }
};

// Функция для форматирования даты
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("ru-RU", options);
};
</script>

<template>
  <div class="card shadow-1">
    <h2 class="text-2xl font-bold mb-3">Таблица пользователей</h2>

    <!-- expandedRows: Создано реактивное свойство с помощью ref, чтобы хранить состояние раскрытых строк. -->
    <DataTable
      :value="users"
      dataKey="id"
      v-model:expandedRows="expandedRows"
      @row-toggle="onRowToggle"
      :paginator="true"
      :rows="5"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 20]"
      currentPageReportTemplate="Показано {first} до {last} из {totalRecords} записей"
      stripedRows
    >
      <!-- колонка для экспандера -->
      <Column expander style="width: 3em"></Column>

      <Column field="id" header="ID" sortable style="width: 5%"></Column>
      <Column field="name" header="Имя" sortable style="width: 20%"></Column>
      <Column field="email" header="Email" sortable style="width: 25%"></Column>
      <Column
        field="country"
        header="Страна"
        sortable
        style="width: 15%"
      ></Column>
      <Column field="status" header="Статус" sortable style="width: 15%">
        <template #body="{ data }">
          <Tag :value="data.status" :severity="getSeverity(data.status)" />
        </template>
      </Column>
      <Column
        field="date"
        header="Дата регистрации"
        sortable
        style="width: 20%"
      >
        <template #body="{ data }">
          {{ formatDate(data.date) }}
        </template>
      </Column>

      <!-- шаблон расширенной строки -->
      <template #expansion="{ data }">
        <div class="p-3">
          <h5 class="font-bold mb-2">Подробная информация о пользователе</h5>
          <p>Имя: {{ data.name }}</p>
          <p>Email: {{ data.email }}</p>
          <p>Страна: {{ data.country }}</p>
          <p>Дата регистрации: {{ formatDate(data.date) }}</p>
          <p>Статус: {{ data.status }}</p>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<style scoped>
.card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}
</style>
