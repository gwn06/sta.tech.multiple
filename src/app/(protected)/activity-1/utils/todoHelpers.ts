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
