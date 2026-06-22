import { RecipeDetailsClient } from "@/components/recipes/details/RecipeDetailsClient";
import { getInteractions, getRecipeById } from "@/lib/api/recipes";
import { getUserSession } from "@/lib/core/session";
import { stripe } from "@/lib/stripe";
import { notFound } from "next/navigation";

const page = async ({ params, searchParams }) => {
  const { id } = await params; 
  const resolvedSearchParams = await searchParams; 

  if (!id || id === "undefined" || id.length !== 24) {
    return notFound();
  }

  try {
    const [recipe, user] = await Promise.all([
      getRecipeById(id).catch(() => null),
      getUserSession().catch(() => null),
    ]);

    if (!recipe) return notFound();

    // স্ট্রাইপ সেশন ভেরিফিকেশন
    if (resolvedSearchParams?.session_id) {
      try {
        const session = await stripe.checkout.sessions.retrieve(resolvedSearchParams.session_id);
        
        if (session.payment_status === "paid") {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
          
          // মেটাডাটা ও সেফটি অবজেক্ট থেকে নিখুঁত ডাটা এক্সট্র্যাক্ট
          const userId = session.metadata?.userId;
          const recipeId = session.metadata?.recipeId || id;
          const amount = session.metadata?.amount ? Number(session.metadata.amount) : 4.99;
          const email = session.metadata?.email || session.customer_details?.email;

          // এক্সপ্রেস ব্যাকএন্ডের সঠিক রাউটে ডেটা পাঠানো
          await fetch(`${baseUrl}/api/purchases`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, recipeId, amount, email }),
          });
        }
      } catch (err) {
        console.error("Session verify error:", err);
      }
    }

    const interactions = user
      ? await getInteractions(id, user.id).catch(() => ({ liked: false, favorited: false, reported: false }))
      : { liked: false, favorited: false, reported: false };

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RecipeDetailsClient
          recipe={recipe}
          user={user}
          initialInteractions={interactions}
          showSuccessModal={!!resolvedSearchParams?.session_id}
        />
      </div>
    );
  } catch (error) {
    console.error("Page error:", error);
    return notFound();
  }
};

export default page;