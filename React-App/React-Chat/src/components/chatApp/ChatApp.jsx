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
  const [isConnected, setIsConnected] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (userdata) {
      const handleWebSocketOpen = () => {
        setIsConnected(true);
      };

      const handleWebSocketClose = () => {
        setIsConnected(false);
      };

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
      <ChatWindow chat={selectedChat} userdata={userdata} />
    </div>
  );
};

export default ChatApp;
