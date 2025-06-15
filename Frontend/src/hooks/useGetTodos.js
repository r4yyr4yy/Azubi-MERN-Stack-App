
import { useState } from "react";
import { CustomErrorAlert } from "../utils/general.js";

const useGetTodos = (setTodos, setNumOfPages, setPage) => {
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = async (page, limit) => {
    setIsLoading(true);
    try {
      
      const response = await fetch(
        `/api/gettodos?page=${page}&limit=${limit}`
      );
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

    
      setTodos(data.todoList);
      
      
      setNumOfPages(data.numOfPages); 
      
   
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