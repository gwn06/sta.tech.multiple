"use client";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FileUploadButton({ userId }: { userId: string }) {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const uploadImage = async (files: FileList, userId: string) => {
    const supabase = createClient();
    try {
      for (const file of files) {
        const { data, error } = await supabase.storage
          .from("drivelite")
          .upload(`${userId}/${file.name}`, file!);
        if (error) {
          console.error(error);
          throw error;
        } else {
          const { data: publicUrl } = await supabase.storage
            .from("drivelite")
            .getPublicUrl(data.path);

          await supabase.from("drivelite").insert([
            {
              user_id: userId,
              name: file.name,
              image_path: data.path,
              image_url: publicUrl.publicUrl,
            },
          ]);
        }
      }
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;
    try {
      setUploading(true);
      await uploadImage(files, userId);
      setUploading(false);
    } catch (error) {
      setUploading(false);
      console.error(error);
    }
  };

  return (
    <div className="p-2">
      <input
        type="file"
        multiple
        accept=".png, .jpg"
        id="file-upload"
        name="file-upload"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <label
        htmlFor="file-upload"
        className={`cursor-pointer p-2 text-white drop-shadow-lg border bg-green-500 rounded shadow-sm hover:bg-green-600 ease-in-out transition ${
          uploading ? "cursor-not-allowed bg-green-400 hover:bg-green-400" : ""
        }`}
      >
        {uploading ? "Uploading..." : "Upload"}
      </label>
    </div>
  );
}
