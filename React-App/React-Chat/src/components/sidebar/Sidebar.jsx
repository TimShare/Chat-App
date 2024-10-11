import React, { useState, useEffect, useContext } from "react";
import { ChatContext } from "../../helpers/chatContext";
import axios from "axios";
import Chat_list from "../chat_list/Chat_List";
import Modal from "../modal/Modal";
import fetchUserChats from "../../helpers/fetchUserChats";
import "./Sidebar.css";
import {
  addMessageHandler,
  removeMessageHandler,
} from "../../helpers/websocketService";

const Sidebar = ({ userdata, setSelectedChat }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userChats, setUserChats } = useContext(ChatContext);
  const user_id = userdata.id;
  useEffect(() => {
    if (user_id) {
      fetchUserChats(setUserChats, user_id);
      const handleNewMessage = (message) => {
        // Проверяем, если действие 'chat_deleted'
        if (message.action_type === "chat_deleted") {
          fetchUserChats(setUserChats, user_id);
        } else {
          fetchUserChats(setUserChats, user_id);
        }
      };

      addMessageHandler(handleNewMessage); // Добавляем обработчик сообщений

      return () => {
        removeMessageHandler(handleNewMessage); // Очищаем обработчик при размонтировании
      };
    }
  }, [user_id]);

  const handleChatSelect = (chatId) => {
    const selectedChat = userChats.find((chat) => chat.id === chatId);
    setSelectedChat(selectedChat);
  };

  return (
    <aside className="sidebar">
      <div className="profile">
        <span>{userdata.username}</span>
        <button
          className="new-chat"
          onClick={() => fetchUserChats(setUserChats, user_id)}
        >
          Обновить
        </button>
        <button className="new-chat" onClick={() => setIsModalOpen(true)}>
          Новый чат
        </button>
      </div>

      {userChats && (
        <Chat_list userChats={userChats} onChatSelect={handleChatSelect} />
      )}
      {isModalOpen && (
        <Modal
          userdata={userdata}
          setIsModalOpen={setIsModalOpen}
          onChatCreated={() => fetchUserChats(setUserChats, user_id)}
        />
      )}
    </aside>
  );
};

export default Sidebar;
