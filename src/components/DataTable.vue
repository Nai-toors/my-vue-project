<script setup>
import { ref, computed } from 'vue';
import { useDataStore } from '../stores/data';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

const dataStore = useDataStore();
const users = computed(() => dataStore.users);

// Управление состояниями таблицы
const expandedRows = ref(null);
const selectedUser = ref(null);

// Состояния видимости диалогов
const visibleAdd = ref(false);
const visibleEdit = ref(false);
const visibleDelete = ref(false);

// Объект для хранения данных формы (для добавления/редактирования)
const formUser = ref({
  id: null,
  name: '',
  email: '',
  status: 'Активен',
  date: '',
  country: '',
});

// Функция для определения стиля тега статуса
const getSeverity = status => {
  switch (status) {
    case 'Активен':
      return 'success';
    case 'Неактивен':
      return 'warn';
    default:
      return null;
  }
};

// Функция форматирования даты
const formatDate = dateString => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};

// Функции для открытия диалогов
function openAddDialog() {
  formUser.value = { id: null, name: '', email: '', status: 'Активен', date: new Date().toISOString().split('T')[0], country: '' };
  visibleAdd.value = true;
}

function openEditDialog() {
  if (selectedUser.value) {
    formUser.value = { ...selectedUser.value };
    visibleEdit.value = true;
  }
}

function openDeleteDialog() {
  if (selectedUser.value) {
    visibleDelete.value = true;
  }
}

// Функции для сохранения данных
function saveNewUser() {
  // Пример генерации нового id: берем максимальное значение + 1
  const newId = Math.max(...users.value.map(u => u.id)) + 1;
  formUser.value.id = newId;
  dataStore.addUser({ ...formUser.value });
  visibleAdd.value = false;
}

function updateExistingUser() {
  dataStore.updateUser({ ...formUser.value });
  visibleEdit.value = false;
}

function deleteExistingUser() {
  dataStore.deleteUser(selectedUser.value.id);
  visibleDelete.value = false;
  selectedUser.value = null;
}
</script>

<template>
  <div class="card shadow-1">
    <h2 class="text-2xl font-bold mb-3">Таблица пользователей</h2>

    <!-- Кнопки управления -->
    <div class="mb-3 flex gap-2">
      <Button label="Добавить" icon="pi pi-plus" class="p-button-success" @click="openAddDialog" />
      <Button label="Изменить" icon="pi pi-pencil" class="p-button-warning" :disabled="!selectedUser" @click="openEditDialog" />
      <Button label="Удалить" icon="pi pi-trash" class="p-button-danger" :disabled="!selectedUser" @click="openDeleteDialog" />
    </div>

    <!-- Таблица пользователей -->
    <DataTable
      :value="users"
      dataKey="id"
      v-model:expandedRows="expandedRows"
      selectionMode="single"
      v-model:selection="selectedUser"
      paginator
      :rows="5"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 20]"
      currentPageReportTemplate="Показано {first} до {last} из {totalRecords} записей"
      stripedRows
    >
      <Column expander style="width: 3em"></Column>
      <Column selectionMode="single" style="width: 3em"></Column>
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

    <!-- Диалог добавления -->
    <Dialog v-model:visible="visibleAdd" modal header="Добавить пользователя" :style="{ width: '25rem' }">
      <div class="p-3">
        <div class="mb-2">
          <label>Имя:</label>
          <InputText v-model="formUser.name" />
        </div>
        <div class="mb-2">
          <label>Email:</label>
          <InputText v-model="formUser.email" />
        </div>
        <div class="mb-2">
          <label>Страна:</label>
          <InputText v-model="formUser.country" />
        </div>
        <!-- Дополнительные поля можно добавить по необходимости -->
        <div class="flex justify-end gap-2">
          <Button label="Отмена" severity="secondary" @click="visibleAdd = false" />
          <Button label="Сохранить" @click="saveNewUser" />
        </div>
      </div>
    </Dialog>

    <!-- Диалог редактирования -->
    <Dialog v-model:visible="visibleEdit" modal header="Изменить пользователя" :style="{ width: '25rem' }">
      <div class="p-3">
        <div class="mb-2">
          <label>Имя:</label>
          <InputText v-model="formUser.name" />
        </div>
        <div class="mb-2">
          <label>Email:</label>
          <InputText v-model="formUser.email" />
        </div>
        <div class="mb-2">
          <label>Страна:</label>
          <InputText v-model="formUser.country" />
        </div>
        <!-- Дополнительные поля -->
        <div class="flex justify-end gap-2">
          <Button label="Отмена" severity="secondary" @click="visibleEdit = false" />
          <Button label="Сохранить" @click="updateExistingUser" />
        </div>
      </div>
    </Dialog>

    <!-- Диалог удаления -->
    <Dialog v-model:visible="visibleDelete" modal header="Удалить пользователя" :style="{ width: '25rem' }">
      <div class="p-3">
        <p>Вы действительно хотите удалить пользователя {{ selectedUser?.name }}?</p>
        <div class="flex justify-end gap-2">
          <Button label="Отмена" severity="secondary" @click="visibleDelete = false" />
          <Button label="Удалить" icon="pi pi-trash" class="p-button-danger" @click="deleteExistingUser" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
}
</style>
