import { useState, memo } from "react";
import axios from "axios";
import "./Modal.css";

const Modal = memo(({ setIsModalOpen, userdata, onChatCreated }) => {
  const [chatName, setChatName] = useState("");
  const [chatDescription, setChatDescription] = useState("");

  const handleCreateChat = () => {
    if (chatName && chatDescription) {
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
          if (onChatCreated) {
            onChatCreated(); // Обновляем список чатов
          }
        })
        .catch((error) => {
          console.error("Ошибка создания группы", error);
        });
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Создать новую группу</h2>

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

        <div className="modal-actions">
          <button onClick={handleCreateChat}>Создать группу</button>
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
});

export default Modal;
