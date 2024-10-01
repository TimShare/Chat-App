import FormatDate from "../../helpers/FormatDate";
const Chat_list = ({ userChats, onChatSelect }) => {
  const sortedChats = [...userChats].sort((a, b) => {
    return new Date(b.updated_at) - new Date(a.updated_at); // Сортировка по убыванию
  });

  return (
    <div className="contact-list">
      {sortedChats.map((chat) => {
        return (
          <div
            key={chat.id}
            className="contact"
            onClick={() => onChatSelect(chat.id)} // Передайте ID чата при клике
          >
            <span className="contact-name">{chat.title}</span>
            <span className="message-time">{FormatDate(chat.updated_at)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Chat_list;
