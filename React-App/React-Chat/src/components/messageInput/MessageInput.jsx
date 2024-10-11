import { useState, useEffect } from "react";
import { sendMessage } from "../../helpers/websocketService";
import "./MessageInput.css";
import axios from "axios";
const MessageInput = ({
  chat,
  userdata,
  accessLevels,
  editMessage,
  onEditComplete,
  onMessageUpdate,
}) => {
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Проверка прав доступа на отправку сообщений
  const canSendMessage = accessLevels[userdata.username] === "read_and_write";

  useEffect(() => {
    // Проверяем, является ли пользователь отправителем сообщения
    if (editMessage && editMessage.sender_id === userdata.id) {
      setMessage(editMessage.content);
      setIsEditing(true);
    } else if (editMessage) {
      // Если пользователь не является отправителем, сбрасываем режим редактирования
      alert("Вы можете редактировать только свои сообщения.");
      onEditComplete();
    }
  }, [editMessage, userdata.id, onEditComplete]);

  const handleSendMessage = async () => {
    // console.log("Текущий editMessage в handleSendMessage:", editMessage);
    if (message.trim() !== "" && chat && chat.id && canSendMessage) {
      const messageData = {
        chat_id: chat.id,
        content: message,
        sender_id: userdata.id,
        action_type: "send_message",
      };

      if (isEditing) {
        // sendMessage({ ...editMessage, content: message });
        onEditComplete(); // Завершаем редактирование
        setIsEditing(false); // Выходим из режима редактирования
        sendMessage({
          id: editMessage.id,
          chat_id: chat.id,
          content: message,
          action_type: "message_edited",
        });
      } else {
        // Отправка нового сообщения
        sendMessage(messageData);
      }

      // Очищаем поле после отправки
      setMessage("");
    }
  };

  // Обработка нажатия клавиши Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="message-input">
      <input
        type="text"
        placeholder="Сообщение..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={!canSendMessage}
      />

      {isEditing && (
        <button
          onClick={() => {
            setIsEditing(false);
            setMessage("");
            onEditComplete();
          }}
          className="cancel-edit"
        >
          Отмена
        </button>
      )}
      <button
        onClick={handleSendMessage}
        disabled={!canSendMessage || message.trim() === ""}
      >
        ➤
      </button>
    </div>
  );
};

export default MessageInput;
