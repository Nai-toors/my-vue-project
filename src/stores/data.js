import { defineStore } from 'pinia';
import { usersData } from '../assets/users';

// export - делает определение доступным для импорта в других модулях.
export const useDataStore = defineStore('data', {
  // defineStore создает хранилище
  // state возвращает объект, содержащий массив users.
  state: () => ({
    users: [...usersData], // Используем импортированный массив,
  }),

  actions: {
    // Добавление user
    addUser(user) {
      this.users.push(user);
    },
    // Удаление user
    deleteUser(id) {
      const index = this.users.findIndex(user => user.id === id);
      if (index !== -1) {
        this.users.splice(index, 1);
      }
    },
    // Редактирование user
    updateUser(updatedUser) {
      const index = this.users.findIndex(user => user.id === updatedUser.id);
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...updatedUser };
      }
    },
    // Метод для добавления массива пользователей (для генерации, чтоб не по одному)
    addUsers(usersArray) {
      this.users.push(...usersArray);
    },
    // Добавляем метод $reset
    $reset() {
      this.users = [...usersData];
    },
  },
  persist: true, // Включаем персистентность для этого store
});
