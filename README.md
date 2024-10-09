Chat-App
```markdown
# API Documentation
## Эндпоинты

### 1. Получить пользователя по ID
- **URL**: `/users/{user_id}`
- **Метод**: `GET`
- **Заголовки**:
  - `Authorization: Bearer <token>`
- **Пример успешного ответа**:
  ```json
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "created_at": "2023-01-01T12:00:00",
    "is_online": true
  }
  ```
- **Пример неудачного ответа**:
  ```json
  {
    "detail": "User not found"
  }
  ```

### 2. Получить пользователя по email
- **URL**: `/users/email/{email}`
- **Метод**: `GET`
- **Заголовки**:
  - `Authorization: Bearer <token>`
- **Пример успешного ответа**:
  ```json
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "created_at": "2023-01-01T12:00:00",
    "is_online": true
  }
  ```
- **Пример неудачного ответа**:
  ```json
  {
    "detail": "User with this email not found"
  }
  ```

### 3. Создать пользователя
- **URL**: `/users`
- **Метод**: `POST`
- **Тело запроса**:
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Пример успешного ответа**:
  ```json
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "created_at": "2023-01-01T12:00:00"
  }
  ```
- **Пример неудачного ответа**:
  ```json
  {
    "detail": "Email already registered"
  }
  ```

### 4. Аутентификация пользователя
- **URL**: `/auth/login`
- **Метод**: `POST`
- **Тело запроса**:
  ```json
  {
    "login": "john@example.com",
    "password": "password123"
  }
  ```
- **Пример успешного ответа**:
  ```json
  {
    "access_token": "jwt-token",
    "token_type": "bearer"
  }
  ```
- **Пример неудачного ответа**:
  ```json
  {
    "detail": "Invalid username or email"
  }
  ```

### 5. Получить список чатов
- **URL**: `/chats`
- **Метод**: `GET`
- **Параметры запроса**:
  - `skip`: (int) кол-во чатов, которые нужно пропустить (по умолчанию 0)
  - `limit`: (int) максимальное кол-во чатов, которые нужно вернуть (по умолчанию 10)
- **Заголовки**:
  - `Authorization: Bearer <token>`
- **Пример успешного ответа**:
  ```json
  [
    {
      "id": 1,
      "title": "General Chat",
      "comment": "This is a general chat room",
      "created_at": "2023-01-01T12:00:00",
      "owner_id": 1
    }
  ]
  ```
- **Пример неудачного ответа**:
  ```json
  {
    "detail": "No chats found"
  }
  ```

### 6. Создать новый чат
- **URL**: `/chats`
- **Метод**: `POST`
- **Тело запроса**:
  ```json
  {
    "title": "New Chat Room",
    "comment": "This is a new chat room",
    "owner_id": 1
  }
  ```
- **Пример успешного ответа**:
  ```json
  {
    "id": 1,
    "title": "New Chat Room",
    "comment": "This is a new chat room",
    "created_at": "2023-01-01T12:00:00",
    "owner_id": 1
  }
  ```

### 7. Добавить пользователя в чат
- **URL**: `/chats/{chat_id}/users`
- **Метод**: `POST`
- **Тело запроса**:
  ```json
  {
    "user_id": 2
  }
  ```
- **Пример успешного ответа**:
  ```json
  {
    "message": "User successfully added to chat"
  }
  ```
- **Пример неудачного ответа**:
  ```json
  {
    "detail": "Chat not found"
  }
  ```

### 8. Получить сообщения в чате
- **URL**: `/chats/{chat_id}/messages`
- **Метод**: `GET`
- **Пример успешного ответа**:
  ```json
  [
    {
      "id": 1,
      "content": "Hello!",
      "sender_id": 1,
      "username": "john_doe",
      "created_at": "2023-01-01T12:00:00",
      "updated_at": "2023-01-01T12:00:00",
      "is_edited": false
    }
  ]
  ```
- **Пример неудачного ответа**:
  ```json
  {
    "detail": "No messages found in chat"
  }
  ```

### 9. Удалить чат
- **URL**: `/chats/{chat_id}`
- **Метод**: `DELETE`
- **Заголовки**:
  - `Authorization: Bearer <token>`
- **Пример успешного ответа**:
  ```json
  {
    "detail": "Chat and related data successfully deleted"
  }
  ```
- **Пример неудачного ответа**:
  ```json
  {
    "detail": "Only the owner can delete this chat"
  }
  ```
```

Эта структура помогает представить все ключевые моменты для каждого API-эндпоинта и использовать формат, который удобен для размещения на вики-странице.
