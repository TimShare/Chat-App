import React, { useState, useEffect } from "react";
import axios from "axios";
import Chat_list from "../chat_list/Chat_List";
import Modal from "../modal/Modal";
import "./Sidebar.css";
import {
  addMessageHandler,
  removeMessageHandler,
} from "../../helpers/websocketService";

const Sidebar = ({ userdata, setSelectedChat }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userChats, setUserChats] = useState([]);
  const user_id = userdata.id;

  const fetchUserChats = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/users/${user_id}/chats`
      );
      setUserChats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user_id) {
      fetchUserChats();

      const handleNewMessage = (message) => {
        fetchUserChats();
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
          onChatCreated={fetchUserChats}
        />
      )}
    </aside>
  );
};

export default Sidebar;
