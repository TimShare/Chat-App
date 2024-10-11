import React, { useState, useEffect, useContext } from "react";
import "./ChatWindow.css";
import AddMemberModal from "../addMemberModal/AddMemberModal";
import MessageInput from "../messageInput/MessageInput";
import NotChat from "../notChat";
import Messages from "../messages/Messages";
import ChatInfoModal from "../сhatInfoModal/ChatInfoModal";
import { ChatContext } from "../../helpers/chatContext";
import { getUsernameById } from "../../helpers/getUsernameById";
import { sendMessage } from "../../helpers/websocketService";
import fetchUserChats from "../../helpers/fetchUserChats";
import {
  addMessageHandler,
  removeMessageHandler,
} from "../../helpers/websocketService";
const ChatWindow = ({ chat, userdata, ws, setSelectedChat }) => {
  const { setUserChats } = useContext(ChatContext);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isChatInfoModalOpen, setIsChatInfoModalOpen] = useState(false);
  const [userIds, setUserIds] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const [accessLevels, setAccessLevels] = useState({}); // Состояние для хранения прав доступа
  const [editMessage, setEditMessage] = useState(null);
  // Функция для получения участников
  const fetchChatMembers = async (chatId) => {
    const response = await fetch(
      `http://localhost:8000/chats/users/?chat_id=${chatId}`
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
    return usernames; // Возвращаем usernames для обновления в модальном окне
  };

  //ws обновление доступов
  useEffect(() => {
    // Обработчик для событий WebSocket
    const handleWebSocketMessage = (message) => {
      const { action_type } = message;
      if (action_type === "permissions_changed") {
        fetchChatMembers(chat.id); // Обновляем доступы участников
      }
    };

    // Добавляем обработчик событий
    addMessageHandler(handleWebSocketMessage);

    // Удаляем обработчик при размонтировании компонента
    return () => {
      removeMessageHandler(handleWebSocketMessage);
    };
  }, [chat]);

  useEffect(() => {
    if (chat) {
      fetchChatMembers(chat.id); // Получаем участников при загрузке чата
    }
  }, [chat]);

  const handleDeleteChat = async (chatId) => {
    const confirmed = window.confirm(
      "Вы уверены, что хотите удалить этот чат?"
    );
    if (confirmed) {
      try {
        const response = await fetch(
          `http://localhost:8000/chats/${chatId}?user_id=${userdata.id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          alert("Чат успешно удален!");
          setIsChatInfoModalOpen(false); // Закрыть модальное окно после удаления
          fetchUserChats(setUserChats, userdata.id);
          sendMessage({
            content: "Chat deleted",
            action_type: "chat_deleted",
            chat_id: chat.id,
          });
        } else {
          alert("Ошибка при удалении чата");
        }
      } catch (error) {
        console.error("Ошибка:", error);
      }
    }
  };

  const handleAccessChange = async (username, event) => {
    const newAccess = event.target.value;
    setAccessLevels((prevLevels) => ({
      ...prevLevels,
      [username]: newAccess,
    }));
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
      await sendMessage({
        chat_id: chat.id,
        content: `изменил права доступа для ${username}`, // Используем имя пользователя
        sender_id: chat.owner_id,
        action_type: "send_message",
      });
      await sendMessage({
        content: "Permissions changed",
        action_type: "permissions_changed",
      });
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
      <Messages chat={chat} ws={ws} onEditMessage={setEditMessage} />
      <MessageInput
        ws={ws}
        chat={chat}
        userdata={userdata}
        accessLevels={accessLevels}
        editMessage={editMessage} // Передаем редактируемое сообщение
        onEditComplete={() => setEditMessage(null)} // Сбрасываем после редактирования
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
        handleAccessChange={handleAccessChange}
        handleDeleteChat={handleDeleteChat} // Передаем функцию изменения доступа
        fetchChatMembers={fetchChatMembers} // Передаем функцию для получения участников
      />
    </main>
  );
};

export default ChatWindow;
