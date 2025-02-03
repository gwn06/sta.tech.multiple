"use client";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

interface Todo {
  id?: number;
  is_complete: boolean;
  task: string;
  inserted_at?: string;
  user_id: string;
}

export default function TodoApp({ userId }: { userId: string }) {
  const supabase = createClient();
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTodos() {
        setLoading(true);
      const { data } = await supabase
        .from("staclara_todos")
        .select("*")
        .order("inserted_at", { ascending: false });
      if (data) {
        setTodos(data);
      }
      setLoading(false);
    }
    fetchTodos();
  }, [supabase]);

  const handleAddTodo = async () => {
    if (todo.trim() === "") return;
    const newTodo: Todo = {
      is_complete: false,
      task: todo,
      user_id: userId,
    };

    const { data, error } = await supabase
      .from("staclara_todos")
      .insert([newTodo])
      .select()
      .single();

    console.log(error);

    if (data !== null) {
      const newTodoResponse: Todo = data;
      setTodos([newTodoResponse, ...todos]);
      setTodo("");
    }
  };

  const handleEditTodo = async (id: number) => {
    const updatedTask = prompt("Update task");
    if (updatedTask === null || updatedTask.trim() === "") return;

    const { data } = await supabase
      .from("staclara_todos")
      .update({ task: updatedTask })
      .eq("id", id)
      .select();

    if (data === null) return;

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, task: updatedTask } : todo
    );
    setTodos(updatedTodos);
  };

  const handleRemoveTodo = async (id: number) => {
    const { error } = await supabase
      .from("staclara_todos")
      .delete()
      .eq("id", id);
    if (error) return;

    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const toggleTodoStatus = async (id: number, status: boolean) => {
    const { data } = await supabase
      .from("staclara_todos")
      .update({ is_complete: !status })
      .eq("id", id)
      .select();

    if (data === null) return;

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, is_complete: !todo.is_complete } : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">To-do List Supabase</h1>
      <div className="flex flex-row mb-4">
        <input
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          placeholder="Enter a task"
          className="border-2 p-2 rounded-md mr-2 w-80"
        />
        <button
          onClick={handleAddTodo}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
        >
          Add
        </button>
      </div>
        {loading && <p>Loading...</p>}
      <ul className="list-none w-96">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between p-1 mb-2 border-b">
            <input
              className="h-6 w-6"
              type="checkbox"
              checked={todo.is_complete}
              onChange={() => toggleTodoStatus(todo.id!, todo.is_complete)}
            />
            <span className={todo.is_complete ? " line-through" : ""}>
              {todo.task}
            </span>

            <div>
              <button
                onClick={() => handleEditTodo(todo.id!)}
                className="hover:bg-orange-500 hover:text-white rounded-md p-2 transition-all ease-in-out duration-100"
              >
                Edit
              </button>
              <button
                onClick={() => handleRemoveTodo(todo.id!)}
                className="hover:bg-red-500 hover:text-white rounded-md p-2 transition-all ease-in-out duration-100"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
