// Corrected useAddTodos.js file

import { useState } from "react";
import {
  CustomSuccessAlert,
  CustomErrorAlert,
  defaultTodo,
} from "../utils/general.js";

const useAddTodos = (fetchTodos, page, limit, setNewTodo) => {
  const [isLoading, setIsLoading] = useState(false);

  const addTodo = async (todo) => {
    try {
      setIsLoading(true);
      // THE URL IS NOW CORRECTED TO A RELATIVE PATH
      const response = await fetch(
        "/api/todos", // <--- THIS IS THE FIX
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(todo),
        }
      );

      if (!response.ok) {
        // Let's get more details on the error for better debugging
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      await fetchTodos(page, limit);
      setNewTodo(defaultTodo);
      CustomSuccessAlert("New Todo added successfully");
    } catch (error) {
      CustomErrorAlert(error.message); // Pass error.message for a clearer alert
    } finally {
      setIsLoading(false);
    }
  };

  return { addTodo, isAddingTodo: isLoading };
};

export default useAddTodos;