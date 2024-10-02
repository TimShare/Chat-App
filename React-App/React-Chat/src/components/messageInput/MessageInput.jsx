import { useState } from "react";
import { sendMessage } from "../../helpers/websocketService";
import "./MessageInput.css";
const MessageInput = ({ chat, userdata, accessLevels }) => {
  const [message, setMessage] = useState("");

  // Проверка прав доступа на отправку сообщений
  const canSendMessage = accessLevels[userdata.username] === "read_and_write";

  // Функция для отправки сообщения через WebSocket
  const handleSendMessage = () => {
    if (message.trim() !== "" && chat && chat.id && canSendMessage) {
      const messageData = {
        chat_id: chat.id, // ID выбранного чата
        content: message, // Текст сообщения
        sender_id: userdata.id, // ID отправителя
      };

      // Отправляем сообщение через сервис WebSocket
      sendMessage(messageData);

      // Очищаем поле после отправки
      setMessage("");
    }
  };

  // Функция для обработки нажатия клавиши Enter
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
        onKeyDown={handleKeyPress} // Отправляем сообщение при нажатии Enter
        disabled={!canSendMessage} // Отключаем поле ввода, если нет прав
      />
      <button
        onClick={handleSendMessage}
        disabled={!canSendMessage || message.trim() === ""} // Отключаем кнопку, если нет прав или поле пустое
      >
        ➤
      </button>
    </div>
  );
};

export default MessageInput;
