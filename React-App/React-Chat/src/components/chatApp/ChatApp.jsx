import { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import ChatWindow from "../chatWindow/ChatWindow";
import { ChatProvider } from "../../helpers/chatContext";
import {
  connectWebSocket,
  disconnectWebSocket,
  addMessageHandler,
  removeMessageHandler,
} from "../../helpers/websocketService";
import "./ChatApp.css";

const ChatApp = ({ userdata, setUserdata }) => {
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (userdata) {
      const handleWebSocketOpen = () => {};

      const handleWebSocketClose = () => {};

      connectWebSocket(userdata.id, handleWebSocketOpen, handleWebSocketClose);

      return () => {
        disconnectWebSocket(); // Отключаем WebSocket при размонтировании компонента
      };
    }
  }, [userdata]);
  useEffect(() => {
    if (userdata.id) {
      const handleNewMessage = (message) => {
        if (
          message.action_type === "chat_deleted" &&
          selectedChat.id == message.chat_id
        ) {
          setSelectedChat(null);
        }
      };
      addMessageHandler(handleNewMessage); // Добавляем обработчик сообщений
      return () => {
        removeMessageHandler(handleNewMessage); // Очищаем обработчик при размонтировании
      };
    }
  }, [selectedChat]);
  return (
    <div className="chat-container">
      <ChatProvider>
        <Sidebar
          userdata={userdata}
          setUserdata={setUserdata}
          setSelectedChat={setSelectedChat}
          chat={selectedChat}
        />
        <ChatWindow
          chat={selectedChat}
          userdata={userdata}
          setSelectedChat={setSelectedChat}
        />
      </ChatProvider>
    </div>
  );
};

export default ChatApp;
