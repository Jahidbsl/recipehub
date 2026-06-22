"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  ChefHat,
  Bookmark,
  ArrowUpRight,
  Award,
  Sparkles,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { getRecipeByUser, getUserFavorites } from "@/lib/api/recipes";

// ─── Small helper ─────────────────────────────────────────────────
function StatusBadge({ status }) {
  const base = "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium";
  const variants = {
    Published: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
    Draft:     "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
  };
  return <span className={`${base} ${variants[status] ?? variants.Draft}`}>{status}</span>;
}

// ─── Main Component ───────────────────────────────────────────────
// `user` is passed from the Server Component (page.jsx)
const UserDashboardPage = ({ user }) => {
  const [recipes,   setRecipes]   = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const load = async () => {
      try {
        setLoading(true);
        const [userRecipes, userFavorites] = await Promise.all([
          getRecipeByUser(user.id),
          getUserFavorites(user.id),
        ]);
        setRecipes(userRecipes   ?? []);
        setFavorites(userFavorites ?? []);
      } catch (err) {
        console.error(err);
        setError(err.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.id]);

  // ── Derived stats ────────────────────────────────────────────────
  const totalRecipes   = recipes.length;
  const totalLikes     = recipes.reduce((sum, r) => sum + (r.likes ?? r.likeCount ?? 0), 0);
  const savedFavorites = favorites.length;

  // ── Recent 3 recipes ─────────────────────────────────────────────
  const recentRecipes = [...recipes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // ── Level progress (10 recipes = 100%) ───────────────────────────
  const levelProgress = Math.min(Math.round((totalRecipes / 10) * 100), 100);
  const levelLabel    =
    levelProgress >= 80 ? "Master Chef" :
    levelProgress >= 50 ? "Seasoned Cook" : "Home Cook";

  const displayName = user?.name ?? user?.email ?? "Chef";

  // ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-zinc-400">
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
        <p className="text-sm font-medium text-red-500">Failed to load dashboard</p>
        <p className="text-xs text-zinc-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-zinc-900 dark:text-zinc-50">

      {/* ── Welcome Banner ──────────────────────────────────────── */}
      <div className="relative bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-500/20 rounded-2xl p-5 sm:p-7 overflow-hidden">
        <div className="absolute right-0 top-0 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <Sparkles size={11} /> Welcome back, {displayName}!
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight">
            Your Culinary Command Center
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Manage your recipes, track insights, and see how the community responds to your cooking.
          </p>
        </div>
      </div>

      {/* ── Stats Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Recipes",   value: totalRecipes,   icon: ChefHat,  color: "orange" },
          { label: "Likes",     value: totalLikes,     icon: Heart,    color: "rose"   },
          { label: "Favorites", value: savedFavorites, icon: Bookmark, color: "blue"   },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 rounded-xl flex items-center justify-between shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
          >
            <div className="space-y-0.5 min-w-0">
              <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider truncate block">{label}</span>
              <p className="text-2xl sm:text-3xl font-bold leading-none">{value}</p>
            </div>
            <div className={`shrink-0 p-2.5 rounded-xl bg-${color}-50 dark:bg-${color}-950/30 text-${color}-500`}>
              <Icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Recipes Table */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold">Recent Recipes</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Your latest kitchen creations</p>
            </div>
            <Link
              href="/dashboard/my-recipes"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline shrink-0"
            >
              View all <ArrowUpRight size={13} />
            </Link>
          </div>

          {recentRecipes.length === 0 ? (
            <div className="py-10 text-center text-zinc-400 text-xs">
              No recipes yet.{" "}
              <Link href="/dashboard/add-recipe" className="text-emerald-500 underline">
                Add your first recipe →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-zinc-100 dark:border-zinc-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/40 text-zinc-400 uppercase tracking-wider font-medium border-b border-zinc-100 dark:border-zinc-800">
                    <th className="p-3">Name</th>
                    <th className="p-3 hidden sm:table-cell">Category</th>
                    
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {recentRecipes.map((recipe) => (
                    <tr
                      key={recipe._id ?? recipe.id}
                      className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/20 transition-colors"
                    >
                      <td className="p-3 font-semibold text-zinc-800 dark:text-zinc-200 max-w-[140px] truncate">
                        {recipe.title ?? recipe.name}
                      </td>
                      <td className="p-3 text-zinc-500 hidden sm:table-cell">
                        {recipe.category ?? "—"}
                      </td>
                     
                      <td className="p-3">
                        <StatusBadge status={recipe.status ?? "Published"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-5">

          {/* Level Badge */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 text-center space-y-3 shadow-sm">
            <div className="mx-auto w-11 h-11 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-amber-500">
              <Award size={22} />
            </div>
            <div>
              <h3 className="font-bold text-sm">{levelLabel}</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {levelProgress >= 80
                  ? "You're in the top creators this month!"
                  : `${10 - totalRecipes} more recipes to level up`}
              </p>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-right text-zinc-400">{levelProgress}% to next badge</p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3 shadow-sm">
            <h3 className="font-bold text-sm">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/dashboard/recipes/add"
                className="flex flex-col items-center gap-2 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 hover:bg-emerald-500/5 hover:border-emerald-500/20 text-center transition-all group"
              >
                <ChefHat size={17} className="text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                <span className="text-xs font-medium">Add Recipe</span>
              </Link>
              <Link
                href="/dashboard/my-favorites"
                className="flex flex-col items-center gap-2 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 hover:bg-rose-500/5 hover:border-rose-500/20 text-center transition-all group"
              >
                <Heart size={17} className="text-zinc-400 group-hover:text-rose-500 transition-colors" />
                <span className="text-xs font-medium">Favorites</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;