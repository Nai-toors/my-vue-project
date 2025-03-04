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
      },
      {
        id: 9,
        name: 'Максим Фёдоров',
        email: 'maxim@example.com',
        status: 'Активен',
        date: '2023-09-15',
        country: 'Россия'
      },
      {
        id: 10,
        name: 'Алина Григорьева',
        email: 'alina@example.com',
        status: 'Активен',
        date: '2023-10-02',
        country: 'Казахстан'
      },
      {
        id: 11,
        name: 'Геннадий Борисов',
        email: 'gennadiy@example.com',
        status: 'Неактивен',
        date: '2023-11-18',
        country: 'Беларусь'
      },
      {
        id: 12,
        name: 'Виктория Михайлова',
        email: 'victoria@example.com',
        status: 'Активен',
        date: '2023-12-01',
        country: 'Украина'
      },
      {
        id: 13,
        name: 'Роман Николаев',
        email: 'roman@example.com',
        status: 'Активен',
        date: '2024-01-10',
        country: 'Россия'
      },
      {
        id: 14,
        name: 'Людмила Романова',
        email: 'lyudmila@example.com',
        status: 'Неактивен',
        date: '2024-02-18',
        country: 'Беларусь'
      },
      {
        id: 15,
        name: 'Кирилл Павлов',
        email: 'kirill@example.com',
        status: 'Неактивен',
        date: '2024-03-01',
        country: 'Россия'
      },
      {
        id: 16,
        name: 'Анжела Воробьёва',
        email: 'anzhela@example.com',
        status: 'Активен',
        date: '2024-03-03',
        country: 'Украина'
      },
      {
        id: 17,
        name: 'Дмитрий Ковальчук',
        email: 'dmitriy@example.com',
        status: 'Активен',
        date: '2024-03-04',
        country: 'Казахстан'
      },
      {
        id: 18,
        name: 'Артём Беляев',
        email: 'artem@example.com',
        status: 'Неактивен',
        date: '2024-03-06',
        country: 'Беларусь'
      },
      {
        id: 19,
        name: 'Людмила Васильева',
        email: 'lyudmila_v@example.com',
        status: 'Активен',
        date: '2024-03-08',
        country: 'Россия'
      },
      {
        id: 20,
        name: 'Валерий Сафонов',
        email: 'valeriy@example.com',
        status: 'Неактивен',
        date: '2024-03-10',
        country: 'Украина'
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