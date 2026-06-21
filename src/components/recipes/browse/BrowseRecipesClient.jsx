// components/recipes/browse/BrowseRecipesClient.jsx
"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { BrowseRecipeCard } from "./BrowseRecipeCard";

const CATEGORIES = ["Baking", "Snack", "Dinner", "Breakfast", "Lunch", "Dessert", "Drink"];
const CUISINES   = ["Italian", "Mexican", "Chinese", "Indian", "American", "Thai", "French"];

export function BrowseRecipesClient({ recipes }) {
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("");
  const [cuisine, setCuisine]   = useState("");

  const filtered = recipes?.filter((r) => {
    const matchSearch   = !search   || r.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !category || r.category === category;
    const matchCuisine  = !cuisine  || r.cuisine === cuisine;
    return matchSearch && matchCategory && matchCuisine;
  });

  const hasFilter = search || category || cuisine;

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <SlidersHorizontal size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 appearance-none"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="relative flex-1">
            <SlidersHorizontal size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 appearance-none"
            >
              <option value="">All Cuisines</option>
              {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {hasFilter && (
            <button
              onClick={() => { setSearch(""); setCategory(""); setCuisine(""); }}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X size={13} /> Clear
            </button>
          )}
        </div>

        {/* Result count */}
        <p className="text-xs text-zinc-400 pl-0.5">
          Showing <span className="font-semibold text-zinc-600 dark:text-zinc-300">{filtered.length}</span> of {recipes?.length} recipes
        </p>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-400 text-sm">No recipes found</div>
      ) : (
       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <BrowseRecipeCard key={r._id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}