import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  addMessageHandler,
  removeMessageHandler,
} from "../../helpers/websocketService";
import FormatDate from "../../helpers/FormatDate";
import "./Messages.css";

const Messages = ({ chat, onEditMessage }) => {
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null); // Реф для прокрутки вниз

  const handleEdit = (message) => {
    onEditMessage(message); // Вызываем функцию редактирования
  };

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
      console.log(newMessage);
      if (newMessage.chat_id === chat.id) {
        if (newMessage.action_type === "send_message") {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
        if (newMessage.action_type === "message_edited") {
          console.log("edit message");
          setMessages((prevMessages) =>
            prevMessages.map(
              (message) =>
                message.id === newMessage.id
                  ? {
                      ...message,
                      content: newMessage.content,
                      is_edited: newMessage.is_edited,
                    } // Обновляем content и is_edited
                  : message // Возвращаем оригинальное сообщение, если id не совпадает
            )
          );
        }
      }
    };

    addMessageHandler(handleNewMessage);

    return () => {
      removeMessageHandler(handleNewMessage);
    };
  }, [chat.id]);

  useEffect(() => {
    // Прокрутка к нижнему элементу при добавлении нового сообщения
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages">
      <ul className="messages-list">
        {messages.length > 0 ? (
          messages.map((message) => (
            <li
              key={message.id}
              className="message-item"
              onClick={() => handleEdit(message)}
            >
              <span className="message-author">{message.username}</span>
              <span className="message-content">{message.content}</span>
              <span className="message-edited">
                {message.is_edited ? "изм." : ""}
              </span>
              <span className="message-time">
                {FormatDate(message.created_at)}
              </span>
            </li>
          ))
        ) : (
          <p>Нет сообщений в этом чате.</p>
        )}
        <div ref={bottomRef} /> {/* Элемент для прокрутки */}
      </ul>
    </div>
  );
};

export default Messages;
