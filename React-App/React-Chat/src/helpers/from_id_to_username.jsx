const From_id_to_username = async (userId) => {
  const response = await axios.get(
    `http://localhost:8000/users/get_username`,
    null,
    { params: { user_id: userId } }
  );
  return response;
};

export default From_id_to_username;
