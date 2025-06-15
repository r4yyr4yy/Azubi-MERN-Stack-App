// Corrected useDeleteTodo.js file
import { useState } from "react";
import { CustomErrorAlert } from "../utils/general.js";

const useDeleteTodo = (fetchTodos, page, limit) => {
  const [isLoading, setIsLoading] = useState(false);
  let status = false;

  const deleteTodo = async (id) => {
    try {
      setIsLoading(true);
      // THE URL IS NOW CORRECTED TO A RELATIVE PATH
      const response = await fetch(
        `/api/todos/${id}`, // <--- THIS IS THE FIX
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      status = response.ok;
      await fetchTodos(page, limit);
    } catch (error) {
      CustomErrorAlert(error.message);
    } finally {
      setIsLoading(false);
    }
    return status;
  };

  return { deleteTodo, isDeletingTodo: isLoading };
};

export default useDeleteTodo;