import React from "react";
import "./ChatInfoModal.css";
import FormatDate from "../../helpers/FormatDate";

const ChatInfoModal = ({
  isOpen,
  onClose,
  chat,
  userdata,
  usernames,
  accessLevels,
  handleAccessChange,
}) => {
  if (!isOpen) {
    return null;
  }

  const isOwner = userdata.id === chat.owner_id; // Проверка на владельца чата

  return (
    <div className="chat-info-modal">
      <div className="chat-info-content">
        <h2>{chat.title}</h2>
        <p>Дата основания: {FormatDate(chat.created_at)}</p>
        <h3>Участники:</h3>
        <ul>
          {usernames.map((username, index) => (
            <li key={index}>
              {username === userdata.username ? "Вы" : username}
              {isOwner && ( // Отображаем права доступа только для владельца
                <select
                  value={accessLevels[username] || "read"}
                  onChange={(event) => handleAccessChange(username, event)} // Позволяем владельцу менять права доступа
                >
                  <option value="read">Read</option>
                  <option value="read_and_write">Read and Write</option>
                </select>
              )}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};

export default ChatInfoModal;
