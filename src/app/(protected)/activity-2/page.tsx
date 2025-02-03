import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Search from "./components/search";
import DriveLite, { DriveImage } from "./components/drive-lite";
import { getDriveliteImages } from "@/app/actions";

export default async function Activity2(props: {
  searchParams?: Promise<{ search: string, sortBy: string, sort: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.search || "";
  const sortBy = searchParams?.sortBy || "name";
  const sort = searchParams?.sort || "asc";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/sign-in");
  }


  const images: Promise<DriveImage[]> = getDriveliteImages(query, sortBy, sort);


  return (
    <div className="max-w-full text-center mx-auto mt-4">
      <h1 className="text-2xl font-bold mb-2">Google Drive lite</h1>
      <Search />
      <Suspense key={query} fallback={<div>Loading...</div>}>
        <DriveLite images={images} userId={data.user.id} />
      </Suspense>
    </div>
  );
}
