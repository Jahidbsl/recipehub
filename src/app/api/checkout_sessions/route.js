import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, PLAN_PRICE_ID } from "@/lib/stripe"; // সঠিক পাথ দিন
import { getUserSession } from "@/lib/core/session";

export async function POST(req) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const formData = await req.formData();
    const planId = formData.get("plan_id"); // ফ্রন্টএন্ড থেকে আসা স্লাগ (যেমন: pro-chef-yearly)

    // ম্যাপার থেকে আসল স্ট্রাইপ প্রাইস আইডি বের করা
    const priceId = PLAN_PRICE_ID[planId];

    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid Plan or Price ID configuration" },
        { status: 400 },
      );
    }

    const user = await getUserSession();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized! Please login first." },
        { status: 401 },
      );
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      // মেটাডাটায় স্লাগটি পাঠাচ্ছি যা সাকসেস পেজ এবং ডেটাবেজে ব্যবহার হবে
      metadata: {
        userId: user.id,
        planId: planId, 
      },
      success_url: `${origin}/plans/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/pricing`,
    });

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}