"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface SortingGroupContainerProps {
  sortByRowName: string;
}

export default function SortingGroupContainer({sortByRowName}: SortingGroupContainerProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [isAscending, setIsAscending] = useState(true);
  const [sortBy, setSortBy] = useState("name");

  const toggleSortOrder = () => {
    const toggleAscending = !isAscending
    setIsAscending(toggleAscending);

    const params = new URLSearchParams(searchParams);
    if (toggleAscending) {
      params.set("sort", "asc");
    } else {
      params.set("sort", "desc");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSortByChange = (selectedSortBy: string) => {
    setSortBy(selectedSortBy);
    const params = new URLSearchParams(searchParams);
    if (selectedSortBy === "name") {
      params.set("sortBy", "name");
    } else {
      params.set("sortBy", sortByRowName);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="">
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleSortOrder}
          className="px-2  text-2xl text-black rounded hover:bg-gray-100"
        >
          {isAscending ? "↑" : "\u2193"}
        </button>
        <select
          value={sortBy}
          onChange={(e) => handleSortByChange(e.target.value)}
          className="px-2 py-2 border rounded"
        >
          <option value="name">By Name</option>
          <option value="date">By Date</option>
        </select>
      </div>
    </div>
  );
};

