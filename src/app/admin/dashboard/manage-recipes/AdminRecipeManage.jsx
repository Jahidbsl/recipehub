"use client";

import React, { useEffect, useState } from "react";
import { Star, ChefHat, Eye, Search, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Importing the actual delete function along with other existing operations
import { getRecipes, patchRecipeFeature, } from "@/lib/api/recipes";
import { deleteRecipeAndReports } from "@/lib/actions/reports";

export default function AdminRecipeManage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

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

  useEffect(() => {
    fetchAllRecipes();
  }, []);

  const handleToggleFeature = async (recipe, recipeId) => {
    const stringId = typeof recipeId === "object" ? recipeId?.$oid : recipeId;
    const currentStatus = recipe.isFeatured || false;
    const newStatus = !currentStatus;

    try {
      await patchRecipeFeature(stringId, newStatus);

      setRecipes((prevRecipes) =>
        prevRecipes.map((r) => {
          const id = r._id?.$oid || r._id || r.id;
          return id === recipeId ? { ...r, isFeatured: newStatus } : r;
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

  const handleDeleteRecipe = async (recipeId) => {
    const stringId = typeof recipeId === "object" ? recipeId?.$oid : recipeId;
    
    if (!window.confirm("Are you absolutely sure you want to delete this recipe along with its associated records? ⚠️")) {
      return;
    }

    try {
      // Utilizing your existing deleteRecipeAndReports function from API configurations
      const response = await deleteRecipeAndReports(stringId);
      
      if (response && (response.success || response.status === 200 || response.ok)) {
        toast.success("Recipe and related data deleted successfully! 🔥");
        
        setRecipes((prevRecipes) => 
          prevRecipes.filter((r) => {
            const currentId = r._id?.$oid || r._id || r.id;
            return currentId !== recipeId;
          })
        );
      } else {
        toast.error(response?.message || "Failed to parse system deletion layout.");
      }
    } catch (error) {
      console.error("Deletion Pipeline Failure:", error);
      toast.error("Internal connection resolution crash.");
    }
  };

  const categories = ["All", ...new Set(recipes.map((r) => r.category).filter(Boolean))];

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRecipes.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-neutral-50/50 dark:bg-zinc-950/50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        <span className="ml-3 text-xs font-semibold text-zinc-500 tracking-wider mt-2">Syncing Control Records Layout...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-50 p-6 sm:p-8">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="max-w-5xl mx-auto space-y-5">
        
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-emerald-500" /> Admin Control Center
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white dark:bg-zinc-900 p-3.5 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="w-full sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50/70 dark:bg-zinc-800/30 border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-4">Recipe Name</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/40">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-zinc-400 font-medium">
                      No matching records localized in database registry! 📂
                    </td>
                  </tr>
                ) : (
                  currentItems.map((recipe) => {
                    const recipeId = recipe._id?.$oid || recipe._id || recipe.id;
                    const isFeatured = recipe.isFeatured || false;

                    return (
                      <tr
                        key={recipeId}
                        className="hover:bg-neutral-50/40 dark:hover:bg-zinc-800/10 transition-colors duration-150"
                      >
                        <td className="py-2 px-4 font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-3">
                          <div className="relative h-8 w-8 overflow-hidden rounded-md bg-zinc-100 border border-zinc-200/40 dark:border-zinc-800">
                            <Image
                              src={recipe.image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=100"}
                              alt={recipe.name || "Recipe Thumbnail"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="line-clamp-1 max-w-[280px]">{recipe.name}</span>
                        </td>
                        <td className="py-2 px-4">
                          <span className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded text-[10px] font-medium border border-zinc-200/10">
                            {recipe.category || "General"}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            <button
                              onClick={() => handleToggleFeature(recipe, recipeId)}
                              className={`p-1.5 rounded-lg border transition-all ${
                                isFeatured
                                  ? "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-sm"
                                  : "bg-zinc-50 border-zinc-200 text-zinc-400 hover:text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:text-zinc-200"
                              }`}
                            >
                              <Star size={13} className={isFeatured ? "fill-current" : ""} />
                            </button>

                            <Link
                              href={`/browse-recipes/${recipeId}`}
                              target="_blank"
                              className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:bg-zinc-800 dark:hover:text-zinc-200 hover:text-zinc-600 transition-colors"
                            >
                              <Eye size={13} />
                            </Link>

                            <button
                              onClick={() => handleDeleteRecipe(recipeId)}
                              className="p-1.5 rounded-lg bg-red-500/5 border border-red-500/20 text-red-400 hover:text-red-600 hover:bg-red-500/10 dark:bg-red-500/10 dark:border-red-500/20 dark:hover:text-red-300 transition-colors"
                              title="Delete Recipe"
                            >
                              <Trash2 size={13} />
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

          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between p-3 border-t border-zinc-200 dark:border-zinc-800 bg-neutral-50/40 dark:bg-zinc-800/10 text-[11px]">
              <span className="text-zinc-400 font-medium">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRecipes.length)} of {filteredRecipes.length} recipes
              </span>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                
                <span className="font-semibold px-1 text-zinc-600 dark:text-zinc-300">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}