"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Layers, Globe, Sparkles, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import { getRecipes } from "@/lib/api/recipes";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 15 },
  },
};

export default function FeaturesSection() {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const data = await getRecipes();

        const onlyFeatured =
          data?.filter((recipe) => recipe && recipe.isFeatured === true) || [];
        setFeaturedRecipes(onlyFeatured);
      } catch (error) {
        console.error("Error fetching featured recipes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-96 bg-zinc-100 dark:bg-zinc-800/50 rounded-3xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (featuredRecipes.length === 0) return null;

  return (
    <section className="py-24 bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <Sparkles size={12} className="animate-pulse" /> Handpicked by Admin
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
            Featured Recipes
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featuredRecipes.map((recipe) => {
            const recipeId = recipe._id?.$oid || recipe._id || recipe.id;

            return (
              <motion.div
                key={recipeId}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-950/30 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300 group cursor-pointer"
              >
                <div>
                  <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <Image
                      src={
                        recipe.image ||
                        "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=500"
                      }
                      alt={recipe.name || "Featured Recipe Image"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex gap-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                      {recipe.category && (
                        <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Layers size={10} /> {recipe.category}
                        </span>
                      )}
                      {recipe.cuisine && (
                        <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Globe size={10} /> {recipe.cuisine}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {recipe.name}
                    </h3>

                    {recipe.prepTime && (
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1 font-medium">
                        <Clock size={12} /> Prep Time: {recipe.prepTime}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2">
                  <Link
                    href={`/browse-recipes/${recipe._id?.$oid || recipe._id || recipe.id}`}
                    className="w-full bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-1 group/btn transition-colors"
                  >
                    <span>View Recipe</span>
                    <ChevronRight
                      size={14}
                      className="transform group-hover/btn:translate-x-0.5 transition-transform"
                    />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
