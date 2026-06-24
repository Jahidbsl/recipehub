
"use client";

import React, { useEffect, useState } from "react";
import { Star, ChefHat, Eye, Search, ChevronLeft, ChevronRight ,Trash2} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

import { getRecipes, patchRecipeFeature,deleteRecipe } from "@/lib/api/recipes";

export default function AdminRecipeManage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📝 সার্চ, ফিল্টার এবং পেজিনেশন স্টেট
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // প্রতি পেজে কয়টি রেসিপি দেখাতে চান (আপনার ইচ্ছেমতো পরিবর্তন করতে পারেন)

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

  const handleDeleteRecipe = async (recipeId) => {
    const stringId = typeof recipeId === "object" ? recipeId?.$oid : recipeId;
    if (!stringId) {
      toast.error("Invalid Recipe ID");
      return;
    }

    // অ্যাডমিনের কাছ থেকে ডিলিট করার আগে কনফার্মেশন নেওয়া
    const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirmDelete) return;

    try {
      // ১. ব্যাকএন্ড থেকে ডিলিট করা
      await deleteRecipe(stringId);

      // ২. UI স্টেট থেকে ডিলিট হওয়া রেসিপিটি বাদ দেওয়া
      setRecipes((prevRecipes) =>
        prevRecipes.filter((r) => {
          const currentId = r._id?.$oid || r._id || r.id;
          return currentId !== stringId;
        })
      );

      toast.success("Recipe deleted successfully!");
    } catch (error) {
      console.error("DELETE Request Failed:", error);
      toast.error("Failed to delete recipe from server.");
    }
  };
const handleToggleFeature = async (recipe, recipeId) => {
    // MongoDB $oid অথবা নরমাল আইডি হ্যান্ডেল করা
    const stringId = typeof recipeId === "object" ? recipeId?.$oid : recipeId;
    if (!stringId) {
      toast.error("Invalid Recipe ID");
      return;
    }

    const currentStatus = recipe.isFeatured || false;
    const newStatus = !currentStatus;

    try {
      // ১. সার্ভারে রিকোয়েস্ট পাঠানো
      await patchRecipeFeature(stringId, newStatus);

      // ২. UI স্টেট আপডেট করা
      setRecipes((prevRecipes) =>
        prevRecipes.map((r) => {
          const currentId = r._id?.$oid || r._id || r.id;
          // এখানে stringId এর সাথে তুলনা করতে হবে
          return currentId === stringId ? { ...r, isFeatured: newStatus } : r;
        })
      );

      if (newStatus) {
        toast.success("Added to Homepage Features!");
      } else {
        toast.info("Removed from Homepage Features.");
      }
    } catch (error) {
      console.error("PATCH Request Failed:", error);
      toast.error("Failed to update status on server.");
    }
  };

  // 🔍 ১. ইউনিক ক্যাটাগরিগুলো বের করা (ফিল্টার ড্রপডাউনের জন্য)
  const categories = ["All", ...new Set(recipes.map((r) => r.category).filter(Boolean))];

  // 🎛️ ২. ডেটা ফিল্টারিং লজিক (সার্চ + ক্যাটাগরি)
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 📄 ৩. পেজিনেশন লজিক
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRecipes.slice(indexOfFirstItem, indexOfLastItem);

  // সার্চ বা ফিল্টার চেঞ্জ হলে পেজ ১ নম্বরে রিসেট করার জন্য
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* হেডার সেকশন */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h1 className="text-2xl font-black flex items-center gap-2">
            <ChefHat /> Admin Control Center
          </h1>
        </div>

        {/* 🛠️ ফিল্টার এবং সার্চ কন্ট্রোল এরিয়া */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          {/* সার্চ ইনপুট */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* ক্যাটাগরি ড্রপডাউন */}
          <div className="w-full sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 📊 টেবিল কন্টেইনার */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50 dark:bg-zinc-800/30 border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs font-semibold uppercase">
                <th className="p-4">Recipe Name</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-zinc-400 animate-pulse">
                    Loading recipes...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-zinc-400">
                    No recipes found!
                  </td>
                </tr>
              ) : (
                currentItems.map((recipe) => {
                  const recipeId = recipe._id?.$oid || recipe._id || recipe.id;
                  const isFeatured = recipe.isFeatured || false;

                  return (
                    <tr
                      key={recipeId}
                      className="border-b border-zinc-100 dark:border-zinc-800/40 hover:bg-neutral-50/50 dark:hover:bg-zinc-800/10"
                    >
                      <td className="p-4 font-bold flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-zinc-100">
                          <Image
                            src={recipe.image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=100"}
                            alt={recipe.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="line-clamp-1">{recipe.name}</span>
                      </td>
                      <td className="p-4">
                        <span className="bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md text-xs font-medium">
                          {recipe.category}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                       <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* ফিচার টগল বাটন */}
                          <button
                            onClick={() => handleToggleFeature(recipe, recipeId)}
                            className={`p-2 rounded-xl border transition-all ${
                              isFeatured
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-sm"
                                : "bg-zinc-50 border-zinc-200 text-zinc-400 hover:text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700"
                            }`}
                          >
                            <Star
                              size={15}
                              className={isFeatured ? "fill-current" : ""}
                            />
                          </button>

                          {/* ভিউ বাটন */}
                          <Link
                            href={`/browse-recipes/${recipe._id || recipe.id}`}
                            target="_blank"
                            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                          >
                            <Eye size={15} />
                          </Link>

                          {/* 🗑️ নতুন ডিলিট বাটন */}
                          <button
                            onClick={() => handleDeleteRecipe(recipeId)}
                            className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            title="Delete Recipe"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* 🏁 পেজিনেশন কন্ট্রোলস ফুটার */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-zinc-200 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-800/10">
              <span className="text-xs text-zinc-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRecipes.length)} of {filteredRecipes.length} recipes
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <span className="text-xs font-semibold px-2">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-zinc-800 transition-colors"
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