"use client";
import { useEffect, useState } from "react";
import MarkdownList from "./markdown-list";
import MarkdownView from "./markdown-view";
import { createClient } from "@/utils/supabase/client";

export interface MarkdownData {
  id: number;
  user_id: string;
  is_completed: boolean;
  title: string;
  markdown: string;
  inserted_at: string;
}

export default function MarkdownApp({ userId }: { userId: string }) {
  const supabase = createClient();
  const [selectedMarkdown, setSelectedMarkdown] = useState<
    MarkdownData | null | undefined
  >();
  const [markdownList, setMarkdownList] = useState<MarkdownData[]>([]);

  useEffect(() => {
    async function fetchMarkdowns() {
      const { data, error } = await supabase.from("markdowns").select("*");
      if (data && !error) {
        setMarkdownList([...data]);
      }
    }

    fetchMarkdowns();
  }, [supabase]);

const updateMarkdownList = (markdown: MarkdownData, op: string) => {
    if (op === "insert") {
        setMarkdownList([markdown, ...markdownList]);
    } else if (op === "update") {
        setMarkdownList(
            markdownList.map((item) => 
                item.id === markdown.id ? markdown : item
            )
        );
    } else if (op === "delete") {
        setMarkdownList(
            markdownList.filter((item) => item.id !== markdown.id)
        );
    }
};
  const updateSelectedMarkdown = (markdown: MarkdownData | null) => {
    setSelectedMarkdown(markdown);
  };
  return (
    <div>
      <div className="flex flex-row h-[calc(100vh-7rem)] justify-between">
        <div className="w-20 sm:w-32 md:w-72 lg:w-96 overflow-y-auto">
          <MarkdownList
            updateSelectedMarkdown={updateSelectedMarkdown}
            markdownList={markdownList}
          />
        </div>
        <div className="bg-gray-100 flex-auto ">
          <MarkdownView
            userId={userId}
            selectedMarkdown={selectedMarkdown}
            updateSelectedMarkdown={updateSelectedMarkdown}
            updateMarkdownList={(markdown, op) => updateMarkdownList(markdown, op)}
          />
        </div>
      </div>
    </div>
  );
}
