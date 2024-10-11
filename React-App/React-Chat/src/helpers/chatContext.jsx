import React, { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [userChats, setUserChats] = useState([]);

  return (
    <ChatContext.Provider value={{ userChats, setUserChats }}>
      {children}
    </ChatContext.Provider>
  );
};
