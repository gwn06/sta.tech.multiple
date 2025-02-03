"use client";
import { useState, useEffect, useRef } from "react";
import { deleteFoodReviewAction, } from "@/app/actions";
import { FoodReview } from "./food_review";
import FoodFormDialog from "./food-form-dialog";

interface PhotoOptionsProps {
  foodReview: FoodReview;
}

export default function FoodReviewOptions({ foodReview }: PhotoOptionsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showformDialog, setShowFormDialog] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleRenameImage = async () => {
    setShowMenu(false);
    setShowFormDialog(true);
    // const newName = prompt("Enter new name for the image", foodReview.name);
    // if (!newName) return;
    // setShowMenu(false);
    // await renameImageAction(foodReview.id, newName);
  };

  const handleDeleteImage = async () => {
    await deleteFoodReviewAction(foodReview.id, foodReview.image_path);
  };

  return (
    <div ref={menuRef}>
      <button onClick={toggleMenu}>
        <div className="flex items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer max-w-4 px-2">
          ⁞
        </div>
      </button>
      {showMenu && (
        <div className="absolute bg-white border rounded shadow-md mt-2">
          <button
            onClick={handleRenameImage}
            className="block px-4 py-2 text-left w-full hover:bg-gray-100"
          >
            Update
          </button>
          <button
            onClick={handleDeleteImage}
            className="block px-4 py-2 text-left w-full text-red-500 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}

      {showformDialog && (
        <FoodFormDialog
          userId={foodReview.user_id}
          foodReview={foodReview}
          title="Update Food Review"
          closeDialog={() => setShowFormDialog(false)}
        />
      )}
    </div>
  );
}
