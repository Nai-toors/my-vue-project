<script setup>
import { ref, computed, nextTick } from 'vue';
import { useDataStore } from '../stores/data';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Popover from 'primevue/popover';

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

// Новые переменные и функция для генерации случайных записей
const randomCount = ref(0);
const popoverRef = ref(null);

function generateRandomUsers() {
  // Генерируем случайное число от 1 до 10
  const count = Math.floor(Math.random() * 10) + 1;
  randomCount.value = count;

  const newUsers = [];

  for (let i = 0; i < count; i++) {
    const newId = Math.max(...users.value.map(u => u.id)) + 1;
    const newUser = {
      id: newId,
      name: `Случайный пользователь ${newId}`,
      email: `user${newId}@example.com`,
      status: Math.random() > 0.5 ? 'Активен' : 'Неактивен',
      date: new Date().toISOString().split('T')[0],
      country: ['Россия', 'Беларусь', 'Украина', 'Казахстан'][Math.floor(Math.random() * 4)],
    };
    newUsers.push(newUser);
  }

  // Добавляем все сгенерированные записи сразу
  dataStore.addUsers(newUsers);
}

// Функция для отображения Popover по клику на кнопку-триггер
function showInfo(event) {
  // Если Popover уже открыт, скрываем его
  if (popoverRef.value) {
    //popoverRef — это реактивная переменная, созданная через ref, которая ссылается на компонент Popover
    popoverRef.value.hide(); //Если значение popoverRef.value определено, значит компонент инициализирован -> скрываем
  }
  nextTick(() => {
    //nextTick - отложенная функция Vue, которая дожидается построения DOM дерева, показывая popover только после завершения DOM
    popoverRef.value.show(event); //собна так и отображается popover
  });
}
</script>

<template>
  <div class="shadow-1 bg-white p-3 border-round-xl">
    <h2 class="text-2xl font-bold mb-3">Таблица пользователей</h2>

    <!-- Кнопки управления -->
    <div class="mb-3 flex gap-2">
      <Button label="Добавить" icon="pi pi-plus" class="p-button-success" @click="openAddDialog" />
      <Button label="Изменить" icon="pi pi-pencil" class="p-button-warning" :disabled="!selectedUser" @click="openEditDialog" />
      <Button label="Удалить" icon="pi pi-trash" class="p-button-danger" :disabled="!selectedUser" @click="openDeleteDialog" />

      <!-- Кнопка для генерации случайных записей -->
      <Button label="Генерировать записи" class="p-button-info" @click="generateRandomUsers" />

      <!-- Кнопка-триггер для Popover с информацией о количестве записей -->
      <Button icon="pi pi-info-circle" class="p-button-text" @click="showInfo" />
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
      <!-- Имя -->
      <div class="mb-3">
        <label class="block font-medium mb-1" for="addName">Имя:</label>
        <InputText id="addName" v-model="formUser.name" class="w-full" />
      </div>
      <!-- Email -->
      <div class="mb-3">
        <label class="block font-medium mb-1" for="addEmail">Email:</label>
        <InputText id="addEmail" v-model="formUser.email" class="w-full" />
      </div>
      <!-- Страна -->
      <div class="mb-3">
        <label class="block font-medium mb-1" for="addCountry">Страна:</label>
        <InputText id="addCountry" v-model="formUser.country" class="w-full" />
      </div>

      <!-- Кнопки -->
      <div class="flex justify-end gap-2">
        <Button label="Отмена" severity="secondary" @click="visibleAdd = false" />
        <Button label="Сохранить" @click="saveNewUser" />
      </div>
    </Dialog>

    <!-- Диалог редактирования -->
    <Dialog v-model:visible="visibleEdit" modal header="Изменить пользователя" :style="{ width: '25rem' }">
      <!-- Имя -->
      <div class="mb-3">
        <label class="block font-medium mb-1" for="editName">Имя:</label>
        <InputText id="editName" v-model="formUser.name" class="w-full" />
      </div>
      <!-- Email -->
      <div class="mb-3">
        <label class="block font-medium mb-1" for="editEmail">Email:</label>
        <InputText id="editEmail" v-model="formUser.email" class="w-full" />
      </div>
      <!-- Страна -->
      <div class="mb-3">
        <label class="block font-medium mb-1" for="editCountry">Страна:</label>
        <InputText id="editCountry" v-model="formUser.country" class="w-full" />
      </div>

      <!-- Кнопки -->
      <div class="flex justify-end gap-2">
        <Button label="Отмена" severity="secondary" @click="visibleEdit = false" />
        <Button label="Сохранить" @click="updateExistingUser" />
      </div>
    </Dialog>

    <!-- Диалог удаления -->
    <Dialog v-model:visible="visibleDelete" modal header="Удалить пользователя" :style="{ width: '25rem' }">
      <p>Вы действительно хотите удалить пользователя "{{ selectedUser?.name }}"?</p>
      <div class="flex justify-end gap-2 mt-4">
        <Button label="Отмена" severity="secondary" @click="visibleDelete = false" />
        <Button label="Удалить" icon="pi pi-trash" class="p-button-danger" @click="deleteExistingUser" />
      </div>
    </Dialog>

    <!-- Popover, открывающийся по клику на кнопку-триггер -->
    <Popover ref="popoverRef">
      <div>Количество записей: {{ users.length }}</div>
    </Popover>
  </div>
</template>

<style scoped>
/* Ваши стили */
</style>
