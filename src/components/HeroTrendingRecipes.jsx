"use client";
import { useEffect, useState } from "react";
import { Card, Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getRecipes } from "@/lib/api/recipes";

export default function HeroTrendingRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecipes()
      .then((data) => {
        const recipeList = Array.isArray(data) ? data : [];

        const sorted = recipeList.sort((a, b) => {
          const likesA = Number(a?.likesCount || a?.likes || a?.likeCount || 0);
          const likesB = Number(b?.likesCount || b?.likes || b?.likeCount || 0);
          return likesB - likesA;
        });

        setRecipes(sorted.slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full py-12 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (recipes.length === 0) return null;

  return (
    <section className="w-full py-12 px-4 max-w-7xl mx-auto space-y-8 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400"
          >
            Community Favorites
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl font-black text-neutral-900 dark:text-white mt-1"
          >
            Trending Upward
          </motion.h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {recipes.map((recipe, index) => {
            // 🎯 ডিসপ্লে করার জন্য লাইক কাউন্ট বের করা
            const currentLikes =
              recipe.likesCount || recipe.likes || recipe.likeCount || 0;

            return (
              <motion.div
                key={recipe._id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Card className="h-full flex flex-col justify-between border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow overflow-hidden rounded-2xl">
                  <div>
                    <div className="relative w-full h-48 bg-neutral-100 dark:bg-zinc-800 overflow-hidden">
                      {recipe.image || recipe.thumbnail ? (
                        <Image
                          src={recipe.image || recipe.thumbnail}
                          alt={recipe.name || "Recipe Thumbnail Image"} // 🎯 এখানে recipe.name দেওয়া হয়েছে
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transform hover:scale-105 transition-transform duration-500"
                          priority={index < 3}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <BookOpen size={40} />
                        </div>
                      )}

                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md dark:bg-zinc-900/90 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm z-10">
                        <Heart
                          size={14}
                          className="text-rose-500 fill-rose-500"
                        />
                        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                          {currentLikes}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {recipe.category && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-neutral-600 dark:text-neutral-400">
                            {recipe.category}
                          </span>
                        )}
                        {recipe.cuisine && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400">
                            {recipe.cuisine}
                          </span>
                        )}
                      </div>

                    
                      <h3 className="font-bold text-lg text-neutral-900 dark:text-white line-clamp-1">
                        {recipe.name || recipe.title}
                      </h3>

                      {recipe.description && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                          {recipe.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2">
                    <Link
                      href={`/browse-recipes/${recipe._id?.$oid || recipe._id || recipe.id}`}
                      className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold text-xs py-3.5 rounded-xl flex items-center justify-center gap-1 group transition-colors"
                    >
                      <span>View Recipe</span>
                      <ChevronRight
                        size={14}
                        className="transform group-hover:translate-x-0.5 transition-transform"
                      />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}