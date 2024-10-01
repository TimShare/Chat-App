import { useState } from "react";
import { sendMessage } from "../../helpers/websocketService";

const MessageInput = ({ chat, userdata }) => {
  const [message, setMessage] = useState("");

  // Функция для отправки сообщения через WebSocket
  const handleSendMessage = () => {
    if (message.trim() !== "" && chat && chat.id) {
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
      />
      <button
        onClick={handleSendMessage}
        disabled={message.trim() === ""} // Отключаем кнопку, если поле пустое
      >
        ➤
      </button>
    </div>
  );
};

export default MessageInput;
