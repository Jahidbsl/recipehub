import React from "react";
import AddRecipePage from "./AddRecipePage";
import { getUserSession } from "@/lib/core/session";
import { getRecipeByUser } from "@/lib/api/recipes";
import { LockKeyhole, TriangleAlert, Sparkles } from "lucide-react";
import Link from "next/link";
import { getPlanById } from "@/lib/api/plans";

const page = async () => {
  const user = await getUserSession();
  const recipes = await getRecipeByUser(user.id);
  const plan = await getPlanById(user.plan || "free");

  const recipeCount = recipes?.length || 0;
  const isLimitReached = recipeCount >= plan.maxAddPerUser;
  const progressPercentage = Math.min(
    (recipeCount / plan.maxAddPerUser) * 100,
    100,
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4 md:p-6 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm ring-1 ring-black/[0.03] dark:ring-white/[0.02]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              Recipe Dashboard
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Manage and expand your personal cookbook
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 self-start sm:self-center uppercase tracking-wider shadow-sm">
            <Sparkles
              size={12}
              className="text-amber-600 dark:text-amber-400"
            />
            {plan.name} Plan
          </span>
        </div>

        <div className="space-y-3 bg-zinc-50/50 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-zinc-600 dark:text-zinc-400">
              Recipes Added
            </span>
            <span
              className={
                isLimitReached
                  ? "text-rose-500 font-bold"
                  : "text-zinc-900 dark:text-zinc-100"
              }
            >
              {recipeCount}{" "}
              <span className="text-zinc-400 font-normal">
                / {plan.maxAddPerUser}
              </span>
            </span>
          </div>

          <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ease-out rounded-full ${
                isLimitReached
                  ? "bg-gradient-to-r from-rose-500 to-red-600"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600"
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {isLimitReached ? (
            <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-lg p-2.5 mt-1">
              <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2 font-medium">
                <TriangleAlert size={15} className="flex-shrink-0" />
                <span>
                  You've reached your plan's limit. Upgrade to unlock unlimited
                  baking!
                </span>
              </p>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-1 pl-0.5">
              You can add{" "}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {plan.maxAddPerUser - recipeCount}
              </span>{" "}
              more recipe(s) on this plan.
            </p>
          )}
        </div>
      </div>

      {/* (Fixed Height with Custom Scrollbar) */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="max-h-[550px] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {!isLimitReached ? (
            <div className="animate-fade-in-up">
              <AddRecipePage user={user} />
            </div>
          ) : (
            <div className="text-center py-12 px-4 flex flex-col items-center justify-center min-h-[350px]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500 border border-zinc-100 dark:border-zinc-800 shadow-sm mb-4">
                <LockKeyhole size={24} />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                Form Locked
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Upgrade your current plan to unlock the recipe creator and
                continue your culinary journey!
              </p>
              <Link href="/plans" className="mt-6 w-full sm:w-auto">
                <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all duration-200 transform hover:scale-[1.02]">
                  Upgrade Plan
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
