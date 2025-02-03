import { createClient } from "@/utils/supabase/server";
import MarkdownApp from "./components/markdown-app";
import { redirect } from "next/navigation";

export default async function Activity5() {
  const supabase = await createClient();
  const {data, error}  = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-full text-center mx-auto">
      <MarkdownApp userId={data.user.id}/>
    </div>
  );
}
