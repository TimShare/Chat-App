import { useState } from "react";
import axios from "axios";
import "./Modal.css";

const Modal = ({ setIsModalOpen, userdata, onChatCreated }) => {
  const [activeTab, setActiveTab] = useState("private"); // Для переключения вкладок
  const [chatName, setChatName] = useState("");
  const [chatDescription, setChatDescription] = useState("");

  const handleCreateChat = () => {
    if (activeTab === "group" && chatName && chatDescription) {
      // Создание группы
      axios
        .post("http://localhost:8000/chats", {
          title: chatName,
          comment: chatDescription,
          owner_id: userdata.id,
        })
        .then((response) => {
          console.log("Group chat created:", response.data);
          setIsModalOpen(false);
          setChatName("");
          setChatDescription("");
          onChatCreated();
        })
        .catch((error) => {
          console.error("Ошибка создания группы", error);
        });
    } else if (activeTab === "private" && chatName) {
      // Создание личного сообщения
      axios
        .post("http://localhost:8000/chats/private-chat", null, {
          params: {
            to_user_id: chatName, // Идентификатор пользователя, с которым создаем чат
            current_user: userdata.id, // ID текущего пользователя
          },
        })
        .then((response) => {
          console.log("Private chat created:", response.data);
          setIsModalOpen(false);
          setChatName(""); // Очищаем поля
          onChatCreated(); // Обновляем список чатов
        })
        .catch((error) => {
          console.error("Ошибка создания личного чата", error);
        });
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Создать новый чат</h2>
        {/* Вкладки */}
        <div className="tab-container">
          <button
            className={activeTab === "private" ? "active" : ""}
            onClick={() => setActiveTab("private")}
          >
            Личное сообщение
          </button>
          <button
            className={activeTab === "group" ? "active" : ""}
            onClick={() => setActiveTab("group")}
          >
            Группа
          </button>
        </div>

        {/* Контент для вкладок */}
        {activeTab === "private" && (
          <>
            <label>Имя пользователя</label>
            <input
              type="text"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Введите имя пользователя"
            />
          </>
        )}

        {activeTab === "group" && (
          <>
            <label>Название группы</label>
            <input
              type="text"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Введите название группы"
            />
            <label>Описание группы</label>
            <textarea
              value={chatDescription}
              onChange={(e) => setChatDescription(e.target.value)}
              placeholder="Введите описание группы"
            />
          </>
        )}

        <div className="modal-actions">
          <button onClick={handleCreateChat}>
            {activeTab === "group" ? "Создать группу" : "Отправить сообщение"}
          </button>
          <button
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
