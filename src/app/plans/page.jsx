"use client";
import React, { useState } from "react";

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly or yearly

  const plans = [
    {
      name: "Free Plan",
      price: billingCycle === "monthly" ? 0 : 0,
      description: "Perfect for beginners who want to try out our platform.",
      features: [
        "Add up to 2 recipes",
        "Basic search and filtering",
        "Community support",
        "Public recipe sharing",
      ],
      buttonText: "Current Plan",
      isCurrent: true,
      isPopular: false,
    },
    {
      name: "Pro Chef",
      price: billingCycle === "monthly" ? 9 : 79, // $9/mo or $79/yr
      description:
        "For passionate cooks who want unlimited access and power tools.",
      features: [
        "Add unlimited recipes",
        "Advanced AI Recipe Generator",
        "Meal planning & shopping lists",
        "Priority customer support",
        "No advertisements",
        "Export recipes as PDF",
      ],
      buttonText: "Upgrade to Pro",
      isCurrent: false,
      isPopular: true,
    },
    {
      name: "Restaurant Pro",
      price: billingCycle === "monthly" ? 29 : 249,
      description:
        "Designed for professional kitchens and culinary businesses.",
      features: [
        "Everything in Pro Chef plan",
        "Multi-user collaboration (up to 5 team members)",
        "Advanced analytics & view counts",
        "Embed recipes on your own website",
        "Custom branding & logos",
        "Dedicated account manager",
      ],
      buttonText: "Upgrade to Restaurant Pro",
      isCurrent: false,
      isPopular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-base font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
          Pricing Plans
        </h2>
        <h1 className="mt-2 text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl tracking-tight">
          Choose the perfect plan for your kitchen
        </h1>
        <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
          Unlock unlimited recipe uploads, AI-powered insights, and advanced
          culinary tools.
        </p>

        {/* Toggle Billing Cycle (Monthly / Yearly) */}
        <div className="mt-8 flex justify-center items-center">
          <div className="relative bg-zinc-200/60 dark:bg-zinc-900 p-1 rounded-xl flex border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              Yearly
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                Save 25%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {plans.map((plan, index) => {
          // ডাইনামিক স্লাগ তৈরি করার লজিক (যা PLAN_PRICE_ID এর কী-গুলোর সাথে মিলবে)
          let planIdSlug = "";
          if (plan.name === "Pro Chef") {
            planIdSlug = billingCycle === "monthly" ? "pro-chef-monthly" : "pro-chef-yearly";
          } else if (plan.name === "Restaurant Pro") {
            planIdSlug = billingCycle === "monthly" ? "restaurant-pro-monthly" : "restaurant-pro-yearly";
          }

          return (
            <div
              key={index}
              className={`relative rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-md border transition-all duration-300 ${
                plan.isPopular
                  ? "border-emerald-500 ring-2 ring-emerald-500/20 md:-mt-4 md:mb-[-16px] z-10 scale-105"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              {/* Popular Tag */}
              {plan.isPopular && (
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-sm">
                  Most Popular
                </span>
              )}

              {/* Plan Info */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 min-h-[40px]">
                  {plan.description}
                </p>
                <div className="mt-4 flex items-baseline text-zinc-900 dark:text-zinc-50">
                  <span className="text-4xl font-extrabold tracking-tight">
                    ${plan.price}
                  </span>
                  <span className="ml-1 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                    /{billingCycle === "monthly" ? "mo" : "yr"}
                  </span>
                </div>
              </div>

              {/* অ্যাকশন বাটন হ্যান্ডলিং (Free Plan বনাম Paid Plans Form) */}
              {plan.name !== "Free Plan" ? (
                <form
                  action="/api/checkout_sessions"
                  method="POST"
                  className="w-full"
                >
                  {/* priceId-এর বদলে এখন সুরক্ষিত স্লাগ বা প্ল্যান আইডি ব্যাকএন্ডে যাবে */}
                  <input type="hidden" name="plan_id" value={planIdSlug} />

                  <button
                    type="submit"
                    role="link"
                    disabled={plan.isCurrent}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                      plan.isCurrent
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed border border-zinc-200 dark:border-zinc-700"
                        : plan.isPopular
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/10"
                          : "bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 text-white"
                    }`}
                  >
                    {plan.isCurrent ? "Current Plan" : plan.buttonText}
                  </button>
                </form>
              ) : (
                // ফ্রি প্ল্যানের জন্য কোনো ফর্ম দরকার নেই
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed border border-zinc-200 dark:border-zinc-700"
                >
                  Current Plan
                </button>
              )}

              {/* Features List */}
              <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-400 uppercase tracking-wider mb-4">
                  What's included:
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className="flex items-start text-sm text-zinc-600 dark:text-zinc-400"
                    >
                      <span className="text-emerald-500 mr-2.5 font-bold flex-shrink-0 text-base leading-none">
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Badge Footer */}
      <div className="text-center mt-12 text-xs text-zinc-400 dark:text-zinc-500">
        Safe and secure checkout. Cancel or switch plans at any time.
      </div>
    </div>
  );
};

export default PricingPage;