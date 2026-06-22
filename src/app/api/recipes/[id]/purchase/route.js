import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

export const purchaseRecipe = async (recipeId, recipeName, price, userId, userEmail) => {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL;

    if (!userId) {
      return { success: false, error: "Unauthorized! Please login first." };
    }

    const cleanPrice = Number(price || 4.99);

    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: recipeName || "Recipe Purchase" },
          unit_amount: Math.round(cleanPrice * 100), // সেন্টস কনভার্সন
        },
        quantity: 1,
      }],
      mode: "payment",
      // ডাটাবেজের সুবিধার জন্য মেটাডাটায় সবগুলো ডেটা স্ট্রিং আকারে পুশ করা হলো
      metadata: {
        userId: String(userId),
        recipeId: String(recipeId),
        amount: String(cleanPrice),
        email: String(userEmail),
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