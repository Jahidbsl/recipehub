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

// lib/api/recipes.js
export const purchaseRecipe = async (
  recipeId,
  recipeName,
  price,
  userId,
  userEmail,
) => {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL;

    if (!userId) {
      return { success: false, error: "Unauthorized! Please login first." };
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: recipeName || "Recipe Purchase" },
            unit_amount: Math.round(Number(price || 4.99) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        userId: String(userId),
        recipeId: String(recipeId),
      },
      success_url: `${origin}/browse-recipes/${recipeId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/browse-recipes/${recipeId}`,
    });

    return { success: true, url: session.url };
  } catch (err) {
    console.error("Stripe Error:", err);
    return { success: false, error: err.message };
  }
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
