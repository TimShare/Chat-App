const FormatDate = (dateString) => {
  const chatDate = new Date(dateString);
  const today = new Date();
  const isToday = chatDate.toDateString() === today.toDateString();
  if (isToday) {
    return chatDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    return chatDate.toLocaleString("ru-RU", { weekday: "long" });
  }
};

export default FormatDate;
