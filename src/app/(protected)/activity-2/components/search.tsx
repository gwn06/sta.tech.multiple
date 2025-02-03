"use client";
import React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const Search: React.FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleInputChange = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="flex flex-col items-center ">
      <input
        type="text"
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Search..."
        className="bg-slate-100 border shadow-md border-gray-300 rounded-full px-8  p-2 mb-4 w-full max-w-lg focus:bg-white focus:outline-none"
        defaultValue={searchParams.get("query")?.toString()}
      />
    </div>
  );
};

export default Search;
