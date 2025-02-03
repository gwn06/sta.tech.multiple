"use client";
import { useState } from "react";
import FoodFormDialog from "./food-form-dialog";

export default function NewFoodButton({ userId }: { userId: string }) {
  const [showformDialog, setShowFormDialog] = useState(false);

  return (
    <div className="p-2">
      <button
        onClick={() => setShowFormDialog(true)}
        className={`cursor-pointer p-2 text-white drop-shadow-lg border bg-green-500 rounded-md shadow-sm hover:bg-green-600 ease-in-out transition`}
      >
        New Food
      </button>
      {showformDialog && (
        <FoodFormDialog
          userId={userId}
          title="New Food Review"
          closeDialog={() => setShowFormDialog(false)}
        />
      )}
    </div>
  );
}
