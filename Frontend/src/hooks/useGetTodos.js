
import { useState } from "react";
import { CustomErrorAlert } from "../utils/general.js";

const useGetTodos = (setTodos, setNumOfPages, setPage) => {
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = async (page, limit) => {
    setIsLoading(true);
    try {
      // This fetch call is correct.
      const response = await fetch(
        `/api/gettodos?page=${page}&limit=${limit}`
      );
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // This is correct.
      setTodos(data.todoList);
      
      // --- THIS LOGIC IS NOW UNCOMMENTED AND ACTIVE ---
      // It uses the 'numOfPages' value sent from our updated backend.
      setNumOfPages(data.numOfPages); 
      
      // This handles the case where you delete the last item on a page,
      // correctly sending you to the new last page.
      if (page > data.numOfPages && data.numOfPages > 0) {
        setPage(data.numOfPages);
      }

    } catch (error) {
      CustomErrorAlert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchTodos, isFetchingTodos: isLoading };
};

export default useGetTodos;