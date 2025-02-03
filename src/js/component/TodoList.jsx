import React, { useState, useEffect } from "react";

export const TodoList = () => {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null); 
  const [editedText, setEditedText] = useState(""); 

  const userApiUrl = "https://playground.4geeks.com/todo/users/JaimeGHE";
  const todoApiUrl = "https://playground.4geeks.com/todo/todos/JaimeGHE";

  const fetchTodos = async () => {
    try {
      const response = await fetch(userApiUrl);
      if (!response.ok) throw new Error("Error al obtener las tareas");

      const data = await response.json();
      if (Array.isArray(data.todos)) {
        setTodos(data.todos);
      } else {
        console.error("Formato de respuesta inesperado:", data);
      }
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  const addTodo = async (task) => {
    try {
      const newTask = { label: task, done: false };

      const response = await fetch(todoApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error("Error al agregar la tarea");

      fetchTodos();
      setNewTodo("");
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar la tarea");

      fetchTodos();
    } catch (error) {
      console.error("Error eliminando tarea:", error);
    }
  };

  const updateTodo = async (id, newLabel) => {
    try {
      const body = JSON.stringify({ label: newLabel });

      const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: body,
      });

      if (!response.ok) throw new Error("Error al actualizar la tarea");

      fetchTodos();
      setEditingId(null);
    } catch (error) {
      console.error("Error actualizando tarea:", error);
    }
  };

  const clearAllTodos = async () => {
    try {
      for (const todo of todos) {
        await deleteTodo(todo.id);
      }
    } catch (error) {
      console.error("Error al borrar todas las tareas:", error);
    }
  };

  const completeTodo = async (id) => {
    deleteTodo(id);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-center mt-5">Todo List Fetch</h1>
      <div>
        <input
          onChange={(e) => setNewTodo(e.target.value)}
          type="text"
          value={newTodo}
          placeholder="Nueva tarea"
        />
        <button onClick={() => newTodo.trim() && addTodo(newTodo)}>Add task</button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <input
              type="checkbox"
              onChange={() => completeTodo(todo.id)} 
            />
            {editingId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <button onClick={() => updateTodo(todo.id, editedText)}>Save</button>
              </>
            ) : (
              <>
                <span>{todo.label}</span>
                <button onClick={() => { setEditingId(todo.id); setEditedText(todo.label); }}>Edit task</button>
              </>
            )}
            <button onClick={() => deleteTodo(todo.id)}>Borrar</button>
          </li>
        ))}
      </ul>

      <footer style={{ marginTop: "20px", padding: "10px", borderTop: "1px solid #ccc" }}>
        {todos.length === 0 ? "No pending tasks" : `${todos.length} pending tasks`}
        <button style={{ marginLeft: "10px" }} onClick={clearAllTodos}>
          Clear all
        </button>
      </footer>
    </div>
  );
};
