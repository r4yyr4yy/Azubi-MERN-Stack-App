// Corrected useUpdateTodo.js file
import { useState } from "react";
import { CustomErrorAlert } from "../utils/general.js";

const useUpdateTodo = (setTodos) => {
  const [isLoading, setIsLoading] = useState(false);

  const updateTodo = async (todo) => {
    try {
      setIsLoading(true);
      // THE URL IS NOW CORRECTED TO A RELATIVE PATH
      const response = await fetch(
        `/api/todos/${todo._id}`, // <--- THIS IS THE FIX
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isCompleted: !todo.isCompleted }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      // The local state update is fine as it is.
      setTodos((prevTodos) =>
        prevTodos.map((item) =>
          item._id === todo._id
            ? { ...todo, isCompleted: !todo.isCompleted }
            : item
        )
      );
    } catch (error) {
      CustomErrorAlert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateTodo, isUpdatingTodo: isLoading };
};

export default useUpdateTodo;