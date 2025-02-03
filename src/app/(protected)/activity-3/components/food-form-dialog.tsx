"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FoodReview } from "./food_review";

interface FoodFormDialogProps {
  closeDialog: () => void;
  userId: string;
  title: string;
  foodReview?: FoodReview;
}

export default function FoodFormDialog({
  closeDialog,
  userId,
  title,
  foodReview,
}: FoodFormDialogProps) {
  const supabase = createClient();
  const router = useRouter();
  const [name, setName] = useState(foodReview?.name ?? "");
  const [slug, setSlug] = useState(foodReview?.slug ?? "");
  const [description, setDescription] = useState(foodReview?.description ?? "");
  const [price, setPrice] = useState(foodReview?.price ?? "0");

  const [uploading, setUploading] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.currentTarget;
      const submitButton = form.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;
      submitButton.click();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setSlug(generateSlug(newName));
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const uploadImage = async ({
    name,
    slug,
    price,
    image,
    description,
  }: {
    name: string;
    slug: string;
    price: number;
    image: File;
    description: string;
  }) => {
    if (image.size > 0) {
      try {
        const { data, error } = await supabase.storage
          .from("food_review")
          .upload(`${userId}/${image.name}`, image);
        if (error) {
          console.error(error);
          throw error;
        } else {
          const { data: publicUrl } = supabase.storage
            .from("food_review")
            .getPublicUrl(data.path);

          const foodReviewToUpload = {
            user_id: userId,
            name: name,
            slug: slug,
            price: price,
            description: description,
            image_url: publicUrl.publicUrl,
            image_path: data.path,
          };

          if (foodReview !== null && foodReview !== undefined) {
            Object.assign({id: foodReview.id}, foodReviewToUpload)
          }

          await supabase.from("food_review").upsert([foodReviewToUpload]);
        }
      } catch (error) {
        console.error(error);
      }

      router.replace(`/activity-3`);
      router.refresh();
    } else {
      const { data } = await supabase
        .from("food_review")
        .update({
          name: name,
          slug: slug,
          price: price,
          description: description,
        })
        .eq("id", foodReview!.id)
        .select();

      if (!data) return;
      router.replace(`/activity-3`);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const image = formData.get("image") as File;

    const toUpdate = { name, slug, price, description, image };
    setUploading(true);
    await uploadImage(toUpdate);
    setUploading(false);
    closeDialog();
  };

  return (
    <div className="fixed inset-0 rounded-lg flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <p className="font-bold text-2xl pb-4">{title}</p>
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col gap-2"
          onKeyDown={handleKeyDown}
        >
          <label className="flex flex-col text-left text-sm">
            <span>
              Name <span className="text-red-500">*</span>
            </span>
            <input
              name="name"
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded"
              value={name}
              onChange={handleNameChange}
              required
            />
          </label>
          <label className="flex flex-col text-left text-sm">
            <span>Slug</span>
            <input
              name="slug"
              type="text"
              placeholder=""
              className="w-full p-2 border rounded bg-gray-100"
              value={slug}
              disabled
            />
          </label>
          <label className="flex flex-col text-left text-sm">
            <span>Description</span>
            <input
              name="description"
              type="text"
              placeholder="Description"
              className="w-full p-2 border rounded"
              value={description}
              onChange={handleDescriptionChange}
            />
          </label>
          <label className="flex flex-col text-left text-sm">
            <span>
              Price <span className="text-red-500">*</span>
            </span>
            <input
              name="price"
              type="number"
              min={0}
              max={1000000}
              placeholder="Price"
              className="w-full p-2 border rounded"
              value={price}
              onChange={handlePriceChange}
              required
              onKeyDown={(e) => {
                if (
                  !/[0-9.]/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Tab"
                ) {
                  e.preventDefault();
                }
              }}
            />
          </label>
          <label className="flex flex-col text-left text-sm">
            <span>
              Image{" "}
              <span hidden={foodReview !== null} className="text-red-500">
                *
              </span>
            </span>
            <input
              name="image"
              type="file"
              placeholder="Image"
              className="w-full p-2 border rounded"
              required={foodReview == null}
            />
          </label>
          <div className="flex justify-between">
            <button
              disabled={uploading}
              onClick={closeDialog}
              className="mt-4 bg-gray-500 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>

            <button
              disabled={uploading}
              type="submit"
              className={`mt-4 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded ${
                uploading ? "cursor-not-allowed" : ""
              }`}
            >
              {uploading ? "Adding..." : `${title}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
