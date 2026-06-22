"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Clock, ArrowRight, ChefHat } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getUserPurchases } from "@/lib/api/recipes";

const MyPurchases = ({ user }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const data = await getUserPurchases(user.id);
        setRecipes(data);
      } catch (err) {
        console.error("Error fetching purchases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user?.id]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <ShoppingBag size={20} className="text-zinc-900 dark:text-zinc-50" />
          Purchased Recipes
        </h1>
        <p className="text-xs text-zinc-400 mt-1">Premium recipes you have unlocked</p>
      </div>

    {loading ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
   {Array.from({ length: 6 }).map((_, n) => (
  <div key={n} className="h-72 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
))}
  </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <ChefHat className="mx-auto text-zinc-300 dark:text-zinc-700 mb-3" size={40} />
          <h3 className="text-base font-bold text-zinc-700 dark:text-zinc-300">No premium purchases</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            You haven't unlocked or purchased any premium recipes yet.
          </p>
          <Link href="/browse-recipes">
            <button className="mt-4 text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
              Explore Premium Recipes
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div 
              key={recipe._id || recipe.id} 
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full"
            >
              <div className="relative w-full h-44 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                {recipe.image ? (
                  <Image
                    src={recipe.image}
                    alt={recipe.name}
                    fill
                    sizes="(max-w-768px) 100vw, 300px"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <ChefHat size={32} />
                  </div>
                )}
                {/* প্রিমিয়াম আনলকড ব্যাজ */}
                <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                  Unlocked
                </span>
              </div>

              <div className="p-4 flex flex-col flex-grow space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  {recipe.category || "Premium"}
                </span>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base line-clamp-1">
                  {recipe.name}
                </h3>
                
                <div className="flex items-center gap-3 text-xs text-zinc-500 pt-1">
                  {recipe.prepTime && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {recipe.prepTime}
                    </span>
                  )}
                  {recipe.difficulty && (
                    <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-medium">
                      {recipe.difficulty}
                    </span>
                  )}
                </div>

                <div className="pt-4 mt-auto">
                  <Link href={`/browse-recipes/${recipe._id || recipe.id}`}>
                    <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                      View Recipe <ArrowRight size={12} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPurchases;