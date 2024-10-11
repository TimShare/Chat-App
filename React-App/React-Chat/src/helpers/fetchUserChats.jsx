import axios from "axios";
const fetchUserChats = async (setUserChats, user_id) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/users/${user_id}/chats`
    );
    setUserChats(response.data);
  } catch (error) {
    console.error(error);
  }
};

export default fetchUserChats;
