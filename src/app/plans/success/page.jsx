import { redirect } from "next/navigation";
import Link from "next/link";
import { stripe } from "@/lib/stripe"; // আপনার সঠিক পাথ অনুযায়ী অ্যাডজাস্ট করে নিন

import { CheckCircle2, Mail, ArrowRight, Home } from "lucide-react";
import { createSubscription } from "@/lib/actions/subscriptions";

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  // Stripe সেশন থেকে ডেটা রিট্রিভ করা
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });
  console.log(session,"session")
  const { status, customer_details, metadata } = session;
  const customerEmail = customer_details?.email;

  // সেশন কমপ্লিট না হলে হোমপেজে রিডাইরেক্ট
  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    const subsInfo = {
      email: customerEmail,
      userId: metadata.userId,

      planId: metadata.planId,

      stripeCustomerId: session.customer,

      stripeSubscriptionId: session.subscription,

      paymentStatus: session.payment_status,

      amountTotal: session.amount_total,

      currency: session.currency,

      createdAt: new Date(),
    };

    try {
      const result = await createSubscription(subsInfo);
      console.log("Subscription updated successfully:", result);
    } catch (error) {
      console.error("Failed to create subscription in DB:", error);
    }

    return (
      <section className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 transition-colors">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md relative overflow-hidden">
          {/* টপ গ্লো ইফেক্ট */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl rounded-full -z-10" />

          {/* সাকসেস আইকন */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 border border-emerald-100 dark:border-emerald-900/30 shadow-inner">
            <CheckCircle2
              size={32}
              className="text-emerald-500 dark:text-emerald-400"
            />
          </div>

          {/* হেডিং সেকশন */}
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              Payment Successful! 🎉
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Thank you for your purchase. Your account is upgraded!
            </p>
          </div>

          <hr className="border-zinc-100 dark:border-zinc-800" />

          {/* কন্টেন্ট মেসেজ এবং ইনফো বক্স */}
          <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 space-y-4">
            <div className="bg-zinc-50/50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-4 text-left flex items-start gap-3 shadow-sm">
              <Mail size={18} className="text-zinc-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs sm:text-sm">
                We appreciate your business! A confirmation email will be sent
                to{" "}
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 break-all">
                  {customerEmail}
                </span>
                .
              </p>
            </div>

            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              If you have any questions, please contact us at{" "}
              <Link
                href="mailto:jahidhasanbsl46@gmail.com"
                className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-4 transition-colors"
              >
                jahidhasanbsl46@gmail.com
              </Link>
            </p>
          </div>

          {/* অ্যাকশন বাটন গ্রুপ */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="inline-flex w-full sm:w-1/2 justify-center items-center gap-2 px-5 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-transparent border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              <Home size={16} />
              Back to Home
            </Link>
            <Link
              href="/dashboard/recipes"
              className="inline-flex w-full sm:w-1/2 justify-center items-center gap-1.5 px-5 py-3 text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-xl shadow-md transition-all duration-200 transform active:scale-[0.98]"
            >
              Dashboard <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    );
  }
}
