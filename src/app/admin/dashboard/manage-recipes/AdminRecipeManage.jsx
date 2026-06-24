"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Star, ChefHat, Eye, Search, ChevronLeft, ChevronRight, Trash2, Loader2, Utensils } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

import { getRecipes, patchRecipeFeature, deleteRecipe } from "@/lib/api/recipes";

export default function AdminRecipeManage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // 📝 সার্চ, ফিল্টার এবং পেজিনেশন স্টেট
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // দেখতে সুন্দর লাগার জন্য প্রতি পেজে ৬টি করে রাখা হয়েছে

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        setLoading(true);
        const data = await getRecipes();
        setRecipes(data || []);
      } catch (error) {
        toast.error("Error loading recipes!");
      } finally {
        setLoading(false);
      }
    };
    fetchAllRecipes();
  }, []);

  // ⚡ ফিচার টগল লজিক (Instant UI Update)
  const handleToggleFeature = async (recipe, recipeId) => {
    const stringId = typeof recipeId === "object" ? recipeId?.$oid : recipeId;
    if (!stringId) return toast.error("Invalid Recipe ID");

    const currentStatus = recipe.isFeatured || false;
    const newStatus = !currentStatus;

    // ১. ব্যাকআপ রাখা (যদি এপিআই ফেইল করে)
    const previousRecipes = [...recipes];

    // ২. ইনস্ট্যান্ট UI আপডেট (Optimistic Update)
    setRecipes((prev) =>
      prev.map((r) => {
        const id = r._id?.$oid || r._id || r.id;
        return id === stringId ? { ...r, isFeatured: newStatus } : r;
      })
    );

    if (newStatus) toast.success("Added to Homepage Features!");
    else toast.info("Removed from Homepage Features.");

    try {
      // ৩. ব্যাকএন্ডে পাঠানো
      await patchRecipeFeature(stringId, newStatus);
    } catch (error) {
      // ফেইল করলে আগের অবস্থায় ফেরত নেওয়া
      setRecipes(previousRecipes);
      console.error("PATCH Request Failed:", error);
      toast.error("Failed to update status on server.");
    }
  };

  // 🗑️ ডিলিট লজিক (Instant UI Update)
  const handleDeleteRecipe = async (recipeId) => {
    const stringId = typeof recipeId === "object" ? recipeId?.$oid : recipeId;
    if (!stringId) return toast.error("Invalid Recipe ID");

    const confirmDelete = window.confirm("Are you sure you want to permanently delete this recipe?");
    if (!confirmDelete) return;

    // ১. ব্যাকআপ রাখা
    const previousRecipes = [...recipes];

    // ২. ইনস্ট্যান্ট স্ক্রিন থেকে হাওয়া করে দেওয়া (Optimistic Delete)
    setRecipes((prev) =>
      prev.filter((r) => {
        const id = r._id?.$oid || r._id || r.id;
        return id !== stringId;
      })
    );
    toast.success("Recipe deleted successfully!");

    try {
      // ৩. ব্যাকএন্ডে ডিলিট রিকোয়েস্ট
      await deleteRecipe(stringId);
    } catch (error) {
      // ফেইল করলে রেসিপি ফিরিয়ে আনা
      setRecipes(previousRecipes);
      console.error("DELETE Request Failed:", error);
      toast.error("Could not delete from server. Restored recipe.");
    }
  };

  // 🔍 ১. ইউনিক ক্যাটাগরি ফিল্টার
  const categories = ["All", ...new Set(recipes.map((r) => r.category).filter(Boolean))];

  // 🎛️ ২. সার্চ + ক্যাটাগরি ফিল্টারিং
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 📄 ৩. পেজিনেশন
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRecipes.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 p-4 sm:p-8 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* 👑 প্রফেশনাল হেডার কার্ড */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 dark:from-emerald-900 dark:to-zinc-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
              <ChefHat className="h-8 w-8 animate-bounce" /> Admin Control Center
            </h1>
            <p className="text-emerald-100/80 text-sm font-medium">
              Manage, Feature, or Delete recipes seamlessly.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold">
            Total Recipes: {recipes.length}
          </div>
        </div>

        {/* 🛠️ রেসপন্সিভ ফিল্টার ও সার্চ বার */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-zinc-900 p-4 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-sm">
          {/* সার্চ */}
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by recipe name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
            />
          </div>

          {/* ড্রপডাউন */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none dark:text-white"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="dark:bg-zinc-900">
                  {category}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-3.5 pointer-events-none w-2 h-2 border-r-2 border-b-2 border-zinc-400 transform rotate-45"></div>
          </div>
        </div>

        {/* 📊 রেসপন্সিভ টেবিল ও মোবাইল ভিউ কার্ড */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          
          {/* 💻 ডেস্কটপ টেবিল ভিউ (Hidden on Mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Recipe Info</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right pr-6">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="p-12 text-center text-zinc-400">
                      <Loader2 className="h-7 w-7 animate-spin mx-auto mb-2 text-emerald-500" />
                      Fetching delicious data...
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-12 text-center text-zinc-400 font-medium">
                      <Utensils className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      No matching recipes found!
                    </td>
                  </tr>
                ) : (
                  currentItems.map((recipe) => {
                    const recipeId = recipe._id?.$oid || recipe._id || recipe.id;
                    const isFeatured = recipe.isFeatured || false;

                    return (
                      <tr key={recipeId} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="p-4 pl-6 font-semibold">
                          <div className="flex items-center gap-4">
                            <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200/60 dark:border-zinc-700/50 shadow-sm">
                              <Image
                                src={recipe.image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=100"}
                                alt={recipe.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="line-clamp-1 text-zinc-800 dark:text-zinc-200">{recipe.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                            {recipe.category || "General"}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6">
                          <div className="flex items-center justify-end gap-2.5">
                            {/* ফিচার */}
                            <button
                              onClick={() => handleToggleFeature(recipe, recipeId)}
                              className={`p-2 rounded-xl border transition-all ${
                                isFeatured
                                  ? "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-sm scale-105"
                                  : "bg-zinc-50 border-zinc-200 text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700"
                              }`}
                              title={isFeatured ? "Featured" : "Mark as Featured"}
                            >
                              <Star size={16} className={isFeatured ? "fill-current" : ""} />
                            </button>

                            {/* ভিউ */}
                            <Link
                              href={`/browse-recipes/${recipe._id || recipe.id}`}
                              target="_blank"
                              className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                            >
                              <Eye size={16} />
                            </Link>

                            {/* ডিলিট */}
                            <button
                              onClick={() => handleDeleteRecipe(recipeId)}
                              className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                              title="Delete Recipe"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* 📱 মোবাইল রেসপন্সিভ কার্ড ভিউ (Visible only on Mobile) */}
          <div className="block md:hidden p-4 space-y-4">
            {loading ? (
              <div className="p-8 text-center text-zinc-400">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-500" />
                Loading recipes...
              </div>
            ) : currentItems.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 text-sm">No recipes found!</div>
            ) : (
              currentItems.map((recipe) => {
                const recipeId = recipe._id?.$oid || recipe._id || recipe.id;
                const isFeatured = recipe.isFeatured || false;

                return (
                  <div key={recipeId} className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl border dark:border-zinc-700">
                        <Image
                          src={recipe.image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=100"}
                          alt={recipe.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{recipe.name}</h3>
                        <span className="inline-block mt-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          {recipe.category || "General"}
                        </span>
                      </div>
                    </div>
                    {/* মোবাইল অ্যাকশন বাটনস */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-200/50 dark:border-zinc-800">
                      <button
                        onClick={() => handleToggleFeature(recipe, recipeId)}
                        className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl border ${
                          isFeatured
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-600"
                            : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500"
                        }`}
                      >
                        <Star size={14} className={isFeatured ? "fill-current" : ""} /> Feature
                      </button>
                      <Link
                        href={`/browse-recipes/${recipe._id || recipe.id}`}
                        target="_blank"
                        className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
                      >
                        <Eye size={14} /> View
                      </Link>
                      <button
                        onClick={() => handleDeleteRecipe(recipeId)}
                        className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl bg-red-500/10 border border-red-500/20 text-red-500"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 🏁 আধুনিক পেজিনেশন ফুটার */}
          {!loading && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 border-t border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/20">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Showing <span className="font-bold text-zinc-700 dark:text-zinc-300">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-bold text-zinc-700 dark:text-zinc-300">{Math.min(indexOfLastItem, filteredRecipes.length)}</span> of{" "}
                <span className="font-bold text-zinc-700 dark:text-zinc-300">{filteredRecipes.length}</span> recipes
              </span>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-sm transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 px-3 py-1.5 border dark:border-zinc-700 rounded-xl shadow-sm">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-sm transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}