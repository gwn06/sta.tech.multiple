import { createClient } from "@/utils/supabase/server";
import TodoApp from "./components/todo-list";
import { redirect } from "next/navigation";

export default async function Activity1() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/sign-in");
  }
  return (
    <div className="max-w-md mx-auto mt-10">
      <TodoApp userId={data.user.id} />
    </div>
  );
}
