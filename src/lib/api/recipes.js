import { authHeader, protectedFetch, serverFetch } from "../core/server";

export const getRecipeByUser = async (userId) => {
  return serverFetch(`/api/recipes?userId=${userId}`);
};

export const getRecipes = async ({ category, cuisine } = {}) => {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (cuisine) params.append("cuisine", cuisine);

  const query = params.toString();
  return serverFetch(`/api/recipes${query ? `?${query}` : ""}`);
};

export const getRecipeById = async (id) => {
  return serverFetch(`/api/browse-recipes/${id}`);
};

export const getInteractions = async (recipeId, userId) => {
  return protectedFetch(
    `/api/browse-recipes/${recipeId}/interactions?userId=${userId}`,
  );
};

export const getUserFavorites = async (userId) => {
  const data = await protectedFetch(`/api/users/${userId}/favorites`);
  return data || [];
};

export const getUserPurchases = async (userId) => {
  const data = await protectedFetch(`/api/users/${userId}/purchases`);
  return data || [];
};



// Admin Panel Transactions Fetch Action
export const getAdminTransactions = async () => {
  try {
    // Apnar protectedFetch automatically baseurl, endpoint config and verification authHeader bind kore nibe
    const data = await protectedFetch("/api/admin/transactions");
    return data; 
  } catch (error) {
    console.error("Action Fetch Error:", error);
    return { success: false, message: "Failed to execute server action load." };
  }
};
// admin for manage

export const patchRecipeFeature = async (recipeId, isFeaturedNow) => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // নোটিফিকেশন বা সিকিউরিটি টোকেন যুক্ত করতে authHeader ব্যবহার করুন
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (typeof authHeader === "function") {
    Object.assign(headers, await authHeader());
  }

  const res = await fetch(`${BACKEND_URL}/api/recipes/${recipeId}`, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify({ isFeatured: isFeaturedNow }),
  });

  if (!res.ok) {
    throw new Error("Failed to update on backend");
  }

  return res.json();
};
