import { useEffect, useState } from "react";
import { MarkdownData } from "./markdown-app";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/utils/supabase/client";

interface MarkdownViewProps {
  userId: string;
  updateMarkdownList: (markdown: MarkdownData, op: string) => void;
  selectedMarkdown: MarkdownData | null | undefined;
  updateSelectedMarkdown: (markdown: MarkdownData | null) => void ;
}

export default function MarkdownView({
  selectedMarkdown,
  userId,
  updateMarkdownList,
  updateSelectedMarkdown
}: MarkdownViewProps) {
  const supabase = createClient();
  const [isPreview, setIsPreview] = useState(selectedMarkdown ? true : false);

  const [markdown, setMarkdown] = useState(selectedMarkdown?.markdown ?? "");
  const [title, setTitle] = useState(selectedMarkdown?.title ?? "");
  const [isCompleted, setIsCompleted] = useState(
    selectedMarkdown?.is_completed ?? false
  );

  useEffect(() => {
    setIsPreview(selectedMarkdown ? true : false);
    setMarkdown(selectedMarkdown?.markdown ?? "");
    setTitle(selectedMarkdown?.title ?? "");
    setIsCompleted(selectedMarkdown?.is_completed ?? false);
  }, [selectedMarkdown]);

  const togglePreview = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setIsPreview(!isPreview);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedMarkdown) {
      console.log("INSERT", !selectedMarkdown);
      const { data } = await supabase
        .from("markdowns")
        .insert({
          user_id: userId,
          title,
          markdown,
          is_completed: isCompleted,
        })
        .select()
        .single();
      if (data) {
        updateSelectedMarkdown(data);
        updateMarkdownList(data, "insert");
      }
    } else {
      const { data } = await supabase
        .from("markdowns")
        .update({
          user_id: userId,
          title,
          markdown,
          is_completed: isCompleted,
        })
        .eq("id", selectedMarkdown.id)
        .select()
        .single();

      if (data) {
        updateSelectedMarkdown(data);
        updateMarkdownList(data, "update");
      }
    }
  };

  const handleDeleteMarkdown = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!selectedMarkdown) return;
    const { data } = await supabase
      .from("markdowns")
      .delete()
      .eq("id", selectedMarkdown.id)
      .select()
      .single();
    if (data) {
      updateMarkdownList(data, "delete");
      updateSelectedMarkdown(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full mx-28">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-2 w-full flex items-center justify-between space-x-2">
          <div className="space-x-2 flex items-center">
            <input
              type="checkbox"
              className="h-6 w-6"
              checked={isCompleted}
              onChange={() => setIsCompleted(!isCompleted)}
            />
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="text-xl font-bold p-2 border-none bg-gray-100 rounded"
            />
          </div>
          <div className="space-x-2">
            {selectedMarkdown !== undefined && selectedMarkdown !== null && (
              <button
                onClick={(e) => handleDeleteMarkdown(e)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Delete
              </button>
            )}
            <button
              onClick={togglePreview}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
            >
              {isPreview ? "Edit" : "Preview"}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
        <div className="w-full ">
          {!isPreview && (
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full p-2 border border-gray-300  rounded-md"
              rows={20}
              name=""
              id=""
            ></textarea>
          )}
          {isPreview && (
            <div className="overflow-y-auto w-full markdown bg-white h-[500px] text-left rounded-md p-2 border border-gray-300">
              <ReactMarkdown className="prose" remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
