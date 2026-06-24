"use server";

import { stripe } from "@/lib/stripe";

import { headers } from "next/headers";
import { authHeader, serverMutation } from "../core/server";

export const addRecipe = async (newRecipeData) => {
  try {
    // serverMutation internally JSON parse kore response return korbe
    return await serverMutation("/api/recipes", newRecipeData);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const toggleLike = async (recipeId, userId) => {
  try {
    return await serverMutation(`/api/recipes/${recipeId}/like`, { userId });
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const toggleFavorite = async (recipeId, userId) => {
  try {
    return await serverMutation(`/api/recipes/${recipeId}/favorite`, {
      userId,
    });
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const reportRecipe = async (recipeId, userId, reason, details) => {
  try {
    return await serverMutation(`/api/recipes/${recipeId}/report`, {
      userId,
      reason,
      details,
    });
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// lib/api/recipes.js admin
export const patchRecipeFeature = async (recipeId, isFeaturedNow) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes/${recipeId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        isFeatured: isFeaturedNow,
      }),
    }
  );

  return res.json();
};

// ── FIXED DELETE FUNCTION ──
export const deleteRecipe = async (id) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes/delete/${id}`, // delate কে delete করা হয়েছে
      {
        method: "DELETE",
       
      },
    );
    return await res.json();
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return { success: false, message: "Network error" };
  }
};

// ── FIXED UPDATE FUNCTION ──
export const updateRecipe = async (id, recipeData) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes/update/${id}`, // Changed delate -> update to match backend
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(await authHeader()),
      },
      body: JSON.stringify(recipeData),
    },
  );

  return await res.json();
};
