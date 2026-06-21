// app/api/recipes/[id]/purchase/route.js
export async function POST(req, { params }) {
  try {
    const { recipeName, price, userId, userEmail } = await req.json(); // ← body থেকে নাও

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized! Please login first." }, { status: 401 });
    }

    const headersList = await headers();
    const origin = headersList.get("origin");
    const { id: recipeId } = await params;

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

    return NextResponse.json({ success: true, url: session.url });
  } catch (err) {
    console.error("Stripe Route Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: err.statusCode || 500 });
  }
}