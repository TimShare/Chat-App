import { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import ChatWindow from "../chatWindow/ChatWindow";
import {
  connectWebSocket,
  disconnectWebSocket,
  getWebSocketState,
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

  return (
    <div className="chat-container">
      <Sidebar
        userdata={userdata}
        setUserdata={setUserdata}
        setSelectedChat={setSelectedChat}
      />
      <ChatWindow
        chat={selectedChat}
        userdata={userdata}
        setSelectedChat={setSelectedChat}
      />
    </div>
  );
};

export default ChatApp;
