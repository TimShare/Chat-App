// websocketService.js

let websocket = null;
let messageHandlers = [];

export const connectWebSocket = (userId, onOpen, onClose, onError) => {
  if (!websocket || websocket.readyState === WebSocket.CLOSED) {
    websocket = new WebSocket(`ws://localhost:8000/ws/${userId}`);

    websocket.onopen = () => {
      console.log("WebSocket соединение установлено");
      if (onOpen) onOpen();
    };

    websocket.onclose = () => {
      console.log("WebSocket соединение закрыто");
      if (onClose) onClose();
      // Автоподключение через 3 секунды
      setTimeout(
        () => connectWebSocket(userId, onOpen, onClose, onError),
        3000
      );
    };

    websocket.onerror = (error) => {
      console.error("WebSocket ошибка:", error);
      if (onError) onError(error);
      websocket.close();
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      messageHandlers.forEach((handler) => handler(data));
    };
  }
};

export const disconnectWebSocket = () => {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.close();
  }
};

export const sendMessage = (message) => {
  if (websocket) {
    websocket.send(JSON.stringify(message));
  } else {
    console.error("WebSocket не подключен");
  }
};

// Функция для добавления обработчика сообщений
export const addMessageHandler = (handler) => {
  messageHandlers.push(handler);
};

// Функция для удаления обработчика сообщений
export const removeMessageHandler = (handler) => {
  messageHandlers = messageHandlers.filter((h) => h !== handler);
};

export const getWebSocketState = () => websocket.readyState;
