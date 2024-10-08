import React, { useEffect, useState } from "react";
import "./ChatInfoModal.css";
import FormatDate from "../../helpers/FormatDate";

const ChatInfoModal = ({
  isOpen,
  onClose,
  chat,
  userdata,
  accessLevels,
  handleAccessChange,
  handleDeleteChat,
  fetchChatMembers, // Добавьте функцию для получения участников
}) => {
  const [updatedUsernames, setUpdatedUsernames] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchChatMembers(chat.id) // Получаем участников при открытии модального окна
        .then((usernames) => {
          setUpdatedUsernames(usernames);
        });
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const isOwner = userdata.id === chat.owner_id; // Проверка на владельца чата

  return (
    <div className="chat-info-modal">
      <div className="chat-info-content">
        <div className="chat-header">
          <h2>{chat.title}</h2>
          {isOwner && (
            <button
              className="delete-chat-btn"
              onClick={() => handleDeleteChat(chat.id)}
            >
              Удалить чат
            </button>
          )}
        </div>
        <p>Дата основания: {FormatDate(chat.created_at)}</p>
        <h3>Участники:</h3>
        <ul>
          {updatedUsernames.map((username, index) => (
            <li key={index}>
              {username === userdata.username ? "Вы" : username}
              {isOwner && (
                <select
                  value={accessLevels[username] || "read"}
                  onChange={(event) => handleAccessChange(username, event)}
                >
                  <option value="read">Read</option>
                  <option value="read_and_write">Read and Write</option>
                </select>
              )}
            </li>
          ))}
        </ul>
        <button className={"chat-info-content-button"} onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default ChatInfoModal;
