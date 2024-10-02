import React, { useState, memo } from "react";
import axios from "axios";
import "./AddMemberModal.css"; // Убедитесь, что файл стилей подключен
import { sendMessage } from "../../helpers/websocketService";
import { getUsernameById } from "../../helpers/getUsernameById";
const AddMemberModal = memo(({ isOpen, onClose, chat }) => {
  if (!isOpen) return null;
  const [userId, setUserId] = useState("");
  const handleAddMember = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/chats/${chat.id}/add_user`,
        null,
        { params: { chat_id: chat.id, user_id: userId } }
      );
      console.log("Участник добавлен:", response.data);
      const username = await getUsernameById(userId); // Дожидаемся результата

      const messageData = {
        chat_id: chat.id,
        content: `пригласил ${username}`, // Используем имя пользователя
        sender_id: chat.owner_id,
      };

      // Отправляем сообщение через сервис WebSocket
      await sendMessage(messageData);
      onClose(); // Закрываем модальное окно
      setUserId(""); // Очищаем поле ввода
    } catch (error) {
      console.error("Ошибка при добавлении участника:", error);
    }
  };

  if (!isOpen) return null; // Если модальное окно закрыто, ничего не отображаем

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Добавить участника в чат</h2>
        <label htmlFor="userId">ID пользователя:</label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Введите ID пользователя"
        />
        <div className="modal-actions">
          <button onClick={handleAddMember}>Добавить</button>
          <button onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
});

export default AddMemberModal;
