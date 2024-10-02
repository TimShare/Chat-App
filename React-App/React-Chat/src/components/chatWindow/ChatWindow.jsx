// ChatWindow.js
import React, { useState, useEffect } from "react";
import "./ChatWindow.css";
import AddMemberModal from "../addMemberModal/AddMemberModal";
import MessageInput from "../messageInput/MessageInput";
import NotChat from "../notChat";
import Messages from "../messages/Messages";
import ChatInfoModal from "../сhatInfoModal/ChatInfoModal";
import { getUsernameById } from "../../helpers/getUsernameById";
import { sendMessage } from "../../helpers/websocketService";
const ChatWindow = ({ chat, userdata, ws }) => {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isChatInfoModalOpen, setIsChatInfoModalOpen] = useState(false);
  const [userIds, setUserIds] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const [accessLevels, setAccessLevels] = useState({}); // Состояние для хранения прав доступа

  useEffect(() => {
    const fetchChatMembers = async () => {
      const response = await fetch(
        `http://localhost:8000/chats/users/?chat_id=${chat.id}`
      );

      const data = await response.json();
      setUserIds(data);

      const usernames = await Promise.all(data.map(getUsernameById));
      setUsernames(usernames);

      const initialAccessLevels = {};
      await Promise.all(
        data.map(async (userId, index) => {
          const permissionResponse = await fetch(
            `http://localhost:8000/permissions/?chat_id=${chat.id}&user_id=${userId}`
          );
          const permissionData = await permissionResponse.json();

          initialAccessLevels[usernames[index]] = permissionData.role || "read"; // Устанавливаем по умолчанию "read", если роль не найдена
        })
      );
      setAccessLevels(initialAccessLevels);
    };

    if (chat) {
      fetchChatMembers();
    }
  }, [chat, userdata]);

  const handleAccessChange = async (username, event) => {
    const newAccess = event.target.value;
    setAccessLevels((prevLevels) => ({
      ...prevLevels,
      [username]: newAccess,
    }));

    // Отправка изменения прав доступа на сервер сразу
    const userId = userIds[usernames.indexOf(username)]; // Получаем идентификатор пользователя
    const chatPermission = {
      chat_id: chat.id,
      user_id: userId,
      role: newAccess,
    };

    try {
      const response = await fetch(
        "http://localhost:8000/permissions/change_permission",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chatPermission),
        }
      );

      const username = await getUsernameById(userId); // Дожидаемся результата

      const messageData = {
        chat_id: chat.id,
        content: `изменил права доступа для ${username}`, // Используем имя пользователя
        sender_id: chat.owner_id,
      };

      // Отправляем сообщение через сервис WebSocket
      await sendMessage(messageData);

      if (!response.ok) {
        throw new Error("Ошибка при изменении прав доступа");
      }

      console.log(`Изменены права доступа для ${username} на ${newAccess}`);
    } catch (error) {
      console.error("Ошибка при сохранении прав доступа:", error);
    }
  };

  if (!chat) {
    return <NotChat />;
  }

  return (
    <main className="chat-window">
      <div className="chat-header">
        <span
          className="chat-username"
          onClick={() => setIsChatInfoModalOpen(true)}
        >
          {chat.title}
        </span>
        <button
          className="add-member"
          onClick={() => setIsAddMemberModalOpen(true)}
        >
          Добавить участника
        </button>
      </div>
      <Messages chat={chat} ws={ws} />
      <MessageInput
        ws={ws}
        chat={chat}
        userdata={userdata}
        accessLevels={accessLevels} // Передаем accessLevels в MessageInput
      />
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        chat={chat}
      />
      <ChatInfoModal
        isOpen={isChatInfoModalOpen}
        onClose={() => setIsChatInfoModalOpen(false)} // Закрываем модальное окно
        chat={chat}
        userdata={userdata}
        usernames={usernames} // Передаем usernames
        accessLevels={accessLevels} // Передаем accessLevels
        handleAccessChange={handleAccessChange} // Передаем функцию изменения доступа
      />
    </main>
  );
};

export default ChatWindow;
