"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { createServerAdminClient } from "@/utils/supabase/serverAdmin";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export async function deleteUserAccountAction(userId: string) {
  const supabase = await createServerAdminClient();

  // Check if the user is authorized to delete this account
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw authError;

  if (user?.id !== userId) {
    throw new Error("Unauthorized: You cannot delete this user");
  }

  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw error;
  await supabase.auth.signOut();
  return redirect("/sign-in");
}

export async function getUserBy(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}

export async function getUser(id: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function getDriveliteImage(id: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("drivelite")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}

export async function getDriveliteImages(
  query: string,
  sortBy: string,
  sort: string
) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("drivelite")
    .select("*")
    .order(sortBy, { ascending: sort === "asc" })
    .ilike("name", `%${query}%`);

  if (!data) {
    return [];
  }

  return data;
}

export async function renameImageAction(id: number, newName: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("drivelite")
    .update({ name: newName })
    .eq("id", id);
  if (error) {
    throw error;
  }

  revalidatePath("/activity-2");
}

export async function deleteImageAction(id: number, image_path: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("drivelite").delete().eq("id", id);
  if (error) {
    throw error;
  }
  await supabase.storage.from("drivelite").remove([image_path]);

  revalidatePath("/activity-2");
}

export async function getFoodReview(id: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("food_review")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) {
    return null;
  }

  return data;
}
export async function getFoodReviewBy(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("food_review")
    .select("*, food_review_reviews (*)")
    .eq("slug", slug)
    .single();

  if (!data) {
    return null;
  }

  const orderedReviews = data.food_review_reviews.sort(
    (a: { created_at: string }, b: { created_at: string }) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  );

  // Attach ordered reviews back to the data object
  data.food_review_reviews = orderedReviews;

  return data;
}

export async function getFoodReviews(sortBy: string, sort: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("food_review")
    .select("*")
    .order(sortBy, { ascending: sort === "asc" });

  if (!data) {
    return [];
  }

  return data;
}

export async function deleteFoodReviewAction(id: number, image_path: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("food_review").delete().eq("id", id);
  if (error) {
    throw error;
  }
  await supabase.storage.from("food_review").remove([image_path]);

  revalidatePath("/activity-3");
  redirect("/activity-3");
}

export async function getPokemons(searchQuery: string, sortBy: string, sort: string) {
  const supabase = await createClient();
  const pageNumber = 1;
  const limit = 18;
  const offset = (pageNumber - 1) * limit;
  let query =  supabase
    .from("pokemons")
    .select("*")
    .order(sortBy, { ascending: sort === "asc" })
    .limit(limit)
    .range(offset, offset + limit - 1);


  if (searchQuery.length > 0)  { query = query.ilike('name', `%${searchQuery}%`) }

  const {data, error} = await query;

  if (!data || error) {
    return [];
  }

  return data;
}

export async function getPokemonReviewsBy(name:string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pokemons")
    .select("*, pokemons_reviews (*)")
    .eq("name", name)
    .single();

    
  const orderedReviews = data.pokemons_reviews.sort(
    (a: { inserted_at: string }, b: { inserted_at: string }) => {
      return (
        new Date(b.inserted_at).getTime() - new Date(a.inserted_at).getTime()
      );
    });

  if (!data) {
    return null;
  }

  data.pokemons_reviews = orderedReviews;
  return data;
}