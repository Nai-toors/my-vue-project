import { defineStore } from 'pinia'

export const useDataStore = defineStore('data', {
// Функция state возвращает объект, содержащий массив users.
  state: () => ({           
    users: [
      {
        id: 1,
        name: 'Иван Петров',
        email: 'ivan@example.com',
        status: 'Активен',
        date: '2023-01-15',
        country: 'Россия'
      },
      {
        id: 2,
        name: 'Мария Сидорова',
        email: 'maria@example.com',
        status: 'Активен',
        date: '2023-02-20',
        country: 'Россия'
      },
      {
        id: 3,
        name: 'Алексей Иванов',
        email: 'alex@example.com',
        status: 'Неактивен',
        date: '2023-03-10',
        country: 'Беларусь'
      },
      {
        id: 4,
        name: 'Елена Смирнова',
        email: 'elena@example.com',
        status: 'Активен',
        date: '2023-04-05',
        country: 'Казахстан'
      },
      {
        id: 5,
        name: 'Дмитрий Козлов',
        email: 'dmitry@example.com',
        status: 'Неактивен',
        date: '2023-05-12',
        country: 'Россия'
      },
      {
        id: 6,
        name: 'Ольга Новикова',
        email: 'olga@example.com',
        status: 'Активен',
        date: '2023-06-18',
        country: 'Украина'
      },
      {
        id: 7,
        name: 'Сергей Морозов',
        email: 'sergey@example.com',
        status: 'Активен',
        date: '2023-07-24',
        country: 'Россия'
      },
      {
        id: 8,
        name: 'Анна Соколова',
        email: 'anna@example.com',
        status: 'Неактивен',
        date: '2023-08-09',
        country: 'Беларусь'
      }
    ]
  }),
  
  actions: {
    addUser(user) {    //динамическое расширение списка (по желанию)
      this.users.push(user)
    },
    deleteUser(id) {     // удаление строки по id пользователя 
      const index = this.users.findIndex(user => user.id === id)
      if (index !== -1) {
        this.users.splice(index, 1)
      }
    }
  }
})