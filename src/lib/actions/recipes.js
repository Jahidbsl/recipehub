"use server"

import { stripe } from "@/lib/stripe";
import { getUserSession } from "@/lib/core/session";
import { headers } from "next/headers";

const baseurl = process.env.NEXT_PUBLIC_BASE_URL

export const addRecipe = async (newRecipeData) => {
  try {
    const res = await fetch(`${baseurl}/api/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRecipeData),
    });
    
  
    if (!res.ok) {
      return { success: false, message: "Server error occurred" };
    }
    
    return res.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};



export const toggleLike = async (recipeId, userId) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes/${recipeId}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return res.json();
};

export const toggleFavorite = async (recipeId, userId) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes/${recipeId}/favorite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return res.json();
};

export const reportRecipe = async (recipeId, userId, reason, details) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes/${recipeId}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, reason, details }),
  });
  return res.json();
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorText = await res.text();
    return { success: false, error: errorText || "Server error" };
  }
  return res.json();
};




// lib/api/recipes.js
export const purchaseRecipe = async (recipeId, recipeName, price, userId, userEmail) => {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL;

    if (!userId) {
      return { success: false, error: "Unauthorized! Please login first." };
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: recipeName || "Recipe Purchase" },
          unit_amount: Math.round(Number(price || 4.99) * 100),
        },
        quantity: 1,
      }],
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