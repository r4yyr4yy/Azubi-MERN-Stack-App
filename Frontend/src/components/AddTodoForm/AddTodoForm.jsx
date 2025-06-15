// Corrected AddTodoForm.jsx file

import { LoadingButton } from "@mui/lab";
import { Box, TextField } from "@mui/material";
import React, { useState } from "react";
// We removed the unused 'defaultTodo' import as it's not used in this file.
import useAddTodo from "../../hooks/useAddTodo.js";
// We removed 'import axios from "axios";' because it is no longer needed.

const AddTodoForm = ({ fetchTodos, page, limit }) => {
  // The initial state setup is correct.
  let [newTodo, setNewTodo] = useState({
    "title": "",
    "description": "",
    "activity": "",
    "date": "",
    "strStatus": ""
  });

  // This custom hook correctly handles the API call logic.
  const { addTodo, isAddingTodo } = useAddTodo(
    fetchTodos,
    page,
    limit,
    setNewTodo
  );

  // The validation logic is correct.
  const isValidateInputs =
    newTodo.title.length < 10 || newTodo.description.length < 15;

  // --- THIS IS THE CORRECTED AND SIMPLIFIED FUNCTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    // We only need to call the 'addTodo' function from our custom hook.
    // It already handles making the API call, showing alerts, and clearing the form.
    // The redundant axios call and its try/catch block have been removed,
    // which fixes both the syntax error and the logic flaw.
    await addTodo({ ...newTodo });
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        alignItems: "flex-start",
        flexGrow: 1,
        height: "70px",
        gap: 4,
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <TextField
        id="title"
        name="title"
        label="Todo Title"
        variant="outlined"
        value={newTodo.title}
        onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
        error={newTodo.title.length > 0 && newTodo.title.length < 10}
        helperText={
          newTodo.title.length > 0 && newTodo.title.length < 10
            ? "Title must be at least 10 characters"
            : ""
        }
        sx={{
          width: "30%",
        }}
      />
      <TextField
        id="description"
        name="description"
        label="Todo Description"
        variant="outlined"
        value={newTodo.description}
        onChange={(e) =>
          setNewTodo({ ...newTodo, description: e.target.value })
        }
        error={
          newTodo.description.length > 0 && newTodo.description.length < 15
        }
        helperText={
          newTodo.description.length > 0 && newTodo.description.length < 15
            ? "Description must be at least 15 characters"
            : ""
        }
        sx={{
          flexGrow: 1,
        }}
      />
      <LoadingButton
        loading={isAddingTodo}
        variant="contained"
        size="large"
        type="submit"
        disabled={isValidateInputs}
        sx={{
          p: "14px",
          boxShadow:
            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        }}
      >
        Add Todo
      </LoadingButton>
    </Box>
  );
};

export default AddTodoForm;