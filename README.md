**Запуск:**

1. Создайте .env в папке /backend.
2. Скопируйте содержимое из .env.example в .env
3. В терминале проекта введите docker-compose up --build
4. Готово, можете тестить через postman http://localhost:9000

**От себя:**

Добавил фикстуры для теста:

**Users:**

1. { name: 'admin', email: 'admin.official@mail.ru', password: '123456', roleId: 1 }
2. { name: 'john1', email: 'john1.official@mail.ru', password: '123456', roleId: 2 }

**User Roles:**

1. ADMIN ( id - 1 )
2. USER ( id - 2 )
