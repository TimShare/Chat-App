import React, { useState } from "react";
import "./ChatWindow.css";
import AddMemberModal from "../addMemberModal/AddMemberModal";
import Message_input from "../message_input/Message_input";
import NotChat from "../notChat";
import Messages from "../messages/Messages";
const ChatWindow = ({ chat, userdata, ws }) => {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const handleMemberAdded = () => {
    // Логика для обновления списка участников или чата
  };
  if (!chat) {
    return <NotChat />;
  }

  return (
    <main className="chat-window">
      <div className="chat-header">
        <span className="chat-username">{chat.title}</span>
        <button
          className="add-member"
          onClick={() => setIsAddMemberModalOpen(true)}
        >
          Добавить участника
        </button>
      </div>
      <Messages chat={chat} ws={ws} />
      <Message_input ws={ws} chat={chat} userdata={userdata} />
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        chat={chat}
        onMemberAdded={handleMemberAdded}
      />
    </main>
  );
};

export default ChatWindow;
