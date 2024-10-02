import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  addMessageHandler,
  removeMessageHandler,
  connectWebSocket,
} from "../../helpers/websocketService";
import FormatDate from "../../helpers/FormatDate";
import "./Messages.css";

const Messages = ({ chat }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/messages`, {
          params: { chat_id: chat.id },
        });
        const loadedMessages = response.data;
        setMessages(loadedMessages);
      } catch (error) {
        console.error("Ошибка при загрузке сообщений:", error);
      }
    };

    fetchMessages();
  }, [chat.id]);

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      if (newMessage.chat_id === chat.id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    addMessageHandler(handleNewMessage); // Добавляем обработчик сообщений WebSocket

    return () => {
      removeMessageHandler(handleNewMessage); // Убираем обработчик при размонтировании компонента
    };
  }, [chat.id]);

  return (
    <div className="messages">
      <ul className="messages-list">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <li key={index} className="message-item">
              <span className="message-author">{message.username}</span>
              <span className="message-content">{message.content}</span>
              <span className="message-time">
                {FormatDate(message.created_at)}
              </span>
            </li>
          ))
        ) : (
          <p>Нет сообщений в этом чате.</p>
        )}
      </ul>
    </div>
  );
};

export default Messages;
