export const getUsernameById = async (userId) => {
  try {
    const response = await fetch(
      `http://localhost:8000/users/get_username?user_id=${userId}`
    );

    if (!response.ok) {
      throw new Error("Ошибка при получении имени пользователя");
    }

    const data = await response.json(); // Предполагаем, что сервер возвращает строку с именем пользователя
    return data; // Возвращаем имя пользователя
  } catch (error) {
    console.error(error); // Логируем ошибку в консоль
    throw error; // Перебрасываем ошибку, чтобы ее можно было обработать в месте вызова
  }
};
