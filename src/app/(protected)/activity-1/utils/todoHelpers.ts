export const handleAddTodo = async (
  supabase: any,
  todo: any,
  userId: any,
  todos: any,
  setTodos: any,
  setTodo: any
) => {
  if (todo.trim() === "") return;
  const newTodo = {
    is_complete: false,
    task: todo,
    user_id: userId,
  };

  const { data, error } = await supabase
    .from("staclara_todos")
    .insert([newTodo])
    .select()
    .single();

  if (data !== null) {
    const newTodoResponse = data;
    setTodos([newTodoResponse, ...todos]);
    setTodo("");
  }
};

export const handleEditTodo = async (
  supabase: any,
  id: number,
  todos: any[],
  setTodos: any
) => {
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

export const handleRemoveTodo = async (
  supabase: any,
  id: number,
  todos: any[],
  setTodos: any
) => {
  const { error } = await supabase.from("staclara_todos").delete().eq("id", id);
  if (error) return;

  const updatedTodos = todos.filter((todo) => todo.id !== id);
  setTodos(updatedTodos);
};

export const toggleTodoStatus = async (
  supabase: any,
  id: number,
  status: boolean,
  todos: any[],
  setTodos: any
) => {
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
