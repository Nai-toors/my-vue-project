<script setup>
import { useDataStore } from '../stores/data'
import { computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'

// Получаем данные из хранилища Pinia
const dataStore = useDataStore()
const users = computed(() => dataStore.users) //делает users реактивным

// Функция для определения стиля тега статуса
const getSeverity = (status) => {
  switch (status) {
    case 'Активен':
      return 'success'
    case 'Неактивен':
      return 'warn' //оно не выделяется желтым ну никак, все перепробовал
    default:
      return null
  }
}

// Функция для форматирования даты
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('ru-RU', options)
}
</script>

<template>
  <div class="card">
    <h2 class="text-2xl font-bold mb-3">Таблица пользователей</h2>
    
    <DataTable 
      :value="users" 
      :paginator="true" 
      :rows="5"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 20]"
      currentPageReportTemplate="Показано {first} до {last} из {totalRecords} записей"
      stripedRows
    >
      <Column field="id" header="ID" sortable style="width: 5%"></Column>
      <Column field="name" header="Имя" sortable style="width: 20%"></Column>
      <Column field="email" header="Email" sortable style="width: 25%"></Column>
      <Column field="country" header="Страна" sortable style="width: 15%"></Column>
      <Column field="status" header="Статус" sortable style="width: 15%">
        <template #body="{ data }">
          <Tag :value="data.status" :severity="getSeverity(data.status)" />
        </template>
      </Column>
      <Column field="date" header="Дата регистрации" sortable style="width: 20%">
        <template #body="{ data }">
          {{ formatDate(data.date) }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>


<style scoped>
.card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
}

.p-tag.p-tag-success {
  background-color: #4caf50;
  color: white;
}

.p-tag.p-tag-warning {
  background-color: #ffc107;
  color: black;
}

.p-tag.p-tag-danger {
  background-color: #f44336;
  color: white;
}

.p-tag.p-tag-info {
  background-color: #2196f3;
  color: white;
}
</style>